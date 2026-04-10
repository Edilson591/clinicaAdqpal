import { Router } from "express";
import { TransactionController } from "../controllers/FinancialController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateTransactionSchema, UpdateTransactionSchema } from "../../application/dtos/FinancialDTOs";

const router = Router();
const controller = new TransactionController();

router.post("/",    authMiddleware, validateBody(CreateTransactionSchema), controller.create.bind(controller));
router.get("/",     authMiddleware, controller.getAll.bind(controller));
router.get("/:id",  authMiddleware, controller.getById.bind(controller));
router.put("/:id",  authMiddleware, validateBody(UpdateTransactionSchema), controller.update.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));

export default router;
