import { Router } from "express";
import { TransactionController } from "../controllers/FinancialController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateTransactionSchema, UpdateTransactionSchema } from "../../application/dtos/FinancialDTOs";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router();
const controller = new TransactionController();

router.use(authMiddleware, requireRole(ROLES.ADMIN));

router.post("/", validateBody(CreateTransactionSchema), controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", validateBody(UpdateTransactionSchema), controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
