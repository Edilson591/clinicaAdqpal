import type { Request } from "express";
import type { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";
import type { AuditAction, AuditEntity, CreateAuditLogData } from "../../domain/entities/AuditLog";

function computeDiff(before: unknown, after: unknown): { before: Record<string, unknown> | null; after: Record<string, unknown> | null } {
  if (!before || !after || typeof before !== "object" || typeof after !== "object") {
    return { before: before as Record<string, unknown>, after: after as Record<string, unknown> };
  }

  const b = before as Record<string, unknown>;
  const a = after as Record<string, unknown>;
  const EXCLUDE = new Set(["id", "createdAt", "updatedAt", "passwordHash"]);
  const diffB: Record<string, unknown> = {};
  const diffA: Record<string, unknown> = {};
  let hasDiff = false;

  const allKeys = new Set([...Object.keys(b), ...Object.keys(a)]);
  for (const key of allKeys) {
    if (EXCLUDE.has(key)) continue;
    if (b[key] === undefined && a[key] === undefined) continue;
    if (JSON.stringify(b[key]) !== JSON.stringify(a[key])) {
      diffB[key] = b[key] ?? null;
      diffA[key] = a[key] ?? null;
      hasDiff = true;
    }
  }

  return hasDiff ? { before: diffB, after: diffA } : { before: null, after: null };
}

export class AuditService {
  constructor(private readonly repository: IAuditLogRepository) {}

  private async log(data: CreateAuditLogData): Promise<void> {
    try {
      await this.repository.create(data);
    } catch {
      // Falha no audit log não deve quebrar a requisição principal
    }
  }

  private ip(req: Request): string | null {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    return req.ip ?? req.socket.remoteAddress ?? null;
  }

  private ua(req: Request): string | null {
    const ua = req.headers["user-agent"];
    return typeof ua === "string" ? ua : null;
  }

  private userId(req: Request): string {
    return (req as { userId?: string }).userId ?? "system";
  }

  async fromRequest(
    req: Request,
    action: AuditAction,
    entity: AuditEntity,
    extra?: Partial<CreateAuditLogData>,
  ): Promise<void> {
    await this.log({
      userId: this.userId(req),
      action,
      entity,
      ip: this.ip(req),
      userAgent: this.ua(req),
      ...extra,
    });
  }

  login(req: Request): Promise<void> {
    return this.fromRequest(req, "LOGIN", "USER");
  }

  loginFailed(req: Request): Promise<void> {
    return this.log({
      userId: "unknown",
      action: "LOGIN_FAILED",
      entity: "USER",
      ip: this.ip(req),
      userAgent: this.ua(req),
    });
  }

  logout(req: Request): Promise<void> {
    return this.fromRequest(req, "LOGOUT", "USER");
  }

  create(req: Request, entity: AuditEntity, entityId: string | string[], after?: unknown): Promise<void> {
    return this.fromRequest(req, "CREATE", entity, {
      entityId: Array.isArray(entityId) ? entityId[0] : entityId,
      after: after as Record<string, unknown>,
    });
  }

  update(
    req: Request,
    entity: AuditEntity,
    entityId: string | string[],
    before?: unknown,
    after?: unknown,
  ): Promise<void> {
    const diff = computeDiff(before, after);
    return this.fromRequest(req, "UPDATE", entity, {
      entityId: Array.isArray(entityId) ? entityId[0] : entityId,
      before: diff.before,
      after: diff.after,
    });
  }

  delete(req: Request, entity: AuditEntity, entityId: string | string[], before?: unknown): Promise<void> {
    return this.fromRequest(req, "DELETE", entity, {
      entityId: Array.isArray(entityId) ? entityId[0] : entityId,
      before: before as Record<string, unknown>,
    });
  }

  view(req: Request, entity: AuditEntity, entityId: string | string[]): Promise<void> {
    return this.fromRequest(req, "VIEW", entity, {
      entityId: Array.isArray(entityId) ? entityId[0] : entityId,
    });
  }

  export(req: Request, entity: AuditEntity, entityId?: string | string[]): Promise<void> {
    return this.fromRequest(req, "EXPORT", entity, {
      entityId: entityId ? (Array.isArray(entityId) ? entityId[0] : entityId) : undefined,
    });
  }

  permissionChange(req: Request, userId: string, before?: unknown, after?: unknown): Promise<void> {
    return this.fromRequest(req, "PERMISSION_CHANGE", "USER", {
      entityId: userId,
      before: before as Record<string, unknown>,
      after: after as Record<string, unknown>,
    });
  }
}
