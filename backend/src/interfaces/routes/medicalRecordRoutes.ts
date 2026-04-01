import { Router } from "express";
import { MedicalRecordController } from "../controllers/MedicalRecordController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateMedicalRecordSchema, UpdateMedicalRecordSchema } from "../../application/dtos/MedicalRecordDTOs";

const router = Router();
const controller = new MedicalRecordController();

router.post("/", authMiddleware, validateBody(CreateMedicalRecordSchema), controller.create.bind(controller));
router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/patient/:patientId", authMiddleware, controller.getByPatient.bind(controller));
router.get("/:id", authMiddleware, controller.getById.bind(controller));
router.put("/:id", authMiddleware, validateBody(UpdateMedicalRecordSchema), controller.update.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));

export default router;
