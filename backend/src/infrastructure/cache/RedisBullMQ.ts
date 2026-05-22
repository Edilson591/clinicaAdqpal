import Redis from "ioredis";

let bullClient: Redis | null = null;

export function getBullMQRedis(): Redis {
  if (!bullClient) {
    const redisUrl = process.env.REDIS_URL!;
    bullClient = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    bullClient.on("error", (err: Error) => {
      console.error("[BullMQ Redis] erro:", err.message);
    });
  }

  return bullClient;
}
