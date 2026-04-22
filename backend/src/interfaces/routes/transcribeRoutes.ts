import { Router } from "express";
import multer from "multer";
import { TranscribeController } from "../controllers/TranscribeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const controller = new TranscribeController();

router.post("/", authMiddleware, upload.single("file"), (req, res, next) => controller.transcribe(req, res, next));

export default router;
