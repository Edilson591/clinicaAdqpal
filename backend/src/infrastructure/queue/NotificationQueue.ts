import { Queue } from "bullmq";
import Redis from "ioredis";

export type NotificationChannel = "whatsapp" | "sms";

export interface NotificationJobData {
  appointmentId: string;
  telefone: string;
  channels: NotificationChannel[];
}

// BullMQ requires maxRetriesPerRequest: null and enableReadyCheck: false
function createBullMQRedis(): Redis {
  return new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

export const NOTIFICATION_QUEUE = "notifications";

let queue: Queue<NotificationJobData> | null = null;

export function getNotificationQueue(): Queue<NotificationJobData> {
  if (!queue) {
    queue = new Queue<NotificationJobData>(NOTIFICATION_QUEUE, {
      connection: createBullMQRedis(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5_000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });

    queue.on("error", (err) => {
      console.error("[NotificationQueue] erro:", err.message);
    });
  }
  return queue;
}

export { createBullMQRedis };
