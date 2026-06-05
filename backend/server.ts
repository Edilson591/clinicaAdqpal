import "dotenv/config";
import app from "./src/interfaces/http/app";
import { startNotificationWorker } from "./src/infrastructure/queue/NotificationWorker";
import { startSusSyncCron } from "./src/infrastructure/cron/SusSyncCron";
// import { startNotaFiscalWorker } from "./src/infrastructure/queue/NotasFiscalWorker";

const PORT = Number(process.env.PORT) || 3333;

// Worker BullMQ só inicia localmente (Vercel não tem Redis)
if (process.env.VERCEL !== "1") {
  startNotificationWorker();
}
// startNotaFiscalWorker();

// Cron: sincroniza procedimentos SUS uma vez por mês (Vercel usa cron jobs externos)
if (process.env.VERCEL !== "1") {
  startSusSyncCron();
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor ADQPAL rodando em http://localhost:${PORT}`);
  console.log(`📋 Ambiente: ${process.env.NODE_ENV ?? "development"}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

export default app;
