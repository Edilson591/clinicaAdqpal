import { Router } from "express";
import multer from "multer";
import type { Request } from "express";
import { TranscribeController } from "../controllers/TranscribeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const ALLOWED_AUDIO_MIMES = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/ogg",
  "audio/flac",
  "audio/x-m4a",
  "audio/aac",
  "video/webm", // browsers às vezes enviam webm de microfone com este MIME
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req: Request, file, cb) => {
    if (ALLOWED_AUDIO_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}. Envie um arquivo de áudio.`));
    }
  },
});

const router = Router();
const controller = new TranscribeController();

router.post("/", authMiddleware, upload.single("file"), (req, res, next) => controller.transcribe(req, res, next));

export default router;
