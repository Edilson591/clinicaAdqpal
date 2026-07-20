import Redis from "ioredis";
import { ServiceUnavailableError } from "../../domain/errors/DomainError";
import type {
  IAuth2FA,
  TwoFactorVerificationResult,
} from "../../domain/repositories/IAuth2FA";

const TWO_FACTOR_PREFIX = "auth:2fa:";
const RESEND_PREFIX = "auth:2fa:resend:";
const EXPIRATION_IN_SECONDS = 15 * 60;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

const VERIFY_SCRIPT = `
local codeHash = redis.call("HGET", KEYS[1], "codeHash")
if not codeHash then return "EXPIRED" end
local attempts = tonumber(redis.call("HGET", KEYS[1], "attempts") or "0")
if attempts >= tonumber(ARGV[2]) then
  redis.call("DEL", KEYS[1])
  return "LOCKED"
end
if codeHash == ARGV[1] then
  redis.call("DEL", KEYS[1])
  return "VALID"
end
attempts = attempts + 1
if attempts >= tonumber(ARGV[2]) then
  redis.call("DEL", KEYS[1])
  return "LOCKED"
end
redis.call("HSET", KEYS[1], "attempts", attempts)
return "INVALID"
`;

export class CachedCode2FA implements IAuth2FA {
  constructor(private readonly redis: Redis) {}

  async saveCode(userId: string, codeHash: string): Promise<void> {
    try {
      const result = await this.redis
        .multi()
        .hset(this.challengeKey(userId), "codeHash", codeHash, "attempts", "0")
        .expire(this.challengeKey(userId), EXPIRATION_IN_SECONDS)
        .exec();
      if (!result || result.some(([error]) => error !== null)) {
        throw new Error("Redis recusou a gravação do desafio 2FA.");
      }
    } catch (error) {
      throw unavailable(error);
    }
  }

  async hasActiveCode(userId: string): Promise<boolean> {
    try {
      return (await this.redis.exists(this.challengeKey(userId))) === 1;
    } catch (error) {
      throw unavailable(error);
    }
  }

  async reserveResend(userId: string): Promise<boolean> {
    try {
      const result = await this.redis.set(
        `${RESEND_PREFIX}${userId}`,
        "1",
        "EX",
        RESEND_COOLDOWN_SECONDS,
        "NX",
      );
      return result === "OK";
    } catch (error) {
      throw unavailable(error);
    }
  }

  async verifyCode(userId: string, codeHash: string): Promise<TwoFactorVerificationResult> {
    try {
      return await this.redis.eval(
        VERIFY_SCRIPT,
        1,
        this.challengeKey(userId),
        codeHash,
        MAX_ATTEMPTS.toString(),
      ) as TwoFactorVerificationResult;
    } catch (error) {
      throw unavailable(error);
    }
  }

  async invalidateCode(userId: string): Promise<void> {
    try {
      await this.redis.del(this.challengeKey(userId));
    } catch (error) {
      throw unavailable(error);
    }
  }

  private challengeKey(userId: string): string {
    return `${TWO_FACTOR_PREFIX}${userId}`;
  }
}

function unavailable(error: unknown): ServiceUnavailableError {
  console.error("[Redis] Serviço 2FA indisponível.", error);
  return new ServiceUnavailableError("Serviço de autenticação temporariamente indisponível.");
}
