import type { PrismaClient } from "@prisma/client";
import type { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
  AppointmentWithRelations,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../../domain/entities/Appointment";
import type { PaginationQuery } from "../../domain/shared/pagination";
import { DomainError } from "../../domain/errors/DomainError";

function toDomain(row: {
  id: string;
  userId: string;
  patientId: string;
  scheduledAt: Date;
  medico: string | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Appointment {
  return {
    id: row.id,
    userId: row.userId,
    patientId: row.patientId,
    scheduledAt: row.scheduledAt,
    medico: row.medico,
    status: row.status as AppointmentStatus,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// =============================================================================
// WHERE BUILDERS
// =============================================================================

/** Parseia "HH:MM" e aplica ao Date base em UTC — retorna novo Date */
function applyTime(base: Date, hhmm: string, endOfMinute = false): Date {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(
    base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(),
    h, m, endOfMinute ? 59 : 0, endOfMinute ? 999 : 0,
  ));
}

/** Condição impossível — garante que nenhum registro seja retornado */
const MATCH_NOTHING = { scheduledAt: { gte: new Date("9999-12-31T23:59:59Z"), lte: new Date(0) } };

/** Filtros comuns a todos os métodos (status + intervalo de datas) */
function buildBaseWhere(filters?: Pick<AppointmentFilters, "status" | "date" | "timeStart" | "timeEnd" | "dateStart" | "dateEnd">) {
  // timeStart/timeEnd sem date → não faz sentido, retorna nada
  if ((filters?.timeStart || filters?.timeEnd) && !filters?.date) {
    return MATCH_NOTHING;
  }

  let gte: Date | undefined = filters?.dateStart;
  let lte: Date | undefined = filters?.dateEnd;

  if (filters?.date) {
    const d = new Date(filters.date);
    // Usa UTC para evitar bugs de timezone ao parsear "YYYY-MM-DD"
    gte = filters.timeStart
      ? applyTime(d, filters.timeStart)
      : new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
    lte = filters.timeEnd
      ? applyTime(d, filters.timeEnd, true)
      : new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  }

  return {
    ...(filters?.status ? { status: filters.status } : {}),
    ...(gte || lte ? { scheduledAt: { gte, lte } } : {}),
  };
}

/** Where completo para findAll — inclui userId, patientId e busca textual */
function buildFindAllWhere(filters?: AppointmentFilters) {
  const base = buildBaseWhere(filters);

  return {
    ...base,
    ...(filters?.userId ? { userId: filters.userId } : {}),
    ...(filters?.patientId ? { patientId: filters.patientId } : {}),
    ...(filters?.search
      ? {
          OR: [
            { patient: { name: { contains: filters.search, mode: "insensitive" as const } } },
            { medico:   { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

// =============================================================================
// REPOSITORY
// =============================================================================

export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Appointment | null> {
    try {
      const row = await this.prisma.appointment.findUnique({ where: { id } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar consulta: ${String(err)}`, 500);
    }
  }

  async findByIdWithRelations(
    id: string,
  ): Promise<AppointmentWithRelations | null> {
    try {
      const row = await this.prisma.appointment.findUnique({
        where: { id },
        include: {
          patient: {
            select: { id: true, name: true, phone: true, email: true },
          },
          user: { select: { id: true, username: true, email: true } },
        },
      });
      if (!row) return null;
      return {
        ...toDomain(row),
        patient: row.patient,
        user: row.user,
      };
    } catch (err) {
      throw new DomainError(`Erro ao buscar consulta: ${String(err)}`, 500);
    }
  }

  async findByPatientId(
    patientId: string,
    filters?: Pick<AppointmentFilters, "status" | "dateStart" | "dateEnd">,
  ): Promise<Appointment[]> {
    try {
      const rows = await this.prisma.appointment.findMany({
        where: {
          patientId,
          ...buildBaseWhere(filters),
        },
        orderBy: { scheduledAt: "desc" },
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar consultas: ${String(err)}`, 500);
    }
  }

  async findByUserId(
    userId: string,
    filters?: Pick<AppointmentFilters, "status" | "dateStart" | "dateEnd">,
  ): Promise<Appointment[]> {
    try {
      const rows = await this.prisma.appointment.findMany({
        where: {
          userId,
          ...buildBaseWhere(filters),
        },
        orderBy: { scheduledAt: "desc" },
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar consultas: ${String(err)}`, 500);
    }
  }

  async findAll(filters?: AppointmentFilters, pagination?: PaginationQuery): Promise<Appointment[]> {
    try {
      const rows = await this.prisma.appointment.findMany({
        where: buildFindAllWhere(filters),
        orderBy: { scheduledAt: "desc" },
        ...(pagination && {
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
        }),
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar consultas: ${String(err)}`, 500);
    }
  }

  async count(filters?: AppointmentFilters): Promise<number> {
    try {
      return await this.prisma.appointment.count({ where: buildFindAllWhere(filters) });
    } catch (err) {
      throw new DomainError(`Erro ao contar consultas: ${String(err)}`, 500);
    }
  }

  async create(data: CreateAppointmentData): Promise<Appointment> {
    try {
      const row = await this.prisma.appointment.create({ data });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao criar consulta: ${String(err)}`, 500);
    }
  }

  async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    try {
      const row = await this.prisma.appointment.update({ where: { id }, data });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao atualizar consulta: ${String(err)}`, 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.appointment.delete({ where: { id } });
    } catch (err) {
      throw new DomainError(`Erro ao deletar consulta: ${String(err)}`, 500);
    }
  }
}
