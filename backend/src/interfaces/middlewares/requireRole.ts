import type { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../../domain/errors/DomainError";

export const ROLES = {
  ADMIN: 1,
  STAFF: 2,
  DOCTOR: 3,
  RECEPTIONIST: 5,
  IT_SUPPORT: 9,
} as const;

export type RoleId = (typeof ROLES)[keyof typeof ROLES];

/** Rejeita requisições cujo roleId não está na lista de roles permitidos. */
export function requireRole(...allowed: RoleId[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!allowed.includes(req.userRoleId as RoleId)) {
      return next(new ForbiddenError("Você não tem permissão para executar esta ação."));
    }
    next();
  };
}

/** Permite acesso se o usuário é dono do recurso (id === req.userId) OU tem o role exigido. */
export function requireOwnerOrRole(paramName: string, ...allowed: RoleId[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const resourceOwnerId = req.params[paramName];
    const isOwner = resourceOwnerId === req.userId;
    const hasRole = allowed.includes(req.userRoleId as RoleId);

    if (!isOwner && !hasRole) {
      return next(new ForbiddenError("Você não tem permissão para acessar este recurso."));
    }
    next();
  };
}
