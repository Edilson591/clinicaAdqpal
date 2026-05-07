import { Queue } from "bullmq";
import Redis from "ioredis";
import { getBullMQRedis } from "../cache/RedisBullMQ";

// 🔥 dados do job
export interface NotaFiscalJobData {
  notaFiscalId: string;
}

// reaproveita o mesmo padrão
function createBullMQRedis(): Redis {
  return new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

export const NOTA_FISCAL_QUEUE = "nota-fiscal";

let queue: Queue<NotaFiscalJobData> | null = null;

export function getNotaFiscalQueue(): Queue<NotaFiscalJobData> {
  if (!queue) {
    queue = new Queue<NotaFiscalJobData>(NOTA_FISCAL_QUEUE, {
      connection: getBullMQRedis(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5_000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });

    queue.on("error", (err) => {
      console.error("[NotaFiscalQueue] erro:", err.message);
    });
  }

  return queue;
}

export { createBullMQRedis };