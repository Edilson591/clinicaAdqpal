import { createHash, randomBytes, timingSafeEqual } from "crypto";
import type { NextFunction, Request, Response } from "express";
import type { Prisma } from "@prisma/client";
import prisma from "../../infrastructure/database/prismaClient";
import { DomainError, NotFoundError, UnauthorizedError } from "../../domain/errors/DomainError";
import {
  CreateIncidentSchema,
  CreatePrivacyRequestSchema,
  RunRetentionSchema,
  UpdateIncidentSchema,
  UpdatePrivacyRequestSchema,
  UpsertRetentionPolicySchema,
} from "../../application/dtos/PrivacyDTOs";

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start);
  let remaining = days;
  while (remaining > 0) {
    result.setUTCDate(result.getUTCDate() + 1);
    const weekday = result.getUTCDay();
    if (weekday !== 0 && weekday !== 6) remaining -= 1;
  }
  return result;
}

function publicRequest(request: {
  protocol: string;
  requestType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}) {
  return request;
}

export class PrivacyController {
  async createRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = CreatePrivacyRequestSchema.parse(req.body);
      const accessToken = randomBytes(32).toString("base64url");
      const protocol = `LGPD-${new Date().getUTCFullYear()}-${randomBytes(6).toString("hex").toUpperCase()}`;
      const request = await prisma.privacyRequest.create({
        data: {
          ...data,
          protocol,
          accessTokenHash: sha256(accessToken),
          events: { create: { action: "REQUEST_CREATED" } },
        },
      });
      res.status(201).json({
        success: true,
        message: "Solicitação registrada. Guarde a chave de acompanhamento; ela não será exibida novamente.",
        data: { ...publicRequest(request), accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.get("X-Request-Access-Token");
      if (!token) throw new UnauthorizedError("Chave de acompanhamento não fornecida.");
      const request = await prisma.privacyRequest.findUnique({ where: { protocol: String(req.params.protocol) } });
      if (!request) throw new NotFoundError("Solicitação");
      const supplied = Buffer.from(sha256(token), "hex");
      const expected = Buffer.from(request.accessTokenHash, "hex");
      if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
        throw new UnauthorizedError("Protocolo ou chave de acompanhamento inválidos.");
      }
      res.json({ success: true, data: publicRequest(request) });
    } catch (error) {
      next(error);
    }
  }

  async listRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = typeof req.query.status === "string" ? req.query.status : undefined;
      const requests = await prisma.privacyRequest.findMany({
        where: status ? { status: status as never } : undefined,
        select: {
          id: true, protocol: true, requesterName: true, requesterEmail: true,
          subjectType: true, requestType: true, description: true, status: true,
          identityVerifiedAt: true, decisionReason: true, assignedTo: true,
          completedAt: true, createdAt: true, updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      });
      res.json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  async updateRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = UpdatePrivacyRequestSchema.parse(req.body);
      const existing = await prisma.privacyRequest.findUnique({ where: { id: String(req.params.id) } });
      if (!existing) throw new NotFoundError("Solicitação");
      const completedAt = data.status === "COMPLETED" ? new Date() : undefined;
      const identityVerifiedAt = data.identityVerified === true
        ? new Date()
        : data.identityVerified === false ? null : undefined;
      const updateData: Prisma.PrivacyRequestUpdateInput = {
        ...(data.status ? { status: data.status } : {}),
        ...(data.decisionReason !== undefined ? { decisionReason: data.decisionReason } : {}),
        ...(data.assignedTo !== undefined ? { assignedTo: data.assignedTo } : {}),
        ...(identityVerifiedAt !== undefined ? { identityVerifiedAt } : {}),
        ...(completedAt ? { completedAt } : {}),
        events: {
          create: {
            actorId: req.userId,
            action: "REQUEST_UPDATED",
            details: { previousStatus: existing.status, newStatus: data.status ?? existing.status },
          },
        },
      };
      const updated = await prisma.privacyRequest.update({ where: { id: existing.id }, data: updateData });
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async listPolicies(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policies = await prisma.retentionPolicy.findMany({ include: { runs: { orderBy: { createdAt: "desc" }, take: 10 } } });
      res.json({ success: true, data: policies });
    } catch (error) {
      next(error);
    }
  }

  async upsertPolicy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = UpsertRetentionPolicySchema.parse(req.body);
      const policy = await prisma.retentionPolicy.upsert({
        where: { category: data.category },
        create: data,
        update: data,
      });
      res.json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  }

  async runPolicy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = RunRetentionSchema.parse(req.body);
      const policy = await prisma.retentionPolicy.findUnique({ where: { id: String(req.params.id) } });
      if (!policy) throw new NotFoundError("Política de retenção");
      if (!policy.enabled || !policy.retentionDays) throw new DomainError("A política precisa estar habilitada e possuir prazo fundamentado.", 409);
      if (!input.dryRun && input.confirmation !== policy.category) {
        throw new DomainError(`Confirme a execução informando ${policy.category}.`, 409);
      }
      if (!input.dryRun && policy.action !== "DELETE") {
        throw new DomainError("Ações de anonimização e revisão exigem tratamento específico e não são executadas em lote.", 409);
      }
      const cutoffAt = new Date(Date.now() - policy.retentionDays * 86_400_000);
      const affectedCount = await this.countRetentionCandidates(policy.category, cutoffAt);
      if (!input.dryRun) await this.deleteRetentionCandidates(policy.category, cutoffAt);
      const run = await prisma.$transaction(async (tx) => {
        const created = await tx.retentionRun.create({
          data: {
            policyId: policy.id,
            executedBy: req.userId,
            dryRun: input.dryRun,
            cutoffAt,
            affectedCount,
            result: input.dryRun ? "PREVIEW_COMPLETED" : "DELETION_COMPLETED",
          },
        });
        if (!input.dryRun) await tx.retentionPolicy.update({ where: { id: policy.id }, data: { lastRunAt: new Date() } });
        return created;
      });
      res.json({ success: true, data: run });
    } catch (error) {
      next(error);
    }
  }

  async createIncident(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = CreateIncidentSchema.parse(req.body);
      const incident = await prisma.securityIncident.create({
        data: {
          ...data,
          affectedSubjects: data.affectedSubjects ?? null,
          notificationDeadline: addBusinessDays(data.discoveredAt, 3),
          createdBy: req.userId,
          events: { create: { actorId: req.userId, action: "INCIDENT_CREATED" } },
        },
      });
      res.status(201).json({ success: true, data: incident });
    } catch (error) {
      next(error);
    }
  }

  async listIncidents(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const incidents = await prisma.securityIncident.findMany({ orderBy: { discoveredAt: "desc" }, take: 200 });
      res.json({ success: true, data: incidents });
    } catch (error) {
      next(error);
    }
  }

  async updateIncident(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = UpdateIncidentSchema.parse(req.body);
      const existing = await prisma.securityIncident.findUnique({ where: { id: String(req.params.id) } });
      if (!existing) throw new NotFoundError("Incidente");
      const { markHumanReviewed, ...changes } = data;
      const incident = await prisma.securityIncident.update({
        where: { id: existing.id },
        data: {
          ...changes,
          ...(markHumanReviewed ? { reviewedBy: req.userId, reviewedAt: new Date() } : {}),
          events: {
            create: {
              actorId: req.userId,
              action: "INCIDENT_UPDATED",
              details: { previousStatus: existing.status, newStatus: changes.status ?? existing.status },
            },
          },
        },
      });
      res.json({ success: true, data: incident });
    } catch (error) {
      next(error);
    }
  }

  private async countRetentionCandidates(category: string, cutoffAt: Date): Promise<number> {
    if (category === "PASSWORD_RESET_TOKENS") return prisma.passwordResetToken.count({ where: { createdAt: { lt: cutoffAt } } });
    if (category === "NOTIFICATION_OUTBOX") return prisma.notificationOutbox.count({ where: { createdAt: { lt: cutoffAt }, status: { in: ["SENT", "FAILED"] } } });
    if (category === "AUDIT_LOGS") return prisma.auditLog.count({ where: { createdAt: { lt: cutoffAt } } });
    throw new DomainError("Categoria de retenção não suportada.");
  }

  private async deleteRetentionCandidates(category: string, cutoffAt: Date): Promise<void> {
    if (category === "PASSWORD_RESET_TOKENS") {
      await prisma.passwordResetToken.deleteMany({ where: { createdAt: { lt: cutoffAt } } });
      return;
    }
    if (category === "NOTIFICATION_OUTBOX") {
      await prisma.notificationOutbox.deleteMany({ where: { createdAt: { lt: cutoffAt }, status: { in: ["SENT", "FAILED"] } } });
      return;
    }
    if (category === "AUDIT_LOGS") {
      await prisma.auditLog.deleteMany({ where: { createdAt: { lt: cutoffAt } } });
      return;
    }
    throw new DomainError("Categoria de retenção não suportada.");
  }
}
