import Redis from "ioredis";
import { IAuth2FA } from "../../domain/repositories/IAuth2FA";


const TWO_FACTOR_PREFIX = "auth:2fa:";
const EXPIRATION_IN_SECONDS = 15 * 60;

export class CachedCode2FA implements IAuth2FA {
  constructor(
    private readonly repo: IAuth2FA,
    private readonly redis: Redis,
  ) {}

  async getCode(userId: string): Promise<string | null> {
    const key = `${TWO_FACTOR_PREFIX}${userId}`;

    try {
      const cachedCode = await this.redis.get(key);
      if (cachedCode !== null) return cachedCode;
    } catch (error) {
      console.error(
        "[Redis] Falha ao buscar 2FA, consultando repositório principal:",
        error,
      );
      return this.repo.getCode(userId);
    }

    return null;
  }
  async invalidateCode(userId: string): Promise<void> {
    const key = `${TWO_FACTOR_PREFIX}${userId}`;

    try {
      // 1. Deleta do Redis
      await this.redis.del(key);
    } catch (error) {
      console.error("[Redis] Falha ao invalidar no cache:", error);
    }
  }

  async saveCode(userId: string, code: string): Promise<void> {
    const key = `${TWO_FACTOR_PREFIX}${userId}`;

    try {
      // 1. Tenta salvar no Redis de forma atômica com TTL
      await this.redis.set(key, code, "EX", EXPIRATION_IN_SECONDS);
    } catch (error) {
      console.error(
        "[Redis] Falha ao salvar 2FA, acionando repositório principal:",
        error,
      );

      // 2. FALLBACK (Se o Redis cair, seu app não para! Salva no banco de dados)
      // Excelente para compliance da LGPD (Disponibilidade dos serviços)
      await this.repo.saveCode(userId, code);
    }
  }
}
