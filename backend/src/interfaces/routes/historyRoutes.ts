import { Router } from "express";
import { PatientHistoryController } from "../controllers/PatientHistoryController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new PatientHistoryController();

router.delete("/:id", authMiddleware, controller.softDelete.bind(controller));

export default router;
