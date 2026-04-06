import { Router } from "express";
import { PatientHistoryController } from "../controllers/PatientHistoryController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router({ mergeParams: true });
const controller = new PatientHistoryController();

router.post("/", authMiddleware, controller.create.bind(controller));
router.get("/", authMiddleware, controller.list.bind(controller));

export default router;
