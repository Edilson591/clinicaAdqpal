import type { AuditLog, CreateAuditLogData } from "../entities/AuditLog";

export interface IAuditLogRepository {
  create(data: CreateAuditLogData): Promise<AuditLog>;
  findByUserId(userId: string, limit?: number): Promise<AuditLog[]>;
  findByEntity(entity: string, entityId: string): Promise<AuditLog[]>;
  findAll(limit?: number): Promise<AuditLog[]>;
}
