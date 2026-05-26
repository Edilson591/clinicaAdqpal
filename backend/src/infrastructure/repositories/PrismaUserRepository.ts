import type { PrismaClient } from "@prisma/client";
import type { IUserRepository, UserFilters } from "../../domain/repositories/IUserRepository";
import type {
  User,
  CreateUserData,
  UpdateUserData,
} from "../../domain/entities/User";
import type { PaginationQuery } from "../../domain/shared/pagination";
import { DomainError } from "../../domain/errors/DomainError";
import { EncryptionService } from "../services/EncryptionService";

const crypto = new EncryptionService();

function toDomain(row: {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  roleId: number;
  cpf: string | null;
  cnpj: string | null;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.passwordHash,
    roleId: row.roleId,
    cpf: crypto.decrypt(row.cpf),
    cnpj: crypto.decrypt(row.cnpj),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private buildWhere(filters?: UserFilters) {
    const where: Record<string, unknown> = {};
    if (filters?.search) {
      where.OR = [
        { username: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters?.roleId !== undefined) {
      where.roleId = filters.roleId;
    }
    return where;
  }

  async findById(id: string): Promise<User | null> {
    try {
      const row = await this.prisma.user.findUnique({ where: { id } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar usuário`, 500);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const row = await this.prisma.user.findUnique({ where: { email } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar usuário`, 500);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const row = await this.prisma.user.findUnique({ where: { username } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar usuário`, 500);
    }
  }

  async findAll(pagination?: PaginationQuery, filters?: UserFilters): Promise<User[]> {
    try {
      const where = this.buildWhere(filters);
      const rows = await this.prisma.user.findMany({
        where,
        ...(pagination && {
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
        }),
        orderBy: { createdAt: "desc" },
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar usuários: ${String(err)}`, 500);
    }
  }

  async count(filters?: UserFilters): Promise<number> {
    try {
      const where = this.buildWhere(filters);
      return await this.prisma.user.count({ where });
    } catch (err) {
      throw new DomainError(`Erro ao contar usuários: ${String(err)}`, 500);
    }
  }

  async create(data: CreateUserData): Promise<User> {
    try {
      const row = await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          passwordHash: data.passwordHash,
          roleId: data.roleId,
          cpf: crypto.encrypt(data.cpf ?? null),
          cnpj: crypto.encrypt(data.cnpj ?? null),
        },
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao criar usuário: ${String(err)}`, 500);
    }
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    try {
      const row = await this.prisma.user.update({
        where: { id },
        data: {
          ...(data.username !== undefined && { username: data.username }),
          ...(data.email !== undefined && { email: data.email }),
          ...(data.passwordHash !== undefined && {
            passwordHash: data.passwordHash,
          }),
          ...(data.roleId !== undefined && { roleId: data.roleId }),
          ...(data.cpf !== undefined && { cpf: crypto.encrypt(data.cpf) }),
          ...(data.cnpj !== undefined && { cnpj: crypto.encrypt(data.cnpj) }),
        },
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao atualizar usuário: ${String(err)}`, 500);
    }
  }

  async updateSpecialties(userId: string, specialtyIds: string[]): Promise<void> {
    try {
      await this.prisma.$transaction([
        this.prisma.doctorSpecialty.deleteMany({ where: { doctorId: userId } }),
        ...(specialtyIds.length > 0
          ? [
              this.prisma.doctorSpecialty.createMany({
                data: specialtyIds.map((specialtyId) => ({ doctorId: userId, specialtyId })),
                skipDuplicates: true,
              }),
            ]
          : []),
      ]);
    } catch (err) {
      throw new DomainError(`Erro ao atualizar especialidades: ${String(err)}`, 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (err) {
      throw new DomainError(`Erro ao deletar usuário: ${String(err)}`, 500);
    }
  }
}
