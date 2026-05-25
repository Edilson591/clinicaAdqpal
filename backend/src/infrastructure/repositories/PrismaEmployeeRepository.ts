import type { PrismaClient } from "@prisma/client";
import type { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import type {
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData,
  EmployeeFilters,
  EmployeeStatus,
} from "../../domain/entities/Employee";
import type { PaginationQuery } from "../../domain/shared/pagination";
import { DomainError } from "../../domain/errors/DomainError";
import { EncryptionService } from "../services/EncryptionService";

const crypto = new EncryptionService();

function toDomain(row: {
  id: string;
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  position: string;
  department: string | null;
  hireDate: Date | null;
  salary: unknown;
  status: string;
  dateOfBirth: Date | null;
  gender: string | null;
  street: string | null;
  streetNumber: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Employee {
  return {
    id: row.id,
    name: row.name,
    cpf: crypto.decrypt(row.cpf),
    email: crypto.decrypt(row.email),
    phone: crypto.decrypt(row.phone),
    position: row.position,
    department: row.department,
    hireDate: row.hireDate,
    salary: row.salary != null ? Number(row.salary) : null,
    status: row.status as EmployeeStatus,
    dateOfBirth: row.dateOfBirth,
    gender: row.gender,
    street: crypto.decrypt(row.street),
    streetNumber: crypto.decrypt(row.streetNumber),
    city: crypto.decrypt(row.city),
    state: crypto.decrypt(row.state),
    zipCode: crypto.decrypt(row.zipCode),
    notes: crypto.decrypt(row.notes),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaEmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Employee | null> {
    try {
      const row = await this.prisma.employee.findUnique({ where: { id } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar funcionário: ${String(err)}`, 500);
    }
  }

  async findByCpf(cpf: string): Promise<Employee | null> {
    try {
      const row = await this.prisma.employee.findUnique({ where: { cpf: crypto.encrypt(cpf) ?? "" } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar funcionário: ${String(err)}`, 500);
    }
  }

  async findByEmail(email: string): Promise<Employee | null> {
    try {
      const row = await this.prisma.employee.findUnique({ where: { email: crypto.encrypt(email) ?? "" } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar funcionário: ${String(err)}`, 500);
    }
  }

  private buildWhere(filters?: EmployeeFilters) {
    const where: Record<string, unknown> = {};
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { position: { contains: filters.search, mode: "insensitive" } },
        { department: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.department) {
      where.department = { contains: filters.department, mode: "insensitive" };
    }
    return where;
  }

  async findAll(pagination?: PaginationQuery, filters?: EmployeeFilters): Promise<Employee[]> {
    try {
      const rows = await this.prisma.employee.findMany({
        where: this.buildWhere(filters),
        orderBy: { name: "asc" },
        ...(pagination && {
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
        }),
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar funcionários: ${String(err)}`, 500);
    }
  }

  async count(filters?: EmployeeFilters): Promise<number> {
    try {
      return await this.prisma.employee.count({ where: this.buildWhere(filters) });
    } catch (err) {
      throw new DomainError(`Erro ao contar funcionários: ${String(err)}`, 500);
    }
  }

  async create(data: CreateEmployeeData): Promise<Employee> {
    try {
      const row = await this.prisma.employee.create({
        data: {
          name: data.name,
          cpf: crypto.encrypt(data.cpf ?? null),
          email: crypto.encrypt(data.email ?? null),
          phone: crypto.encrypt(data.phone ?? null),
          position: data.position,
          department: data.department ?? null,
          hireDate: data.hireDate ? new Date(data.hireDate) : null,
          salary: data.salary ?? null,
          status: data.status ?? "ACTIVE",
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          gender: data.gender ?? null,
          street: crypto.encrypt(data.street ?? null),
          streetNumber: crypto.encrypt(data.streetNumber ?? null),
          city: crypto.encrypt(data.city ?? null),
          state: crypto.encrypt(data.state ?? null),
          zipCode: crypto.encrypt(data.zipCode ?? null),
          notes: crypto.encrypt(data.notes ?? null),
        },
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao criar funcionário: ${String(err)}`, 500);
    }
  }

  async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
    try {
      const row = await this.prisma.employee.update({
        where: { id },
        data: {
          ...data,
          ...(data.cpf !== undefined && { cpf: crypto.encrypt(data.cpf) }),
          ...(data.email !== undefined && { email: crypto.encrypt(data.email) }),
          ...(data.phone !== undefined && { phone: crypto.encrypt(data.phone) }),
          ...(data.street !== undefined && { street: crypto.encrypt(data.street) }),
          ...(data.streetNumber !== undefined && { streetNumber: crypto.encrypt(data.streetNumber) }),
          ...(data.city !== undefined && { city: crypto.encrypt(data.city) }),
          ...(data.state !== undefined && { state: crypto.encrypt(data.state) }),
          ...(data.zipCode !== undefined && { zipCode: crypto.encrypt(data.zipCode) }),
          ...(data.notes !== undefined && { notes: crypto.encrypt(data.notes) }),
        },
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao atualizar funcionário: ${String(err)}`, 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.employee.delete({ where: { id } });
    } catch (err) {
      throw new DomainError(`Erro ao deletar funcionário: ${String(err)}`, 500);
    }
  }
}
