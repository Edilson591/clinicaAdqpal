import { Router } from "express";
import { FinancialDashboardController } from "../controllers/FinancialController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router();
const controller = new FinancialDashboardController();

// GET /financial/dashboard?month=YYYY-MM
router.get(
  "/",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  controller.getDashboard.bind(controller),
);

export default router;
