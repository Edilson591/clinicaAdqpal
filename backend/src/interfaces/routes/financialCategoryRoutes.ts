import { Router } from "express";
import { FinancialCategoryController } from "../controllers/FinancialController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateFinancialCategorySchema, UpdateFinancialCategorySchema } from "../../application/dtos/FinancialDTOs";

const router = Router();
const controller = new FinancialCategoryController();

router.post("/",    authMiddleware, validateBody(CreateFinancialCategorySchema), controller.create.bind(controller));
router.get("/",     authMiddleware, controller.getAll.bind(controller));
router.get("/:id",  authMiddleware, controller.getById.bind(controller));
router.put("/:id",  authMiddleware, validateBody(UpdateFinancialCategorySchema), controller.update.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));

export default router;
