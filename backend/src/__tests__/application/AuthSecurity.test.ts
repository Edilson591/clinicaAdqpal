import jwt from "jsonwebtoken";
import { RegisterUserSchema } from "../../application/dtos/UserDTOs";
import { sanitizeAuditValue } from "../../application/services/AuditService";
import {
  generateTwoFactorCode,
  hashTwoFactorCode,
} from "../../application/services/TwoFactorCodeService";
import { InMemoryAuth2FA } from "../../infrastructure/cache/InMemoryAuth2FA";
import { CachedCode2FA } from "../../infrastructure/cache/CachedCode2FA";
import type Redis from "ioredis";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";

describe("auth security", () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  const originalOtpPepper = process.env.AUTH_OTP_PEPPER;

  beforeEach(() => {
    process.env.JWT_SECRET = "test-jwt-secret";
    process.env.AUTH_OTP_PEPPER = "test-otp-pepper";
  });

  afterAll(() => {
    restoreEnv("JWT_SECRET", originalJwtSecret);
    restoreEnv("AUTH_OTP_PEPPER", originalOtpPepper);
  });

  it("preserves the role selected by the authenticated administrator", () => {
    const parsed = RegisterUserSchema.parse({
      username: "usuario",
      email: "usuario@example.com",
      password: "SenhaSegura1",
      roleId: 1,
    });
    expect(parsed.roleId).toBe(1);
  });

  it("requires an explicit JWT purpose", () => {
    const service = new JwtTokenService();
    const accessToken = service.sign({
      sub: "user-1",
      email: "user@example.com",
      roleId: 2,
      tokenUse: "ACCESS",
    });
    expect(service.verify(accessToken).tokenUse).toBe("ACCESS");

    const legacyToken = jwt.sign(
      { sub: "user-1", email: "user@example.com", roleId: 2 },
      process.env.JWT_SECRET!,
      { algorithm: "HS256" },
    );
    expect(() => service.verify(legacyToken)).toThrow("Token inválido ou expirado");
  });

  it("stores only OTP hashes and locks the challenge after five failures", async () => {
    const auth2FA = new InMemoryAuth2FA();
    const code = generateTwoFactorCode();
    const hash = hashTwoFactorCode("user-1", code);

    expect(code).toMatch(/^\d{6}$/);
    expect(hash).not.toContain(code);
    await auth2FA.saveCode("user-1", hash);

    for (let attempt = 1; attempt < 5; attempt += 1) {
      await expect(auth2FA.verifyCode("user-1", "wrong-hash")).resolves.toBe("INVALID");
    }
    await expect(auth2FA.verifyCode("user-1", "wrong-hash")).resolves.toBe("LOCKED");
    await expect(auth2FA.verifyCode("user-1", hash)).resolves.toBe("EXPIRED");
  });

  it("consumes a valid OTP challenge once", async () => {
    const auth2FA = new InMemoryAuth2FA();
    await auth2FA.saveCode("user-1", "valid-hash");

    await expect(auth2FA.verifyCode("user-1", "valid-hash")).resolves.toBe("VALID");
    await expect(auth2FA.verifyCode("user-1", "valid-hash")).resolves.toBe("EXPIRED");
  });

  it("enforces a per-user resend cooldown", async () => {
    const auth2FA = new InMemoryAuth2FA();

    await expect(auth2FA.reserveResend("user-1")).resolves.toBe(true);
    await expect(auth2FA.reserveResend("user-1")).resolves.toBe(false);
  });

  it("fails closed when Redis rejects the OTP transaction", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const transaction = {
      hset: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([[new Error("OOM"), null]]),
    };
    const redis = {
      multi: jest.fn().mockReturnValue(transaction),
    } as unknown as Redis;

    try {
      await expect(new CachedCode2FA(redis).saveCode("user-1", "hash"))
        .rejects.toMatchObject({ statusCode: 503 });
    } finally {
      consoleError.mockRestore();
    }
  });

  it("removes credentials, documents and tokens recursively from audit data", () => {
    expect(sanitizeAuditValue({
      id: "user-1",
      passwordHash: "hash",
      cpf: "12345678909",
      nested: { token: "secret-token", name: "Usuario" },
    })).toEqual({ id: "user-1", nested: { name: "Usuario" } });
  });
});

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}
