import { getRedisClient } from "./RedisClient";

const PREFIX = "bl:";

async function add(jti: string, exp: number): Promise<void> {
  const ttl = Math.max(exp - Math.floor(Date.now() / 1000), 1);
  try {
    await getRedisClient().set(`${PREFIX}${jti}`, "1", "EX", ttl);
  } catch {
    console.error("[TokenBlacklist] falha ao registrar token revogado — Redis indisponível");
  }
}

async function has(jti: string): Promise<boolean> {
  try {
    return (await getRedisClient().get(`${PREFIX}${jti}`)) !== null;
  } catch {
    // Redis indisponível: assume válido para não bloquear usuários legítimos
    return false;
  }
}

export const tokenBlacklist = { add, has };
