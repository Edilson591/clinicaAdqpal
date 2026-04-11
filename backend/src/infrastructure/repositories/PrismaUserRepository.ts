import type { PrismaClient } from "@prisma/client";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  User,
  CreateUserData,
  UpdateUserData,
} from "../../domain/entities/User";
import type { PaginationQuery } from "../../domain/shared/pagination";
import { DomainError } from "../../domain/errors/DomainError";

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
    cpf: row.cpf,
    cnpj: row.cnpj,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    try {
      const row = await this.prisma.user.findUnique({ where: { id } });
      return row ? toDomain(row) : null;
    } catch (err) {
      // throw new DomainError(`Erro ao buscar usuário: ${String(err)}`, 500);
      throw new DomainError(`Erro ao buscar usuário`, 500);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const row = await this.prisma.user.findUnique({ where: { email } });
      return row ? toDomain(row) : null;
    } catch (err) {
      // throw new DomainError(`Erro ao buscar usuário: ${String(err)}`, 500);
      throw new DomainError(`Erro ao buscar usuário`, 500);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const row = await this.prisma.user.findUnique({ where: { username } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar usuário`, 500);
      throw new DomainError(`Erro ao buscar usuário: ${String(err)}`, 500);
    }
  }

  async findAll(pagination?: PaginationQuery): Promise<User[]> {
    try {
      const rows = await this.prisma.user.findMany({
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

  async count(): Promise<number> {
    try {
      return await this.prisma.user.count();
    } catch (err) {
      throw new DomainError(`Erro ao contar usuários: ${String(err)}`, 500);
    }
  }

  async create(data: CreateUserData): Promise<User> {
    try {
      // await this.prisma.role.createMany({
      //   data: [
      //     { name: "ADMIN" },
      //     { name: "USER" },
      //     { name: "DOCTOR" },
      //     { name: "NURSE" },
      //     { name: "RECEPTIONIST" },
      //     { name: "LAB_TECHNICIAN" },
      //     { name: "ACCOUNTANT" },
      //     { name: "PHARMACIST" },
      //     { name: "IT_SUPPORT" },
      //   ],
      //   skipDuplicates: true,
      // });

      // const role = await this.prisma.role.findUnique({
      //   where: { name: data.roleId === 1 ? "ADMIN" : "USER"}, // ex.: "USER"
      // });

      // if (!role) throw new Error("Role não existe");
      // data.roleId = role.id;

      const row = await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          passwordHash: data.passwordHash,
          roleId: data.roleId,
          cpf: data.cpf ?? null,
          cnpj: data.cnpj ?? null,
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
          ...(data.cpf !== undefined && { cpf: data.cpf }),
          ...(data.cnpj !== undefined && { cnpj: data.cnpj }),
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
