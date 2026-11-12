import { Router } from "express";
import { BoletoProxyController } from "../controllers/BoletoProxyController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole, ROLES } from "../middlewares/requireRole";
import type { NextFunction, Request, Response } from "express";
import { DomainError } from "../../domain/errors/DomainError";

const boletoRoutes = Router();
const dashboardRoutes = Router();
const controller = new BoletoProxyController();
const requireFinancialAccess = requireRole(ROLES.ADMIN);
function requireIdempotencyKey(req: Request, _res: Response, next: NextFunction): void {
  if (!req.get("x-idempotency-key") && !req.get("idempotency-key")) {
    next(new DomainError("Idempotency-Key é obrigatório para esta operação financeira.", 400));
    return;
  }
  next();
}

boletoRoutes.use(authMiddleware, requireFinancialAccess);
dashboardRoutes.use(authMiddleware, requireFinancialAccess);

boletoRoutes.get("/", controller.forward.bind(controller));
boletoRoutes.post("/", controller.forward.bind(controller));
boletoRoutes.post("/cancellations", requireIdempotencyKey, controller.forward.bind(controller));
boletoRoutes.get("/:id", controller.forward.bind(controller));
dashboardRoutes.get("/summary", controller.forward.bind(controller));

export { boletoRoutes, dashboardRoutes };
