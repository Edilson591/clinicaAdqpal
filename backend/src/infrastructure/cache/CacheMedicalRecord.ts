import Redis from "ioredis";
import type { IMedicalRecordRepository } from "../../domain/repositories/IMedicalRecordRepository";
// CreateMedicalRecordData is declared locally in the repository file but not exported there;
// derive it from the repository interface instead.
import { PacientFilters } from "../../domain/entities/Patient";
import { PaginationQuery } from "../../domain/shared/pagination";
import { MedicalRecord } from "../../domain/entities/MedicalRecord";

type UpdateMedicalRecordData = Parameters<
  IMedicalRecordRepository["update"]
>[1];
type CreateMedicalRecordData = Parameters<
  IMedicalRecordRepository["create"]
>[0];

const TTL_SINGLE = 300; // 5 min — consulta por ID/CPF
const TTL_LIST = 120; // 2 min — listas paginadas

export class CacheMedicalRecord implements IMedicalRecordRepository {
  constructor(
    private readonly repo: IMedicalRecordRepository,
    private readonly redis: Redis,
  ) {}

  private async getListVersion(): Promise<string> {
    try {
      const version = await this.redis.get("medicalRecord:list:version");
      if (!version) {
        // Se não existir, define como 1 e retorna
        await this.redis.set("medicalRecord:list:version", "1", "EX", 86400); // 1 dia safety net
        return "1";
      }
      return version;
    } catch {
      return "fallback";
    }
  }

  private async invalidateLists(): Promise<void> {
    try {
      await this.redis.incr("medicalRecord:list:version");
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
    return `medicalRecord:list:v${version}:${hash}`;
  }

  private key = {
    byId: (id: string) => `medicalRecord:id:${id}`,
    byCpf: (cpf: string) => `medicalRecord:cpf:${cpf}`,
    byAppointment: (appointmentId: string) =>
      `medicalRecord:appointment:${appointmentId}`,
    byPatient: (patientId: string) => `medicalRecord:patient:${patientId}`,
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

  async findById(id: string): Promise<MedicalRecord | null> {
    return this.getCached(this.key.byId(id), TTL_SINGLE, () =>
      this.repo.findById(id),
    );
  }

  async findByAppointmentId(
    appointmentId: string,
  ): Promise<MedicalRecord | null> {
    return this.getCached(
      this.key.byAppointment(appointmentId),
      TTL_SINGLE,
      () => this.repo.findByAppointmentId(appointmentId),
    );
  }

  async findByPatientId(patientId: string): Promise<MedicalRecord[]> {
    const cacheKey = this.key.byPatient(patientId);
    const result = await this.getCached<MedicalRecord[]>(
      cacheKey,
      TTL_LIST,
      () => this.repo.findByPatientId(patientId),
    );
    return result ?? [];
  }

  async findAll(
    pagination?: PaginationQuery,
    filters?: PacientFilters,
  ): Promise<MedicalRecord[]> {
    const cacheKey = await this.generateListKey(filters, pagination);

    const result = await this.getCached<MedicalRecord[]>(
      cacheKey,
      TTL_LIST,
      () => this.repo.findAll(pagination, filters),
    );

    return result ?? [];
  }

  async count(filters?: PacientFilters): Promise<number> {
    // Como o count muda junto com a lista, atrelamos à mesma versão de lista
    const version = await this.getListVersion();
    const hash = Buffer.from(JSON.stringify(filters)).toString("base64");
    const cacheKey = `medicalRecord:count:v${version}:${hash}`;

    const result = await this.getCached<number>(cacheKey, TTL_LIST, () =>
      this.repo.count(filters),
    );

    return result ?? 0;
  }

  // ── mutações (gravam no banco e invalidam cache) ──────────────────────────────

  async create(data: CreateMedicalRecordData): Promise<MedicalRecord> {
    const patient = await this.repo.create(data);

    // Invalida as listagens gerais imediatamente
    await this.invalidateLists();

    return patient;
  }

  async update(
    id: string,
    data: UpdateMedicalRecordData,
  ): Promise<MedicalRecord> {
    const patient = await this.repo.update(id, data);

    const toInvalidate = [this.key.byId(id)];
    // Se o paciente atualizado tiver CPF, limpa o cache do CPF dele também
    if (patient.id) {
      const normalizedCpf = patient.id.replace(/\D/g, "");
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
    if (existing?.id) {
      const normalizedCpf = existing.id.replace(/\D/g, "");
      toInvalidate.push(this.key.byCpf(normalizedCpf));
    }

    await this.invalidate(...toInvalidate);
    await this.invalidateLists();
  }
}
