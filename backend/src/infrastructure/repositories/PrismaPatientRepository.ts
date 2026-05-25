import type { PrismaClient } from "@prisma/client";
import type { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import type {
  Patient,
  CreatePatientData,
  UpdatePatientData,
  PacientFilters,
} from "../../domain/entities/Patient";
import type { PaginationQuery } from "../../domain/shared/pagination";
import { DomainError } from "../../domain/errors/DomainError";
import { EncryptionService } from "../services/EncryptionService";

const crypto = new EncryptionService();

function toDomain(row: {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  agreement: string | null;
  street: string | null;
  streetNumber: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  additionalInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Patient {
  return {
    id: row.id,
    name: row.name,
    email: crypto.decrypt(row.email),
    phone: crypto.decrypt(row.phone),
    cpf: crypto.decrypt(row.cpf),
    dateOfBirth: row.dateOfBirth,
    gender: row.gender,
    agreement: crypto.decrypt(row.agreement),
    street: crypto.decrypt(row.street),
    streetNumber: crypto.decrypt(row.streetNumber),
    city: crypto.decrypt(row.city),
    state: crypto.decrypt(row.state),
    zipCode: crypto.decrypt(row.zipCode),
    additionalInfo: crypto.decrypt(row.additionalInfo),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaPatientRepository implements IPatientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Patient | null> {
    try {
      const row = await this.prisma.patient.findUnique({ where: { id } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar paciente: ${String(err)}`, 500);
    }
  }

  async findByCpf(cpf: string): Promise<Patient | null> {
    try {
      const row = await this.prisma.patient.findUnique({ where: { cpf: crypto.encrypt(cpf) ?? "" } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar paciente: ${String(err)}`, 500);
    }
  }

  private buildWhere(filters?: PacientFilters) {
    const where: Record<string, unknown> = {};
    if (filters?.search) {
      where.name = { contains: filters.search, mode: "insensitive" };
    }
    if (filters?.createdToday) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      where.createdAt = { gte: start, lte: end };
    }
    return where;
  }

  async findAll(
    pagination?: PaginationQuery,
    filters?: PacientFilters,
  ): Promise<Patient[]> {
    try {
      const rows = await this.prisma.patient.findMany({
        where: this.buildWhere(filters),
        orderBy: { name: "asc" },
        ...(pagination && {
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
        }),
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar pacientes: ${String(err)}`, 500);
    }
  }

  async count(filters?: PacientFilters): Promise<number> {
    try {
      return await this.prisma.patient.count({ where: this.buildWhere(filters) });
    } catch (err) {
      throw new DomainError(`Erro ao contar pacientes: ${String(err)}`, 500);
    }
  }

  async create(data: CreatePatientData): Promise<Patient> {
    try {
      const row = await this.prisma.patient.create({
        data: {
          ...data,
          email: crypto.encrypt(data.email ?? null),
          phone: crypto.encrypt(data.phone ?? null),
          cpf: crypto.encrypt(data.cpf ?? null),
          agreement: crypto.encrypt(data.agreement ?? null),
          street: crypto.encrypt(data.street ?? null),
          streetNumber: crypto.encrypt(data.streetNumber ?? null),
          city: crypto.encrypt(data.city ?? null),
          state: crypto.encrypt(data.state ?? null),
          zipCode: crypto.encrypt(data.zipCode ?? null),
          additionalInfo: crypto.encrypt(data.additionalInfo ?? null),
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        },
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao criar paciente: ${String(err)}`, 500);
    }
  }

  async update(id: string, data: UpdatePatientData): Promise<Patient> {
    try {
      const row = await this.prisma.patient.update({
        where: { id },
        data: {
          ...data,
          ...(data.email !== undefined && { email: crypto.encrypt(data.email) }),
          ...(data.phone !== undefined && { phone: crypto.encrypt(data.phone) }),
          ...(data.cpf !== undefined && { cpf: crypto.encrypt(data.cpf) }),
          ...(data.agreement !== undefined && { agreement: crypto.encrypt(data.agreement) }),
          ...(data.street !== undefined && { street: crypto.encrypt(data.street) }),
          ...(data.streetNumber !== undefined && { streetNumber: crypto.encrypt(data.streetNumber) }),
          ...(data.city !== undefined && { city: crypto.encrypt(data.city) }),
          ...(data.state !== undefined && { state: crypto.encrypt(data.state) }),
          ...(data.zipCode !== undefined && { zipCode: crypto.encrypt(data.zipCode) }),
          ...(data.additionalInfo !== undefined && { additionalInfo: crypto.encrypt(data.additionalInfo) }),
        },
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao atualizar paciente: ${String(err)}`, 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.patient.delete({ where: { id } });
    } catch (err) {
      throw new DomainError(`Erro ao deletar paciente: ${String(err)}`, 500);
    }
  }
}
