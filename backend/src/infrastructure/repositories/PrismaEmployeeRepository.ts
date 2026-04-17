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
    cpf: row.cpf,
    email: row.email,
    phone: row.phone,
    position: row.position,
    department: row.department,
    hireDate: row.hireDate,
    salary: row.salary != null ? Number(row.salary) : null,
    status: row.status as EmployeeStatus,
    dateOfBirth: row.dateOfBirth,
    gender: row.gender,
    street: row.street,
    streetNumber: row.streetNumber,
    city: row.city,
    state: row.state,
    zipCode: row.zipCode,
    notes: row.notes,
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
      const row = await this.prisma.employee.findUnique({ where: { cpf } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar funcionário: ${String(err)}`, 500);
    }
  }

  async findByEmail(email: string): Promise<Employee | null> {
    try {
      const row = await this.prisma.employee.findUnique({ where: { email } });
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
          cpf: data.cpf ?? null,
          email: data.email ?? null,
          phone: data.phone ?? null,
          position: data.position,
          department: data.department ?? null,
          hireDate: data.hireDate ? new Date(data.hireDate) : null,
          salary: data.salary ?? null,
          status: data.status ?? "ACTIVE",
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          gender: data.gender ?? null,
          street: data.street ?? null,
          streetNumber: data.streetNumber ?? null,
          city: data.city ?? null,
          state: data.state ?? null,
          zipCode: data.zipCode ?? null,
          notes: data.notes ?? null,
        },
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao criar funcionário: ${String(err)}`, 500);
    }
  }

  async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
    try {
      const row = await this.prisma.employee.update({ where: { id }, data });
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
