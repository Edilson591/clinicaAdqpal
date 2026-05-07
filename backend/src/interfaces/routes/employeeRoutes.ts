import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import {
  CreateEmployeeSchema,
  UpdateEmployeeSchema,
} from "../../application/dtos/EmployeeDTOs";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router();
const controller = new EmployeeController();

router.post(
  "/",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  validateBody(CreateEmployeeSchema),
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
  validateBody(UpdateEmployeeSchema),
  controller.update.bind(controller),
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  controller.delete.bind(controller),
);

export default router;
