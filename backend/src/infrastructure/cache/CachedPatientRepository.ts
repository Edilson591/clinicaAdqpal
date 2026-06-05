import type { Redis } from "ioredis";
import type { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import type {
  Patient,
  PacientFilters,
  CreatePatientData,
  UpdatePatientData,
} from "../../domain/entities/Patient";
import type { PaginationQuery } from "../../domain/shared/pagination";

const TTL_SINGLE = 300; // 5 min — consulta por ID/CPF
const TTL_LIST = 120; // 2 min — listas paginadas

export class CachedPatientRepository implements IPatientRepository {
  constructor(
    private readonly repo: IPatientRepository,
    private readonly redis: Redis,
  ) {}

  // ── helpers internos e gerenciamento de chaves ────────────────────────────────

  /**
   * Como listas mudam constantemente quando qualquer paciente é alterado,
   * usamos um "version counter" (namespaces). Ao incrementar essa versão,
   * todas as chaves antigas de lista expiram virtualmente e vão ao banco,
   * evitando varrer o Redis com comandos pesados (ex: KEYS ou SCAN).
   */
  private async getListVersion(): Promise<string> {
    try {
      const version = await this.redis.get("patient:list:version");
      if (!version) {
        // Se não existir, define como 1 e retorna
        await this.redis.set("patient:list:version", "1", "EX", 86400); // 1 dia safety net
        return "1";
      }
      return version;
    } catch {
      return "fallback";
    }
  }

  private async invalidateLists(): Promise<void> {
    try {
      await this.redis.incr("patient:list:version");
    } catch {
      /* ignora */
    }
  }

  private async generateListKey(
    filters?: PacientFilters,
    pagination?: PaginationQuery,
  ): Promise<string> {
    const version = await this.getListVersion();
    const hash = Buffer.from(JSON.stringify({ filters, pagination })).toString(
      "base64",
    );
    return `patient:list:v${version}:${hash}`;
  }

  private key = {
    byId: (id: string) => `patient:id:${id}`,
    byCpf: (cpf: string) => `patient:cpf:${cpf}`,
  };
  private async getCached<T>(
    cacheKey: string,
    ttl: number,
    fetch: () => Promise<T | null>,
  ): Promise<T | null> {
    try {
      const raw = await this.redis.get(cacheKey);
      if (raw !== null) return JSON.parse(raw, this.dateReviver) as T;
    } catch {
      // Degradação graciosa
    }

    const value = await fetch();

    if (value !== null) {
      try {
        await this.redis.set(cacheKey, JSON.stringify(value), "EX", ttl);
      } catch {
        /* ignora */
      }
    }

    return value;
  }

  private dateReviver(_key: string, value: unknown): unknown {
    const isoLike =
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
    if (isoLike) return new Date(value);
    return value;
  }

  private async invalidate(...keys: string[]): Promise<void> {
    try {
      if (keys.length) await this.redis.del(...keys);
    } catch {
      /* ignora */
    }
  }

  // ── leituras ─────────────────────────────────────────────────────────────────

  async findById(id: string): Promise<Patient | null> {
    return this.getCached(this.key.byId(id), TTL_SINGLE, () =>
      this.repo.findById(id),
    );
  }

  async findAll(
    pagination?: PaginationQuery,
    filters?: PacientFilters,
  ): Promise<Patient[]> {
    const cacheKey = await this.generateListKey(filters, pagination);

    const result = await this.getCached<Patient[]>(cacheKey, TTL_LIST, () =>
      this.repo.findAll(pagination, filters),
    );

    return result ?? [];
  }

  async count(filters?: PacientFilters): Promise<number> {
    // Como o count muda junto com a lista, atrelamos à mesma versão de lista
    const version = await this.getListVersion();
    const hash = Buffer.from(JSON.stringify(filters)).toString("base64");
    const cacheKey = `patient:count:v${version}:${hash}`;

    const result = await this.getCached<number>(cacheKey, TTL_LIST, () =>
      this.repo.count(filters),
    );

    return result ?? 0;
  }

  // ── mutações (gravam no banco e invalidam cache) ──────────────────────────────

  async create(data: CreatePatientData): Promise<Patient> {
    const patient = await this.repo.create(data);

    // Invalida as listagens gerais imediatamente
    await this.invalidateLists();

    return patient;
  }

  async update(id: string, data: UpdatePatientData): Promise<Patient> {
    const patient = await this.repo.update(id, data);

    const toInvalidate = [this.key.byId(id)];
    // Se o paciente atualizado tiver CPF, limpa o cache do CPF dele também
    if (patient.cpf) {
      const normalizedCpf = patient.cpf.replace(/\D/g, "");
      toInvalidate.push(this.key.byCpf(normalizedCpf));
    }

    // Invalida os caches do registro individual e força a atualização das listas
    await this.invalidate(...toInvalidate);
    await this.invalidateLists();

    return patient;
  }

  async delete(id: string): Promise<void> {
    // Busca antes para saber o CPF/documento e conseguir limpar a chave por documento
    const existing = await this.findById(id);
    await this.repo.delete(id);

    const toInvalidate = [this.key.byId(id)];
    // Se o paciente atualizado tiver CPF, limpa o cache do CPF dele também
    if (existing?.cpf) {
      const normalizedCpf = existing.cpf.replace(/\D/g, "");
      toInvalidate.push(this.key.byCpf(normalizedCpf));
    }

    await this.invalidate(...toInvalidate);
    await this.invalidateLists();
  }

  async findByCpf(cpf: string): Promise<Patient | null> {
    // Remove qualquer caractere que não seja número para garantir consistência na chave
    const normalizedCpf = cpf.replace(/\D/g, "");

    return this.getCached(this.key.byCpf(normalizedCpf), TTL_SINGLE, () =>
      this.repo.findByCpf(cpf),
    );
  }
}
