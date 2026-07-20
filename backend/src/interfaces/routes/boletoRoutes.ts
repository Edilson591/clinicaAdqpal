import { Router } from "express";
import { BoletoProxyController } from "../controllers/BoletoProxyController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole, ROLES } from "../middlewares/requireRole";

const boletoRoutes = Router();
const dashboardRoutes = Router();
const controller = new BoletoProxyController();
const requireFinancialAccess = requireRole(ROLES.ADMIN);

boletoRoutes.use(authMiddleware, requireFinancialAccess);
dashboardRoutes.use(authMiddleware, requireFinancialAccess);

boletoRoutes.get("/", controller.forward.bind(controller));
boletoRoutes.post("/", controller.forward.bind(controller));
boletoRoutes.get("/:id", controller.forward.bind(controller));
dashboardRoutes.get("/summary", controller.forward.bind(controller));

export { boletoRoutes, dashboardRoutes };
