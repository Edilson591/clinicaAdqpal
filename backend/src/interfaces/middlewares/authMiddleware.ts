import type { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { UnauthorizedError } from "../../domain/errors/DomainError";
import { tokenBlacklist } from "../../infrastructure/cache/TokenBlacklist";

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

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const cookieToken: string | undefined = req.cookies?.adqpal_token;
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const token = cookieToken ?? headerToken;

  if (!token) {
    return next(new UnauthorizedError("Token de acesso não fornecido."));
  }

  try {
    const payload = tokenService.verify(token);

    if (await tokenBlacklist.has(payload.jti)) {
      return next(new UnauthorizedError("Token revogado. Faça login novamente."));
    }

    if (!payload.isDefinitive) {
      return next(new UnauthorizedError("Segunda etapa de autenticação pendente."));
    }


    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.userRoleId = payload.roleId;
    req.userJti = payload.jti;
    req.userExp = payload.exp ?? 0;
    next();
  } catch (err) {
    next(err);
  }
}

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
  const cookieToken: string | undefined = req.cookies?.adqpal_token;
  const queryToken = req.query.token as string | undefined;
  const token = cookieToken ?? queryToken;

  if (!token) {
    return next(new UnauthorizedError("Token de acesso não fornecido."));
  }

  try {
    const payload = tokenService.verify(token);

    if (await tokenBlacklist.has(payload.jti)) {
      return next(new UnauthorizedError("Token revogado. Faça login novamente."));
    }

    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.userRoleId = payload.roleId;
    req.userJti = payload.jti;
    req.userExp = payload.exp ?? 0;
    next();
  } catch (err) {
    next(err);
  }
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

    // Garanta que um espertinho não tente usar um token definitivo aqui
    if (payload.isDefinitive) { 
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