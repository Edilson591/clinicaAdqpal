import type { NextFunction, Request, Response } from "express";
import { AuditService } from "../../application/services/AuditService";
import { DomainError, UnauthorizedError } from "../../domain/errors/DomainError";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaAuditLogRepository } from "../../infrastructure/repositories/PrismaAuditLogRepository";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import {
  identityGatewayClient,
  type IdentityGatewayClient,
  type IdentityResponse,
} from "../../infrastructure/services/PaperlessAuthGatewayClient";
import { DelegatedAuthController } from "./DelegatedAuthController";
import { UserController } from "./UserController";

const EXTERNAL_PASSWORD_HASH = "external-auth:user-service";
const defaultUsers = new PrismaUserRepository(prisma);
const defaultAudit = new AuditService(new PrismaAuditLogRepository(prisma));
type UserAudit = Pick<AuditService, "create" | "update" | "delete">;

type ManagedUser = {
  id: string;
  username: string;
  email: string;
  roleId: number;
  cpf: string | null;
  cnpj: string | null;
  specialties: string[];
  createdAt: string;
  updatedAt: string;
};

export class PaperlessUserController {
  constructor(
    private readonly identity: IdentityGatewayClient = identityGatewayClient,
    private readonly users: IUserRepository = defaultUsers,
    private readonly audit: UserAudit = defaultAudit,
    private readonly legacyUsers = new UserController(),
    private readonly legacyAuth = new DelegatedAuthController(),
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const upstream = await this.request("POST", "/auth/integrations/clinical/users", req.body);
      if (isUnavailableRoute(upstream)) {
        await this.legacyAuth.register(req, res, next);
        return;
      }
      if (!isSuccess(upstream)) return relay(res, upstream);
      const user = readManagedUser(upstream.data);
      await this.syncProjection(user);
      await this.audit.create(req, "USER", user.id, user);
      relay(res, upstream);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const handled = await this.proxy(req, res, next, "GET", `/auth/integrations/clinical/users${querySuffix(req)}`);
    if (!handled) await this.legacyUsers.getAll(req, res, next);
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const handled = await this.proxy(req, res, next, "GET", `/auth/integrations/clinical/users/${req.params.id}`);
    if (!handled) await this.legacyUsers.getById(req, res, next);
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const body = req.body as { password?: string; currentPassword?: string };
      if (req.userRoleId !== 1 && "roleId" in (req.body as object)) {
        throw new DomainError("Você não tem permissão para alterar o tipo de usuário.", 403);
      }
      if (req.userRoleId !== 1 && body.password && !body.currentPassword) {
        throw new DomainError("Senha atual é obrigatória para alterar a senha.", 400);
      }
      const previous = await this.users.findById(id);
      const upstream = await this.request("PUT", `/auth/integrations/clinical/users/${id}`, req.body);
      if (isUnavailableRoute(upstream)) {
        await this.legacyUsers.update(req, res, next);
        return;
      }
      if (!isSuccess(upstream)) return relay(res, upstream);
      const user = readManagedUser(upstream.data);
      await this.syncProjection(user);
      await this.audit.update(req, "USER", id, previous ?? undefined, user);
      relay(res, upstream);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const previous = await this.users.findById(id);
      const upstream = await this.request("DELETE", `/auth/integrations/clinical/users/${id}`);
      if (isUnavailableRoute(upstream)) {
        await this.legacyUsers.delete(req, res, next);
        return;
      }
      if (!isSuccess(upstream)) return relay(res, upstream);

      try {
        await this.users.delete(id);
      } catch (error) {
        console.warn(`[clinical-api] Local user projection ${id} retained because it has clinical references`);
      }
      await this.audit.delete(req, "USER", id, previous ?? undefined);
      relay(res, upstream);
    } catch (error) {
      next(error);
    }
  }

  private async proxy(
    req: Request,
    res: Response,
    next: NextFunction,
    method: "GET" | "PUT" | "DELETE",
    path: string,
  ): Promise<boolean> {
    try {
      const upstream = await this.request(method, path, method === "PUT" ? req.body : undefined);
      if (isUnavailableRoute(upstream)) return false;
      relay(res, upstream);
      return true;
    } catch (error) {
      next(error);
      return true;
    }
  }

  private request(method: "GET" | "POST" | "PUT" | "DELETE", path: string, body?: unknown) {
    const serviceToken = process.env.IDENTITY_SERVICE_TOKEN;
    if (!serviceToken) throw new UnauthorizedError("Integração de identidade não configurada.");
    return this.identity.request({
      method,
      path,
      body,
      headers: {
        "content-type": "application/json",
        "x-identity-service-token": serviceToken,
      },
    });
  }

  private async syncProjection(user: ManagedUser): Promise<void> {
    const existing = await this.users.findById(user.id);
    if (existing) {
      await this.users.update(user.id, {
        username: user.username,
        email: user.email,
        roleId: user.roleId,
        cpf: user.cpf,
        cnpj: user.cnpj,
      });
    } else {
      await this.users.create({
        id: user.id,
        username: user.username,
        email: user.email,
        passwordHash: EXTERNAL_PASSWORD_HASH,
        roleId: user.roleId,
        cpf: user.cpf,
        cnpj: user.cnpj,
      });
    }
    await this.users.updateSpecialties(user.id, user.specialties);
  }
}

function readManagedUser(body: unknown): ManagedUser {
  if (!body || typeof body !== "object" || !("data" in body)) {
    throw new UnauthorizedError("Resposta inválida do serviço de identidade.");
  }
  const data = (body as { data: unknown }).data;
  if (!data || typeof data !== "object") {
    throw new UnauthorizedError("Resposta inválida do serviço de identidade.");
  }
  const user = data as Partial<ManagedUser>;
  if (
    typeof user.id !== "string"
    || typeof user.username !== "string"
    || typeof user.email !== "string"
    || typeof user.roleId !== "number"
    || !Array.isArray(user.specialties)
    || typeof user.createdAt !== "string"
    || typeof user.updatedAt !== "string"
  ) {
    throw new UnauthorizedError("Resposta inválida do serviço de identidade.");
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    cpf: typeof user.cpf === "string" ? user.cpf : null,
    cnpj: typeof user.cnpj === "string" ? user.cnpj : null,
    specialties: user.specialties.filter((value): value is string => typeof value === "string"),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function querySuffix(req: Request): string {
  const query = req.originalUrl.split("?", 2)[1];
  return query ? `?${query}` : "";
}

function isSuccess(response: IdentityResponse): boolean {
  return response.status >= 200 && response.status < 300;
}

function isUnavailableRoute(response: IdentityResponse): boolean {
  return response.status === 404 && typeof response.data === "string";
}

function relay(res: Response, upstream: IdentityResponse): void {
  for (const [name, value] of Object.entries(upstream.headers)) res.setHeader(name, value);
  res.status(upstream.status).json(upstream.data);
}
