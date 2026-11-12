import { Router } from "express";
import { MedicalRecordController } from "../controllers/MedicalRecordController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateMedicalRecordSchema, UpdateMedicalRecordSchema } from "../../application/dtos/MedicalRecordDTOs";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router();
const controller = new MedicalRecordController();

const clinicalRoles = requireRole(ROLES.ADMIN, ROLES.DOCTOR);
router.post("/", authMiddleware, clinicalRoles, validateBody(CreateMedicalRecordSchema), controller.create.bind(controller));
router.get("/", authMiddleware, clinicalRoles, controller.getAll.bind(controller));
router.get("/patient/:patientId", authMiddleware, clinicalRoles, controller.getByPatient.bind(controller));
router.get("/:id", authMiddleware, clinicalRoles, controller.getById.bind(controller));
router.put("/:id", authMiddleware, clinicalRoles, validateBody(UpdateMedicalRecordSchema), controller.update.bind(controller));
router.delete("/:id", authMiddleware, requireRole(ROLES.ADMIN), controller.delete.bind(controller));

export default router;
