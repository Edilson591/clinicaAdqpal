import "dotenv/config";
import app from "./src/interfaces/http/app";
import { startNotificationWorker } from "./src/infrastructure/queue/NotificationWorker";
import { startSusSyncCron } from "./src/infrastructure/cron/SusSyncCron";
import { getRedisClient } from "./src/infrastructure/cache/RedisClient";
// import { startNotaFiscalWorker } from "./src/infrastructure/queue/NotasFiscalWorker";

const PORT = Number(process.env.PORT) || 3333;

// Workers e cron só rodam localmente (Vercel não tem Redis)
if (process.env.VERCEL !== "1") {
  startNotificationWorker();
  startSusSyncCron();
}
// startNotaFiscalWorker();
getRedisClient();

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ADQPAL rodando em http://localhost:${PORT}`);
    console.log(`📋 Ambiente: ${process.env.NODE_ENV ?? "development"}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
