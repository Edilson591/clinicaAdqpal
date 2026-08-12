import { Router } from "express";

const router = Router();

router.get("/reveal-env", (req, res) => {
  const secretKey = req.query.key;

  // Trava de segurança para ninguém acessar sem a chave
  if (secretKey !== "sua-chave-secreta-123") {
    return res.status(401).json({ error: "Não autorizado" });
  }

  return res.json({
    SMTP_HOST: process.env.SMTP_HOST || "Não definida",
    SMTP_PORT: process.env.SMTP_PORT || "Não definida",
    SMTP_USER: process.env.SMTP_USER || "Não definida",
    SMTP_PASS: process.env.SMTP_PASS || "Não definida",
    FRONTEND_URL: process.env.FRONTEND_URL || "Não definida",
  });
});

export default router;