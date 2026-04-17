import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateEmployeeSchema, UpdateEmployeeSchema } from "../../application/dtos/EmployeeDTOs";

const router = Router();
const controller = new EmployeeController();

router.post("/", authMiddleware, validateBody(CreateEmployeeSchema), controller.create.bind(controller));
router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/:id", authMiddleware, controller.getById.bind(controller));
router.put("/:id", authMiddleware, validateBody(UpdateEmployeeSchema), controller.update.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));

export default router;
