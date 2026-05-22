import type { Redis } from "ioredis";
import type { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import type {
  Appointment,
  AppointmentFilters,
  AppointmentWithRelations,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../../domain/entities/Appointment";
import type { PaginationQuery } from "../../domain/shared/pagination";
import { ConflictError } from "../../domain/errors/DomainError";

const TTL_SINGLE = 300; // 5 min — consulta por ID
const TTL_LIST = 120; // 2 min — listas por paciente/usuário

const key = {
  byId: (id: string) => `appt:id:${id}`,
  byIdRel: (id: string) => `appt:id-rel:${id}`,
  byPatient: (pid: string) => `appt:patient:${pid}`,
  byUser: (uid: string) => `appt:user:${uid}`,
  lockSlot: (doctorId: string, scheduledAt: string) =>
    `appt:lock:${doctorId}:${scheduledAt}`,
};

/**
 * Decorator sobre IAppointmentRepository que adiciona uma camada de cache Redis.
 *
 * Padrão Cache-Aside (Lazy Loading):
 *   1. Lê do Redis → HIT: retorna diretamente.
 *   2. MISS: busca no repositório subjacente (Prisma) → grava no Redis → retorna.
 *
 * Degradação graciosa: se o Redis estiver indisponível, todas as operações
 * caem silenciosamente para o banco sem lançar erros.
 *
 * O que é cacheado:
 *   - findById            → chave "appt:id:{id}"         TTL 300s
 *   - findByIdWithRelations → "appt:id-rel:{id}"         TTL 300s
 *   - findByPatientId (sem filtros extras) → "appt:patient:{pid}"  TTL 120s
 *   - findByUserId    (sem filtros extras) → "appt:user:{uid}"     TTL 120s
 *
 * O que NÃO é cacheado:
 *   - findAll / count: muitas combinações de filtros + paginação
 *   - listas com filtros (status, dateStart, dateEnd): variação muito alta
 */
export class CachedAppointmentRepository implements IAppointmentRepository {
  constructor(
    private readonly repo: IAppointmentRepository,
    private readonly redis: Redis,
  ) {}

  // ── helpers internos ─────────────────────────────────────────────────────────


  private async getCached<T>(
    cacheKey: string,
    ttl: number,
    fetch: () => Promise<T | null>,
  ): Promise<T | null> {
    try {
      const raw = await this.redis.get(cacheKey);
      if (raw !== null) return JSON.parse(raw, this.dateReviver) as T;
    } catch {
      // Redis indisponível — continua sem cache
    }

    const value = await fetch();

    if (value !== null) {
      try {
        await this.redis.set(cacheKey, JSON.stringify(value), "EX", ttl);
      } catch {
        /* ignora erros de escrita */
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

  async findById(id: string): Promise<Appointment | null> {
    return this.getCached(key.byId(id), TTL_SINGLE, () =>
      this.repo.findById(id),
    );
  }

  async findByIdWithRelations(
    id: string,
  ): Promise<AppointmentWithRelations | null> {
    return this.getCached(key.byIdRel(id), TTL_SINGLE, () =>
      this.repo.findByIdWithRelations(id),
    );
  }

  async findByPatientId(
    patientId: string,
    filters?: Pick<AppointmentFilters, "status" | "dateStart" | "dateEnd">,
  ): Promise<Appointment[]> {
    // listas com filtros têm variação alta — vão direto ao banco
    if (filters && Object.keys(filters).length > 0) {
      return this.repo.findByPatientId(patientId, filters);
    }
    const result = await this.getCached<Appointment[]>(
      key.byPatient(patientId),
      TTL_LIST,
      async () => this.repo.findByPatientId(patientId),
    );
    return result ?? [];
  }

  async findByUserId(
    userId: string,
    filters?: Pick<AppointmentFilters, "status" | "dateStart" | "dateEnd">,
  ): Promise<Appointment[]> {
    if (filters && Object.keys(filters).length > 0) {
      return this.repo.findByUserId(userId, filters);
    }
    const result = await this.getCached<Appointment[]>(
      key.byUser(userId),
      TTL_LIST,
      async () => this.repo.findByUserId(userId),
    );
    return result ?? [];
  }

  // findAll e count não são cacheados (muitas combinações de filtros/paginação)
  async findAll(
    filters?: AppointmentFilters,
    pagination?: PaginationQuery,
  ): Promise<Appointment[]> {
    return this.repo.findAll(filters, pagination);
  }

  async count(filters?: AppointmentFilters): Promise<number> {
    return this.repo.count(filters);
  }

  // ── mutações (gravam no banco e invalidam cache) ──────────────────────────────

  async create(data: CreateAppointmentData): Promise<Appointment> {
    const normalized = this.normalizeDate(data.scheduledAt);
    const lockKey = key.lockSlot(data.userId, normalized);

    // Tenta adquirir lock distribuído (Redis SET NX).
    // TTL de 30s: safety net caso o processo morra antes do DEL explícito.
    let redisUp = true;
    let lockAcquired = false;

    try {
      const result = await this.redis.set(lockKey, "1", "EX", 30, "NX");
      lockAcquired = result === "OK";
    } catch {
      // Redis indisponível — prossegue sem lock (degradação graciosa).
      // Colisões remanescentes são contidas pela constraint do banco.
      redisUp = false;
    }

    // Só rejeita quando o Redis está UP e o lock já pertence a outra requisição
    if (redisUp && !lockAcquired) {
      throw new ConflictError("Este horário já está sendo agendado. Tente novamente em instantes.");
    }

    try {
      const appointment = await this.repo.create(data);

      await this.invalidate(
        key.byPatient(appointment.patientId),
        key.byUser(appointment.userId),
      );

      return appointment;
    } finally {
      // Libera o lock imediatamente — não espera o TTL expirar
      if (lockAcquired) {
        await this.invalidate(lockKey);
      }
    }
  }

  async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    const appointment = await this.repo.update(id, data);
    await this.invalidate(
      key.byId(id),
      key.byIdRel(id),
      key.byPatient(appointment.patientId),
      key.byUser(appointment.userId),
    );
    return appointment;
  }

  async delete(id: string): Promise<void> {
    // lê do cache antes de deletar para saber quais listas invalidar
    const existing = await this.findById(id);
    await this.repo.delete(id);

    const toDelete: string[] = [key.byId(id), key.byIdRel(id)];
    if (existing) {
      toDelete.push(key.byPatient(existing.patientId));
      toDelete.push(key.byUser(existing.userId));
    }
    await this.invalidate(...toDelete);
  }

  private normalizeDate(date: Date | string) {
    const d = new Date(date);

    const iso = d.toISOString(); // UTC
    return iso.slice(0, 16); // "YYYY-MM-DDTHH:mm"
  }
}
