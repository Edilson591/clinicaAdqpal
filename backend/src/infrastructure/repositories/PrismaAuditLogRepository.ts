import type { PrismaClient, Prisma } from "@prisma/client";
import type { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import type { AuditLog, CreateAuditLogData } from "../../domain/entities/AuditLog";
import { DomainError } from "../../domain/errors/DomainError";

function toDomain(row: {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  before: unknown;
  after: unknown;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}): AuditLog {
  return {
    id: row.id,
    userId: row.userId,
    action: row.action as AuditLog["action"],
    entity: row.entity as AuditLog["entity"],
    entityId: row.entityId,
    before: row.before as Record<string, unknown> | null,
    after: row.after as Record<string, unknown> | null,
    ip: row.ip,
    userAgent: row.userAgent,
    createdAt: row.createdAt,
  };
}

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAuditLogData): Promise<AuditLog> {
    try {
      const row = await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId ?? null,
          before: (data.before ?? null) as Prisma.InputJsonValue,
          after: (data.after ?? null) as Prisma.InputJsonValue,
          ip: data.ip ?? null,
          userAgent: data.userAgent ?? null,
        },
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao criar log de auditoria: ${String(err)}`, 500);
    }
  }

  async findByUserId(userId: string, limit = 50): Promise<AuditLog[]> {
    try {
      const rows = await this.prisma.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao buscar logs de auditoria: ${String(err)}`, 500);
    }
  }

  async findByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    try {
      const rows = await this.prisma.auditLog.findMany({
        where: { entity, entityId },
        orderBy: { createdAt: "desc" },
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao buscar logs de auditoria: ${String(err)}`, 500);
    }
  }

  async findAll(limit = 100): Promise<AuditLog[]> {
    try {
      const rows = await this.prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao buscar logs de auditoria: ${String(err)}`, 500);
    }
  }
}
