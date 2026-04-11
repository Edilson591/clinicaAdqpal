import { Router } from "express";
import { FinancialDashboardController } from "../controllers/FinancialController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new FinancialDashboardController();

// GET /financial/dashboard?month=YYYY-MM
router.get("/", authMiddleware, controller.getDashboard.bind(controller));

export default router;
