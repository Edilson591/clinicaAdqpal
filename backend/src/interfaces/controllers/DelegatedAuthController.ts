import type { NextFunction, Request, Response } from "express";
import type { RegisterUserDTO, LoginUserDTO } from "../../application/dtos/UserDTOs";
import { toUserResponseDTO } from "../../application/mappers/userMapper";
import { AuditService } from "../../application/services/AuditService";
import { ConflictError, UnauthorizedError } from "../../domain/errors/DomainError";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaAuditLogRepository } from "../../infrastructure/repositories/PrismaAuditLogRepository";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import {
  identityGatewayClient,
  type IdentityGatewayClient,
  type IdentityResponse,
} from "../../infrastructure/services/PaperlessAuthGatewayClient";

const DEFAULT_CLINICAL_ROLE_ID = 2;
const EXTERNAL_PASSWORD_HASH = "external-auth:user-service";

const defaultUserRepository = new PrismaUserRepository(prisma);
const defaultAuditService = new AuditService(new PrismaAuditLogRepository(prisma));
type AuthAudit = Pick<AuditService, "create" | "login" | "loginFailed" | "fromRequest" | "logout">;

export class DelegatedAuthController {
  constructor(
    private readonly identity: IdentityGatewayClient = identityGatewayClient,
    private readonly users: IUserRepository = defaultUserRepository,
    private readonly audit: AuthAudit = defaultAuditService,
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as RegisterUserDTO;
      const [existingEmail, existingUsername] = await Promise.all([
        this.users.findByEmail(dto.email),
        this.users.findByUsername(dto.username),
      ]);
      if (
        (existingEmail && existingEmail.username !== dto.username)
        || (existingUsername && existingUsername.email !== dto.email)
        || (existingEmail && existingUsername && existingEmail.id !== existingUsername.id)
      ) {
        throw new ConflictError("Já existe uma conta com os dados fornecidos.");
      }
      const existingClinicalUser = existingEmail ?? existingUsername;

      const upstream = await this.identity.request({
        method: "POST",
        path: "/auth/register",
        body: {
          name: dto.username,
          email: dto.email,
          password: dto.password,
          cpf: dto.cpf ?? null,
          cnpj: dto.cnpj ?? null,
        },
        headers: requestHeaders(req),
      });
      if (!isSuccess(upstream)) return relayFailure(res, upstream);
      const identityUser = readIdentityUser(upstream.data);

      if (existingClinicalUser) {
        if (existingClinicalUser.id !== identityUser.id) {
          throw new ConflictError("Identidade externa divergente do perfil clínico.");
        }
        if (dto.specialtyIds !== undefined) {
          await this.users.updateSpecialties(existingClinicalUser.id, dto.specialtyIds);
        }
        res.status(201).json({
          success: true,
          message: "Usuário criado com sucesso.",
          data: toUserResponseDTO(existingClinicalUser, dto.specialtyIds),
        });
        return;
      }

      const user = await this.users.create({
        id: identityUser.id,
        username: dto.username,
        email: identityUser.email,
        passwordHash: EXTERNAL_PASSWORD_HASH,
        roleId: DEFAULT_CLINICAL_ROLE_ID,
        cpf: dto.cpf ?? null,
        cnpj: dto.cnpj ?? null,
      });
      if (dto.specialtyIds !== undefined) {
        await this.users.updateSpecialties(user.id, dto.specialtyIds);
      }
      this.audit.create(req, "USER", user.id, {
        username: user.username,
        email: user.email,
        roleId: user.roleId,
      });
      res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso.",
        data: toUserResponseDTO(user, dto.specialtyIds),
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as LoginUserDTO;
      const upstream = await this.identity.request({
        method: "POST",
        path: "/auth/login",
        body: dto,
        headers: requestHeaders(req),
      });
      if (!isSuccess(upstream)) {
        try {
          await this.audit.loginFailed(req);
        } catch (auditError) {
          console.error("[AUDIT] Failed to record rejected login:", auditError);
        }
        return relayFailure(res, upstream);
      }

      const data = readEnvelopeData(upstream.data);
      if (data.requires2fa === true) {
        const challengeToken = requireString(data.challengeToken, "challengeToken");
        relayMetadata(res, upstream);
        clearLegacyTrustedDevice(res);
        res.status(200).json({
          success: true,
          message: "Código de verificação enviado para o e-mail.",
          data: { requires2fa: true, tempToken: challengeToken },
        });
        return;
      }

      const identityUser = readIdentityUser(upstream.data);
      const responseUser = await this.resolveIdentityUser(identityUser);
      relayMetadata(res, upstream);
      hydrateRequest(req, responseUser.id, responseUser.email, responseUser.roleId);
      await this.audit.login(req);
      clearLegacyTrustedDevice(res);
      res.status(200).json({
        success: true,
        message: "Autenticação concluída com sucesso.",
        data: {
          requires2fa: false,
          token: requireString(data.token, "token"),
          user: responseUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async verify2fa(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const challengeToken = bearerToken(req);
      if (!challengeToken) throw new UnauthorizedError("Token de pré-autenticação não fornecido.");
      const upstream = await this.identity.request({
        method: "POST",
        path: "/auth/2fa/verify",
        body: { challengeToken, code: (req.body as { code: string }).code },
        headers: requestHeaders(req, false),
      });
      if (!isSuccess(upstream)) return relayFailure(res, upstream);

      const identityUser = readIdentityUser(upstream.data);
      const responseUser = await this.resolveIdentityUser(identityUser);
      relayMetadata(res, upstream);
      hydrateRequest(req, responseUser.id, responseUser.email, responseUser.roleId);
      await this.audit.fromRequest(req, "LOGIN", "USER");
      clearLegacyTrustedDevice(res);
      const data = readEnvelopeData(upstream.data);
      res.status(200).json({
        success: true,
        message: "Autenticação concluída com sucesso.",
        data: {
          token: requireString(data.token, "token"),
          user: responseUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async resend2FA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const challengeToken = bearerToken(req);
      if (!challengeToken) throw new UnauthorizedError("Token de pré-autenticação não fornecido.");
      const upstream = await this.identity.request({
        method: "POST",
        path: "/auth/2fa/resend",
        body: { challengeToken },
        headers: requestHeaders(req, false),
      });
      if (!isSuccess(upstream)) return relayFailure(res, upstream);
      relayMetadata(res, upstream);
      res.status(200).json({
        success: true,
        message: "Novo código de segurança enviado para o seu e-mail.",
      });
    } catch (error) {
      next(error);
    }
  }

  async csrf(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.proxy(req, res, next, "GET", "/auth/csrf");
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const upstream = await this.identity.request({
        method: "POST",
        path: "/auth/refresh",
        headers: requestHeaders(req),
      });
      if (!isSuccess(upstream)) return relayFailure(res, upstream);
      const identityUser = readIdentityUser(upstream.data);
      const responseUser = await this.resolveIdentityUser(identityUser);
      relayMetadata(res, upstream);
      const data = readEnvelopeData(upstream.data);
      res.status(200).json({
        success: true,
        message: "Sessão renovada com sucesso.",
        data: {
          token: requireString(data.token, "token"),
          user: responseUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.hydrateForAudit(req);
      const upstream = await this.identity.request({
        method: "POST",
        path: "/auth/logout",
        headers: requestHeaders(req),
      });
      relayMetadata(res, upstream);
      clearLegacyCookies(res);
      await this.audit.logout(req);
      if (!isSuccess(upstream)) return relayFailure(res, upstream, false);
      res.status(200).json({ success: true, message: "Logout realizado com sucesso." });
    } catch (error) {
      next(error);
    }
  }

  private async proxy(
    req: Request,
    res: Response,
    next: NextFunction,
    method: "GET" | "POST",
    path: string,
  ): Promise<void> {
    try {
      const upstream = await this.identity.request({ method, path, headers: requestHeaders(req) });
      relayMetadata(res, upstream);
      res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  }

  private async hydrateForAudit(req: Request): Promise<void> {
    try {
      const response = await this.identity.request({
        method: "GET",
        path: "/auth/me",
        headers: sessionValidationHeaders(req),
      });
      if (!isSuccess(response)) return;
      const identityUser = readIdentityUser(response.data);
      const responseUser = await this.resolveIdentityUser(identityUser);
      hydrateRequest(req, responseUser.id, responseUser.email, responseUser.roleId);
    } catch {
      // Logout remains best-effort even when the session has already expired.
    }
  }

  private async resolveIdentityUser(identity: IdentityUser) {
    if (hasCompleteIdentityUser(identity)) return toIdentityUserResponse(identity);
    const clinicalUser = await this.users.findById(identity.id);
    if (!clinicalUser) throw new UnauthorizedError("Perfil clínico não encontrado para esta identidade.");
    return toUserResponseDTO(clinicalUser);
  }
}

function requestHeaders(req: Request, includeAuthorization = true): Record<string, string> {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (req.headers.cookie) headers.cookie = req.headers.cookie;
  if (includeAuthorization && req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }
  const csrf = req.headers["x-csrf-token"];
  if (typeof csrf === "string") headers["x-csrf-token"] = csrf;
  const requestId = req.headers["x-request-id"];
  if (typeof requestId === "string") headers["x-request-id"] = requestId;
  const correlationId = req.headers["x-correlation-id"];
  if (typeof correlationId === "string") headers["x-correlation-id"] = correlationId;
  if (req.ip) headers["x-forwarded-for"] = req.ip;
  return headers;
}

export function sessionValidationHeaders(req: Request): Record<string, string> {
  if (req.headers.authorization) {
    return { authorization: req.headers.authorization };
  }
  const legacyToken = req.cookies?.adqpal_token;
  if (typeof legacyToken === "string" && legacyToken) {
    return { authorization: `Bearer ${legacyToken}` };
  }
  return req.headers.cookie ? { cookie: req.headers.cookie } : {};
}

function relayMetadata(res: Response, upstream: IdentityResponse): void {
  for (const [name, value] of Object.entries(upstream.headers)) res.setHeader(name, value);
  for (const cookie of upstream.setCookies) {
    res.append("Set-Cookie", cookie.replace(/Path=\/auth(?=;|$)/i, "Path=/users"));
  }
}

function relayFailure(res: Response, upstream: IdentityResponse, metadata = true): void {
  if (metadata) relayMetadata(res, upstream);
  res.status(upstream.status).json(upstream.data);
}

function isSuccess(response: IdentityResponse): boolean {
  return response.status >= 200 && response.status < 300;
}

function readEnvelopeData(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || !("data" in body)) {
    throw new UnauthorizedError("Resposta inválida do serviço de identidade.");
  }
  const data = (body as { data: unknown }).data;
  if (!data || typeof data !== "object") {
    throw new UnauthorizedError("Resposta inválida do serviço de identidade.");
  }
  return data as Record<string, unknown>;
}

type IdentityUser = {
  id: string;
  email: string;
  name: string;
  roleId?: number;
  cpf?: string | null;
  cnpj?: string | null;
  specialties?: string[];
  createdAt?: string;
  updatedAt?: string;
};

function readIdentityUser(body: unknown): IdentityUser {
  const root = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const data = "data" in root && root.data && typeof root.data === "object"
    ? root.data as Record<string, unknown>
    : root;
  const value = data.user;
  if (!value || typeof value !== "object") {
    throw new UnauthorizedError("Resposta inválida do serviço de identidade.");
  }
  const user = value as Record<string, unknown>;
  const roleId = user.roleId;
  const specialties = user.specialties;
  const createdAt = user.createdAt;
  const updatedAt = user.updatedAt;
  return {
    id: requireString(user.id, "user.id"),
    email: requireString(user.email, "user.email"),
    name: requireString(user.name, "user.name"),
    ...(typeof roleId === "number" ? { roleId } : {}),
    ...(user.cpf === null || typeof user.cpf === "string" ? { cpf: user.cpf } : {}),
    ...(user.cnpj === null || typeof user.cnpj === "string" ? { cnpj: user.cnpj } : {}),
    ...(Array.isArray(specialties)
      ? { specialties: specialties.filter((value): value is string => typeof value === "string") }
      : {}),
    ...(typeof createdAt === "string" ? { createdAt } : {}),
    ...(typeof updatedAt === "string" ? { updatedAt } : {}),
  };
}

type CompleteIdentityUser = IdentityUser & {
  roleId: number;
  specialties: string[];
  createdAt: string;
  updatedAt: string;
};

function hasCompleteIdentityUser(user: IdentityUser): user is CompleteIdentityUser {
  return typeof user.roleId === "number"
    && Array.isArray(user.specialties)
    && typeof user.createdAt === "string"
    && typeof user.updatedAt === "string";
}

function toIdentityUserResponse(user: CompleteIdentityUser) {
  return {
    id: user.id,
    username: user.name,
    email: user.email,
    roleId: user.roleId,
    cpf: user.cpf,
    cnpj: user.cnpj,
    specialties: user.specialties,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value) {
    throw new UnauthorizedError(`Resposta de identidade sem ${field}.`);
  }
  return value;
}

function bearerToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  return header?.startsWith("Bearer ") ? header.slice(7) : undefined;
}

function hydrateRequest(req: Request, id: string, email: string, roleId: number): void {
  req.userId = id;
  req.userEmail = email;
  req.userRoleId = roleId;
  req.userJti = "";
  req.userExp = 0;
}

function clearLegacyTrustedDevice(res: Response): void {
  res.clearCookie("adqpal_trusted_device", legacyCookieOptions());
}

function clearLegacyCookies(res: Response): void {
  res.clearCookie("adqpal_token", legacyCookieOptions());
  clearLegacyTrustedDevice(res);
}

function legacyCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const,
    path: "/",
  };
}
