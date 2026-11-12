import { Router } from "express";
import { PatientHistoryController } from "../controllers/PatientHistoryController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router({ mergeParams: true });
const controller = new PatientHistoryController();

router.post("/", authMiddleware, requireRole(ROLES.ADMIN, ROLES.DOCTOR), controller.create.bind(controller));
router.get("/", authMiddleware, requireRole(ROLES.ADMIN, ROLES.DOCTOR), controller.list.bind(controller));

export default router;
