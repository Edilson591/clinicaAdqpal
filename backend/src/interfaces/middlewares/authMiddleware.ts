import type { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { UnauthorizedError } from "../../domain/errors/DomainError";

// Extensão do Request para carregar o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      userId: string;
      userEmail: string;
    }
  }
}

const tokenService = new JwtTokenService();

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  // Lê o token do cookie httpOnly (preferencial — JS do cliente não acessa)
  const cookieToken: string | undefined = req.cookies?.adqpal_token;

  // Fallback: Authorization header (compatibilidade com clientes que não usam cookie)
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  const token = cookieToken ?? headerToken;

  if (!token) {
    return next(new UnauthorizedError("Token de acesso não fornecido."));
  }

  try {
    const payload = tokenService.verify(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Variante do authMiddleware para SSE.
 * EventSource do browser não suporta headers customizados,
 * por isso o token é lido do query param ?token=
 */
export function authMiddlewareSSE(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = req.query.token as string | undefined;

  if (!token) {
    return next(new UnauthorizedError("Token de acesso não fornecido."));
  }

  try {
    const payload = tokenService.verify(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch (err) {
    next(err);
  }
}
