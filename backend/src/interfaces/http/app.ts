import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/userRoutes";
import patientRoutes from "../routes/patientRoutes";
import appointmentRoutes from "../routes/appointmentRoutes";
import medicalRecordRoutes from "../routes/medicalRecordRoutes";
import patientHistoryRoutes from "../routes/patientHistoryRoutes";
import historyRoutes from "../routes/historyRoutes";
import specialtyRoutes from "../routes/specialtyRoutes";
import financialAccountRoutes from "../routes/financialAccountRoutes";
import financialCategoryRoutes from "../routes/financialCategoryRoutes";
import transactionRoutes from "../routes/transactionRoutes";
import financialDashboardRoutes from "../routes/financialDashboardRoutes";
import employeeRoutes from "../routes/employeeRoutes";
import transcribeRoutes from "../routes/transcribeRoutes";
import notaFiscalRoutes from "../routes/notaFiscalRoutes";
import patientNotaFiscalRoutes from "../routes/patientNotaFiscalRoutes";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import cors from "cors";

const app = express();

// TRUST_PROXY deve ser configurado por ambiente:
//   "1"        → 1 hop (Railway, Render, Vercel, Heroku)
//   "127.0.0.1"→ Nginx local
//   "false"    → sem proxy (desenvolvimento direto)
const rawTrustProxy = process.env.TRUST_PROXY ?? "1";
const trustProxy =
  rawTrustProxy === "false"
    ? false
    : /^\d+$/.test(rawTrustProxy)
      ? parseInt(rawTrustProxy, 10)
      : rawTrustProxy;
app.set("trust proxy", trustProxy);
// ── Segurança: headers HTTP ───────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // frontend separado em outro domínio
    crossOriginEmbedderPolicy: false,
  }),
);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5174","http://localhost:8080","http://localhost:3000","http://localhost","https://lightgoldenrodyellow-mole-188248.hostingersite.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Cookie parser (necessário para ler req.cookies no authMiddleware) ─────────
app.use(cookieParser());

// ── Body parsing com limite de tamanho (evita DoS via payload gigante) ────────
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// ── Rate limiting global ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas requisições, tente novamente em 15 minutos." },
  skip: () => process.env.NODE_ENV === "test",
});

// Rate limiting restrito para autenticação (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 tentativas de login por IP a cada 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas tentativas de login, tente novamente em 15 minutos." },
  skip: () => process.env.NODE_ENV === "test",
});

app.use(globalLimiter);
app.use("/users/login", authLimiter);
app.use("/users/register", authLimiter); // previne criação em massa de contas

if (process.env.NODE_ENV !== "test") {
  // Formato customizado: loga apenas o path (sem query string) para não
  // expor tokens SSE (?token=...) ou dados de pacientes em query params
  morgan.token("path-only", (req) => (req as { path?: string }).path ?? "/");
  app.use(
    morgan(":method :path-only :status :res[content-length] - :response-time ms"),
  );
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/medical-records", medicalRecordRoutes);
app.use("/patients/:patientId/history", patientHistoryRoutes);
app.use("/history", historyRoutes);
app.use("/specialties", specialtyRoutes);
app.use("/financial/accounts", financialAccountRoutes);
app.use("/financial/categories", financialCategoryRoutes);
app.use("/financial/transactions", transactionRoutes);
app.use("/financial/dashboard", financialDashboardRoutes);
app.use("/employees", employeeRoutes);
app.use("/fiscal/notas-fiscais", notaFiscalRoutes);
app.use("/transcribe", transcribeRoutes);
app.use("/patients/:patientId/notas-fiscais", patientNotaFiscalRoutes);

app.use(errorMiddleware);

export default app;
