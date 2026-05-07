import { Router } from "express";
import { NotaFiscalController } from "../controllers/NotaFiscalController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import {
  CreateNotaFiscalSchema,
  UpdateNotaFiscalSchema,
} from "../../application/dtos/NotaFiscalDTOs";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router();
const controller = new NotaFiscalController();

router.post(
  "/",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  validateBody(CreateNotaFiscalSchema),
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
  validateBody(UpdateNotaFiscalSchema),
  controller.update.bind(controller),
);
router.post(
  "/:id/emitir",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  controller.emitir.bind(controller),
);
router.post(
  "/:id/cancelar",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  controller.cancelar.bind(controller),
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole(ROLES.ADMIN),
  controller.delete.bind(controller),
);

export default router;
