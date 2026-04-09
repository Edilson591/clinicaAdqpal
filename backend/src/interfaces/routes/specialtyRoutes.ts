import { Router } from "express";
import { SpecialtyController } from "../controllers/SpecialtyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new SpecialtyController();

router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/doctor/:doctorId", authMiddleware, controller.getByDoctor.bind(controller));

export default router;
