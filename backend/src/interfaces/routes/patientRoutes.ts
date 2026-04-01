import { Router } from "express";
import { PatientController } from "../controllers/PatientController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreatePatientSchema, UpdatePatientSchema } from "../../application/dtos/PatientDTOs";

const router = Router();
const controller = new PatientController();

router.post("/", authMiddleware, validateBody(CreatePatientSchema), controller.create.bind(controller));
router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/:id", authMiddleware, controller.getById.bind(controller));
router.put("/:id", authMiddleware, validateBody(UpdatePatientSchema), controller.update.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));

export default router;
