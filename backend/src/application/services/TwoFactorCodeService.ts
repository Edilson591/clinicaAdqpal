import { createHmac, randomInt } from "crypto";

export function generateTwoFactorCode(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashTwoFactorCode(userId: string, code: string): string {
  const dedicatedPepper = process.env.AUTH_OTP_PEPPER?.trim();
  if (process.env.NODE_ENV === "production" && !dedicatedPepper) {
    throw new Error("AUTH_OTP_PEPPER deve estar configurado em produção.");
  }
  const pepper = dedicatedPepper || process.env.JWT_SECRET?.trim();
  if (!pepper) {
    throw new Error("AUTH_OTP_PEPPER ou JWT_SECRET deve estar configurado.");
  }

  return createHmac("sha256", pepper)
    .update(`${userId}:${code}`, "utf8")
    .digest("hex");
}
