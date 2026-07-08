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
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #0f172a;
      --green-50: #f0fdf4;
      --green-100: #dcfce7;
      --green-500: #22c55e;
      --green-600: #16a34a;
      --green-700: #15803d;
      --slate-500: #64748b;
      --slate-600: #475569;
      --slate-900: #0f172a;
    }
    * {
      box-sizing: border-box;
    }
    body {
      min-height: 100vh;
      margin: 0;
      padding: 24px;
      display: grid;
      place-items: center;
      background:
        radial-gradient(circle at 18% 18%, rgba(34, 197, 94, 0.24), transparent 26rem),
        radial-gradient(circle at 82% 76%, rgba(20, 184, 166, 0.18), transparent 28rem),
        linear-gradient(135deg, #f8fafc 0%, #eef7f1 54%, #f8fafc 100%);
      overflow: hidden;
    }
    .shell {
      position: relative;
      width: min(100%, 960px);
    }
    .glow {
      position: absolute;
      inset: -80px;
      pointer-events: none;
      background:
        linear-gradient(115deg, transparent 0 36%, rgba(255, 255, 255, 0.72) 44%, transparent 54%),
        radial-gradient(circle, rgba(34, 197, 94, 0.14), transparent 58%);
      filter: blur(4px);
      transform: rotate(-8deg);
    }
    .orb {
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 999px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(20, 184, 166, 0.16));
      box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.65), 0 24px 70px rgba(22, 163, 74, 0.2);
    }
    .orb-one {
      top: -42px;
      left: -34px;
    }
    .orb-two {
      right: -28px;
      bottom: -36px;
      width: 88px;
      height: 88px;
      opacity: 0.72;
    }
    main {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      padding: clamp(28px, 6vw, 64px);
      text-align: center;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.78));
      border: 1px solid rgba(148, 163, 184, 0.28);
      border-radius: 34px;
      box-shadow: 0 30px 90px rgba(15, 23, 42, 0.14);
      backdrop-filter: blur(22px);
    }
    main::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: -1;
      background:
        linear-gradient(90deg, rgba(34, 197, 94, 0.18), transparent 24%, transparent 76%, rgba(20, 184, 166, 0.16)),
        radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.16), transparent 32rem);
    }
    .brand-mark {
      display: grid;
      width: 72px;
      height: 72px;
      margin: 0 auto 22px;
      place-items: center;
      color: white;
      background: linear-gradient(135deg, var(--green-600), var(--green-700));
      border-radius: 24px;
      box-shadow: 0 18px 38px rgba(22, 163, 74, 0.28);
      font-size: 1.7rem;
      font-weight: 900;
      letter-spacing: -0.08em;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
      padding: 8px 15px;
      color: #14532d;
      background: rgba(220, 252, 231, 0.86);
      border: 1px solid rgba(187, 247, 208, 0.9);
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .badge::before {
      content: "";
      width: 8px;
      height: 8px;
      background: var(--green-500);
      border-radius: 999px;
      box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.16);
    }
    h1 {
      max-width: 760px;
      margin: 0 auto 18px;
      color: var(--slate-900);
      font-size: clamp(2.75rem, 8vw, 5.8rem);
      line-height: 0.95;
      letter-spacing: -0.08em;
    }
    h1 span {
      display: block;
      color: var(--green-700);
    }
    p {
      max-width: 560px;
      margin: 0 auto;
      color: var(--slate-600);
      font-size: clamp(1rem, 2.5vw, 1.12rem);
      line-height: 1.75;
    }
    .panel {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      max-width: 620px;
      margin: 34px auto 0;
    }
    .panel-item {
      padding: 16px 14px;
      color: var(--slate-600);
      background: rgba(248, 250, 252, 0.74);
      border: 1px solid rgba(226, 232, 240, 0.86);
      border-radius: 18px;
      font-size: 0.92rem;
      line-height: 1.45;
    }
    .panel-item strong {
      display: block;
      margin-bottom: 4px;
      color: var(--slate-900);
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .footer {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 30px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      color: var(--slate-500);
      font-size: 0.9rem;
    }
    @media (max-width: 520px) {
      body {
        padding: 16px;
      }
      main {
        border-radius: 26px;
      }
      .brand-mark {
        width: 60px;
        height: 60px;
        border-radius: 20px;
      }
      .panel {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <div class="glow"></div>
    <div class="orb orb-one"></div>
    <div class="orb orb-two"></div>
    <main>
      <div class="brand-mark">A</div>
      <div class="badge">Servico ativo</div>
      <h1>ADQPAL <span>API</span></h1>
      <p>Camada segura de comunicacao da plataforma ADQPAL, criada para apoiar as operacoes digitais do sistema clinico.</p>
      <section class="panel" aria-label="Resumo do servico">
        <div class="panel-item"><strong>Confiavel</strong>Operacao monitorada para uso institucional.</div>
        <div class="panel-item"><strong>Seguro</strong>Acesso restrito aos canais autorizados.</div>
        <div class="panel-item"><strong>Privado</strong>Sem documentacao publica nesta area.</div>
      </section>
      <div class="footer">Interface publica apenas informativa</div>
    </main>
  </div>
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
