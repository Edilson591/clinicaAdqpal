import { Router } from "express";
import { FinancialAccountController } from "../controllers/FinancialController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import {
  CreateFinancialAccountSchema,
  UpdateFinancialAccountSchema,
} from "../../application/dtos/FinancialDTOs";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router();
const controller = new FinancialAccountController();

router.post(
  "/",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  validateBody(CreateFinancialAccountSchema),
  controller.create.bind(controller),
);
router.get(
  "/",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  controller.getAll.bind(controller),
);
router.get(
  "/:id",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  controller.getById.bind(controller),
);
router.put(
  "/:id",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  validateBody(UpdateFinancialAccountSchema),
  controller.update.bind(controller),
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  controller.delete.bind(controller),
);

export default router;
