import { Router } from "express";
import { SusProcedureController } from "../controllers/SusProcedureController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new SusProcedureController();

router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/:codigo", authMiddleware, controller.getByCodigo.bind(controller));
router.post("/sync", controller.sync.bind(controller));

export default router;
