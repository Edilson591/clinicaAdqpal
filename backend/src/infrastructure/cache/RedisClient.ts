import Redis from "ioredis";

let client: Redis | null = null;

export function getRedisClient(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
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
