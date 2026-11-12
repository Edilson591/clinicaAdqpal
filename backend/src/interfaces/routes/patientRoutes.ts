import { Router } from "express";
import { PatientController } from "../controllers/PatientController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreatePatientSchema, UpdatePatientSchema } from "../../application/dtos/PatientDTOs";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router();
const controller = new PatientController();

const patientRoles = requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.DOCTOR, ROLES.RECEPTIONIST);
const patientWriteRoles = requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.RECEPTIONIST);
router.post("/", authMiddleware, patientWriteRoles, validateBody(CreatePatientSchema), controller.create.bind(controller));
router.get("/", authMiddleware, patientRoles, controller.getAll.bind(controller));
router.get("/:id", authMiddleware, patientRoles, controller.getById.bind(controller));
router.put("/:id", authMiddleware, patientWriteRoles, validateBody(UpdatePatientSchema), controller.update.bind(controller));
router.delete("/:id", authMiddleware, requireRole(ROLES.ADMIN), controller.delete.bind(controller));

export default router;
