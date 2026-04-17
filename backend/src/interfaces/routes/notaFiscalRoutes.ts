import { Router } from "express";
import { NotaFiscalController } from "../controllers/NotaFiscalController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateNotaFiscalSchema, UpdateNotaFiscalSchema } from "../../application/dtos/NotaFiscalDTOs";

const router = Router();
const controller = new NotaFiscalController();

router.post("/", authMiddleware, validateBody(CreateNotaFiscalSchema), controller.create.bind(controller));
router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/:id", authMiddleware, controller.getById.bind(controller));
router.put("/:id", authMiddleware, validateBody(UpdateNotaFiscalSchema), controller.update.bind(controller));
router.post("/:id/emitir", authMiddleware, controller.emitir.bind(controller));
router.post("/:id/cancelar", authMiddleware, controller.cancelar.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));

export default router;
