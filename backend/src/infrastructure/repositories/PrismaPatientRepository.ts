
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

function toDomain(row: any): Patient {
  // support both snake_case (DB) and camelCase (already-mapped) shapes
  const get = (snake: string, camel: string) => row[snake] ?? row[camel];

  return {
    id: get("id", "id"),
    name: get("name", "name"),
    email: crypto.decrypt(get("email", "email") ?? null),
    phone: crypto.decrypt(get("phone", "phone") ?? null),
    cpf: crypto.decrypt(get("cpf", "cpf") ?? null),
    dateOfBirth: get("date_of_birth", "dateOfBirth") ?? null,
    gender: get("gender", "gender") ?? null,
    agreement: crypto.decrypt(get("agreement", "agreement") ?? null),
    street: crypto.decrypt(get("street", "street") ?? null),
    streetNumber: crypto.decrypt(get("street_number", "streetNumber") ?? null),
    city: crypto.decrypt(get("city", "city") ?? null),
    state: crypto.decrypt(get("state", "state") ?? null),
    zipCode: crypto.decrypt(get("zip_code", "zipCode") ?? null),
    additionalInfo: crypto.decrypt(get("additional_info", "additionalInfo") ?? null),
    createdAt: get("created_at", "createdAt"),
    updatedAt: get("updated_at", "updatedAt"),
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
          name: data.name,
          registration_number: crypto.encrypt(data.registrationNumber ?? "") ?? "",
          email: crypto.encrypt(data.email ?? null),
          phone: crypto.encrypt(data.phone ?? null),
          cpf: crypto.encrypt(data.cpf ?? null),
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          gender: data.gender,
          agreement: crypto.encrypt(data.agreement ?? null),
          street: crypto.encrypt(data.street ?? null),
          streetNumber: crypto.encrypt(data.streetNumber ?? null),
          city: crypto.encrypt(data.city ?? null),
          state: crypto.encrypt(data.state ?? null),
          zipCode: crypto.encrypt(data.zipCode ?? null),
          additionalInfo: crypto.encrypt(data.additionalInfo ?? null),
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
          ...(data.name !== undefined && { name: data.name }),
          ...(data.email !== undefined && { email: crypto.encrypt(data.email) }),
          ...(data.phone !== undefined && { phone: crypto.encrypt(data.phone) }),
          ...(data.cpf !== undefined && { cpf: crypto.encrypt(data.cpf) }),
          ...(data.gender !== undefined && { gender: data.gender }),
          ...(data.agreement !== undefined && { agreement: crypto.encrypt(data.agreement) }),
          ...(data.street !== undefined && { street: crypto.encrypt(data.street) }),
          ...(data.streetNumber !== undefined && { streetNumber: crypto.encrypt(data.streetNumber) }),
          ...(data.city !== undefined && { city: crypto.encrypt(data.city) }),
          ...(data.state !== undefined && { state: crypto.encrypt(data.state) }),
          ...(data.zipCode !== undefined && { zipCode: crypto.encrypt(data.zipCode) }),
          ...(data.additionalInfo !== undefined && { additionalInfo: crypto.encrypt(data.additionalInfo) }),
          ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }),
          ...(data.registrationNumber !== undefined && { registration_number: crypto.encrypt(data.registrationNumber ?? "") ?? "" }),
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
