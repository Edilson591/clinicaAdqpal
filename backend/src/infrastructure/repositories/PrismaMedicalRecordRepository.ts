import type { PrismaClient } from "@prisma/client";
import type { IMedicalRecordRepository } from "../../domain/repositories/IMedicalRecordRepository";
import type {
  MedicalRecord,
  CreateMedicalRecordData,
  UpdateMedicalRecordData,
} from "../../domain/entities/MedicalRecord";
import type { PaginationQuery } from "../../domain/shared/pagination";
import { DomainError } from "../../domain/errors/DomainError";

function toDomain(row: {
  id: string;
  appointmentId: string | null;
  patientId: string;
  diagnosis: string | null;
  prescription: string | null;
  notes: string | null;
  patient?: {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}): MedicalRecord {
  return {
    id: row.id,
    appointmentId: row.appointmentId,
    patientId: row.patientId,
    diagnosis: row.diagnosis,
    prescription: row.prescription,
    notes: row.notes,
    patient: row.patient ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaMedicalRecordRepository implements IMedicalRecordRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<MedicalRecord | null> {
    try {
      const row = await this.prisma.medicalRecord.findUnique({
        where: { id },
        include: {
          patient: {
            select: { id: true, name: true, phone: true, email: true },
          },
        },
      });

      if (!row) return null;

      if (!row?.appointmentId) {
        throw new Error("MedicalRecord sem appointmentId não é permitido");
      }

      return toDomain(row)
    } catch (err) {
      throw new DomainError(`Erro ao buscar prontuário: ${String(err)}`, 500);
    }
  }

  async findByAppointmentId(
    appointmentId: string,
  ): Promise<MedicalRecord | null> {
    try {
      const row = await this.prisma.medicalRecord.findUnique({
        where: { appointmentId },
        include: {
          patient: {
            select: { id: true, name: true, phone: true, email: true },
          },
        },
      });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar prontuário: ${String(err)}`, 500);
    }
  }

  async findByPatientId(patientId: string): Promise<MedicalRecord[]> {
    try {
      const rows = await this.prisma.medicalRecord.findMany({
        where: { patientId },
        include: {
          patient: {
            select: { id: true, name: true, phone: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar prontuários: ${String(err)}`, 500);
    }
  }

  async findAll(pagination?: PaginationQuery): Promise<MedicalRecord[]> {
    try {
      const rows = await this.prisma.medicalRecord.findMany({
        include: {
          patient: {
            select: { id: true, name: true, phone: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        ...(pagination && {
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
        }),
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar prontuários: ${String(err)}`, 500);
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.medicalRecord.count();
    } catch (err) {
      throw new DomainError(`Erro ao contar prontuários: ${String(err)}`, 500);
    }
  }

  async create(data: CreateMedicalRecordData): Promise<MedicalRecord> {
    try {
      const row = await this.prisma.medicalRecord.create({ data });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao criar prontuário: ${String(err)}`, 500);
    }
  }

  async update(
    id: string,
    data: UpdateMedicalRecordData,
  ): Promise<MedicalRecord> {
    try {
      const row = await this.prisma.medicalRecord.update({
        where: { id },
        data,
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(
        `Erro ao atualizar prontuário: ${String(err)}`,
        500,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.medicalRecord.delete({ where: { id } });
    } catch (err) {
      throw new DomainError(`Erro ao deletar prontuário: ${String(err)}`, 500);
    }
  }
}
