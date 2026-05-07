import Redis from "ioredis";

let bullClient: Redis | null = null;

export function getBullMQRedis(): Redis {
  if (!bullClient) {
    bullClient = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    bullClient.on("error", (err: Error) => {
      console.error("[BullMQ Redis] erro:", err.message);
    });
  }

  return bullClient;
}