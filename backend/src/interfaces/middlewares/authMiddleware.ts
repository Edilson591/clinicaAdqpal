import type { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { ServiceUnavailableError, UnauthorizedError } from "../../domain/errors/DomainError";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import {
  identityGatewayClient,
  type IdentityGatewayClient,
} from "../../infrastructure/services/PaperlessAuthGatewayClient";

// Extensão do Request para carregar o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      userId: string;
      userEmail: string;
      userRoleId: number;
      userJti: string;
      userExp: number;
      isPreAuth?: boolean;
    }
  }
}

const tokenService = new JwtTokenService();
const userRepository = new PrismaUserRepository(prisma);
const EXTERNAL_PASSWORD_HASH = "external-auth:user-service";
export function createAuthMiddleware(
  identity: IdentityGatewayClient,
  users: IUserRepository,
) {
  return async function delegatedAuthMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    await authenticateIdentity(req, next, identity, users);
  };
}

export const authMiddleware = createAuthMiddleware(identityGatewayClient, userRepository);

/**
 * Variante do authMiddleware para SSE.
 * Cookies são enviados automaticamente pelo browser em conexões SSE same-origin,
 * portanto tentamos o cookie primeiro. O query param ?token= é mantido apenas
 * como fallback para clientes que não suportam cookies (ex: apps mobile/Postman).
 * ATENÇÃO: tokens em query params ficam visíveis em logs de servidor.
 */
export async function authMiddlewareSSE(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const queryToken = typeof req.query.token === "string" ? req.query.token : undefined;
  await authenticateIdentity(req, next, identityGatewayClient, userRepository, queryToken);
}


export async function preAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  // Para o pré-auth, você pode receber por header ou por um cookie específico (ex: adqpal_pre_auth)
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    return next(new UnauthorizedError("Token de pré-autenticação não fornecido."));
  }

  try {
    // IMPORTANTE: Se o seu tokenService tiver assinaturas ou secrets diferentes para cada token,
    // passe a chave/configuração correta aqui. Ex: tokenService.verifyPreAuth(token)
    const payload = tokenService.verify(token); 

    if (payload.tokenUse !== "PRE_AUTH") {
      return next(new UnauthorizedError("Ação inválida para este tipo de token."));
    }

    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.userRoleId = payload.roleId;
    req.userJti = payload.jti;
    req.userExp = payload.exp ?? 0;
    req.isPreAuth = true;

    next();
  } catch (err) {
    next(err);
  }
}

export function syncAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (auth !== `Bearer ${process.env.SYNC_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}

async function authenticateIdentity(
  req: Request,
  next: NextFunction,
  identity: IdentityGatewayClient,
  users: IUserRepository,
  fallbackToken?: string,
): Promise<void> {
  const headers = identityHeaders(req, fallbackToken);
  if (!headers.authorization && !headers.cookie) {
    next(new UnauthorizedError("Token de acesso não fornecido."));
    return;
  }

  try {
    const response = await identity.request({ method: "GET", path: "/auth/me", headers });
    if (response.status !== 200) {
      if (response.status >= 500) {
        next(new ServiceUnavailableError("Serviço de identidade temporariamente indisponível."));
        return;
      }
      next(new UnauthorizedError("Sessão inválida ou expirada."));
      return;
    }
    const identityUser = readIdentityUser(response.data);
    const completeProfile = hasCompleteProfile(identityUser);
    const clinicalUser = completeProfile ? null : await users.findById(identityUser.id);
    if (!completeProfile && !clinicalUser) {
      next(new UnauthorizedError("Perfil clínico não encontrado para esta identidade."));
      return;
    }
    if (completeProfile) await syncProjection(identityUser, users);

    req.userId = identityUser.id;
    req.userEmail = identityUser.email;
    req.userRoleId = completeProfile ? identityUser.roleId : clinicalUser!.roleId;
    req.userJti = "";
    req.userExp = 0;
    next();
  } catch (error) {
    next(error);
  }
}

function identityHeaders(req: Request, fallbackToken?: string): Record<string, string> {
  if (req.headers.authorization) return { authorization: req.headers.authorization };
  const legacyToken = req.cookies?.adqpal_token;
  if (typeof legacyToken === "string" && legacyToken) {
    return { authorization: `Bearer ${legacyToken}` };
  }
  if (req.headers.cookie) return { cookie: req.headers.cookie };
  return fallbackToken ? { authorization: `Bearer ${fallbackToken}` } : {};
}

type IdentityProfile = {
  id: string;
  name?: string;
  email: string;
  roleId?: number;
  specialties?: string[];
};

function readIdentityUser(body: unknown): IdentityProfile {
  if (!body || typeof body !== "object" || !("user" in body)) {
    throw new UnauthorizedError("Resposta inválida do serviço de identidade.");
  }
  const user = (body as { user: unknown }).user;
  if (!user || typeof user !== "object") {
    throw new UnauthorizedError("Resposta inválida do serviço de identidade.");
  }
  const id = (user as { id?: unknown }).id;
  const email = (user as { email?: unknown }).email;
  const roleId = (user as { roleId?: unknown }).roleId;
  const name = (user as { name?: unknown }).name;
  const specialties = (user as { specialties?: unknown }).specialties;
  if (typeof id !== "string" || typeof email !== "string") {
    throw new UnauthorizedError("Resposta inválida do serviço de identidade.");
  }
  return {
    id,
    ...(typeof name === "string" ? { name } : {}),
    email,
    ...(typeof roleId === "number" ? { roleId } : {}),
    ...(Array.isArray(specialties)
      ? { specialties: specialties.filter((value): value is string => typeof value === "string") }
      : {}),
  };
}

type CompleteIdentityProfile = Required<IdentityProfile>;

function hasCompleteProfile(identity: IdentityProfile): identity is CompleteIdentityProfile {
  return typeof identity.name === "string"
    && typeof identity.roleId === "number"
    && Array.isArray(identity.specialties);
}

async function syncProjection(identity: CompleteIdentityProfile, users: IUserRepository): Promise<void> {
  const existing = await users.findById(identity.id);
  if (!existing) {
    await users.create({
      id: identity.id,
      username: identity.name,
      email: identity.email,
      passwordHash: EXTERNAL_PASSWORD_HASH,
      roleId: identity.roleId,
      cpf: null,
      cnpj: null,
    });
  } else if (
    existing.username !== identity.name
    || existing.email !== identity.email
    || existing.roleId !== identity.roleId
  ) {
    await users.update(identity.id, {
      username: identity.name,
      email: identity.email,
      roleId: identity.roleId,
    });
  }

  try {
    await users.updateSpecialties(identity.id, identity.specialties);
  } catch (error) {
    console.warn(`[clinical-api] Could not synchronize specialties for ${identity.id}`);
  }
}
