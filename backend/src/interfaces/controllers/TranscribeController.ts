import type { Request, Response, NextFunction } from "express";
import axios from "axios";
import FormData from "form-data";

const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

export class TranscribeController {
  async transcribe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ success: false, message: "Arquivo de áudio não enviado." });
        return;
      }

      const form = new FormData();
      form.append("file", file.buffer, {
        filename: file.originalname || "audio.webm",
        contentType: file.mimetype || "audio/webm",
      });
      form.append("model", "whisper-large-v3-turbo");
      form.append("language", "pt");
      form.append("response_format", "json");

      const groqRes = await axios.post(GROQ_URL, form, {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          ...form.getHeaders(),
        },
        timeout: 30000,
      });

      res.json({ success: true, data: { text: groqRes.data.text ?? "" } });
    } catch (err) {
      next(err);
    }
  }
}
