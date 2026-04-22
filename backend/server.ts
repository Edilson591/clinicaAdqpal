import "dotenv/config";
import app from "./src/interfaces/http/app";
import { startNotificationWorker } from "./src/infrastructure/queue/NotificationWorker";

const PORT = Number(process.env.PORT) || 3333;

startNotificationWorker();

app.listen(PORT, () => {
  console.log(`🚀 Servidor ADQPAL rodando em http://localhost:${PORT}`);
  console.log(`📋 Ambiente: ${process.env.NODE_ENV ?? "development"}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

export default app;
