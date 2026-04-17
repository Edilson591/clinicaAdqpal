import { Router } from "express";
import { NotaFiscalController } from "../controllers/NotaFiscalController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router({ mergeParams: true });
const controller = new NotaFiscalController();

router.get("/", authMiddleware, controller.getByPatient.bind(controller));

export default router;
