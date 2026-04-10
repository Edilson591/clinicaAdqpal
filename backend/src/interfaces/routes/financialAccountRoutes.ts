import { Router } from "express";
import { FinancialAccountController } from "../controllers/FinancialController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateFinancialAccountSchema, UpdateFinancialAccountSchema } from "../../application/dtos/FinancialDTOs";

const router = Router();
const controller = new FinancialAccountController();

router.post("/",    authMiddleware, validateBody(CreateFinancialAccountSchema), controller.create.bind(controller));
router.get("/",     authMiddleware, controller.getAll.bind(controller));
router.get("/:id",  authMiddleware, controller.getById.bind(controller));
router.put("/:id",  authMiddleware, validateBody(UpdateFinancialAccountSchema), controller.update.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));

export default router;
