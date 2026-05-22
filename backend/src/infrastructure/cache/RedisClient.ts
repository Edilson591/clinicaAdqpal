import Redis from "ioredis";

let client: Redis | null = null;

export function getRedisClient(): Redis {
  if (!client) {
    const redisUrl = process.env.REDIS_URL!;

    client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    client.on("error", (err: Error) => {
      console.error("[Redis] erro de conexão:", err.message);
    });

    client.on("connect", () => {
      console.info("[Redis] conectado");
    });
  }

  return client;
}