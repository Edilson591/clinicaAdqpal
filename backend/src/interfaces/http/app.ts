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
import passwordRoutes from "../routes/passwordRoutes";
import notaFiscalRoutes from "../routes/notaFiscalRoutes";
import patientNotaFiscalRoutes from "../routes/patientNotaFiscalRoutes";
import susProcedureRoutes from "../routes/susProcedureRoutes";
import internalRoutes from "../routes/internalRoutes";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import cors from "cors";
import { swaggerSpec } from "./swagger";

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

// ── Swagger UI — documentação interativa ─────────────────────────────────────
const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

const productionLandingHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ADQPAL API</title>
  <style>
    :root {
      color-scheme: light dark;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }
    body {
      display: grid;
      min-height: 100vh;
      margin: 0;
      place-items: center;
    }
    main {
      max-width: 520px;
      padding: 32px;
      text-align: center;
    }
    h1 {
      margin: 0 0 12px;
      color: #166534;
      font-size: clamp(2rem, 6vw, 3rem);
      letter-spacing: -0.04em;
    }
    p {
      margin: 0;
      color: #475569;
      font-size: 1rem;
      line-height: 1.7;
    }
  </style>
</head>
<body>
  <main>
    <h1>ADQPAL API</h1>
    <p>Servico oficial da plataforma ADQPAL para operacoes internas do sistema clinico. Esta interface publica e apenas informativa.</p>
  </main>
</body>
</html>`;

// NOTA: não usar swaggerUi.serve+setup (express.static do swagger-ui-dist), pois
// no serverless do Vercel assets de node_modules não são servidos corretamente.
// Em vez disso, carregamos tudo via CDN.
// O setup() do swagger-ui-express tbm não filtra path/método, então não usar.
const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ADQPAL — API Docs</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <link rel="icon" type="image/png" href="${process.env.FRONTEND_URL}/logo-adqpal.png" />
  <style>
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      SwaggerUIBundle({
        url: "/api-docs.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: "StandaloneLayout",
      });
    };
  </script>
</body>
</html>`;

if (!isProduction) {
  app.get(["/", "/api-docs"], (_req, res) => res.send(swaggerHtml));
  app.get("/api-docs.json", (_req, res) => {
    res.json(swaggerSpec);
  });
} else {
  app.get("/", (_req, res) => res.send(productionLandingHtml));
}

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
app.use("/password", passwordRoutes);
app.use("/patients/:patientId/notas-fiscais", patientNotaFiscalRoutes);
app.use("/sus-procedures", susProcedureRoutes);
app.use("/internal", internalRoutes);

app.use(errorMiddleware);

export default app;
