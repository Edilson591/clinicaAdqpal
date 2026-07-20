import type {
  IAuth2FA,
  TwoFactorVerificationResult,
} from "../../domain/repositories/IAuth2FA";

const EXPIRATION_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export class InMemoryAuth2FA implements IAuth2FA {
  private readonly challenges = new Map<string, Challenge>();
  private readonly resendCooldowns = new Map<string, number>();

  async saveCode(userId: string, codeHash: string): Promise<void> {
    this.challenges.set(userId, {
      codeHash,
      attempts: 0,
      expiresAt: Date.now() + EXPIRATION_MS,
    });
  }

  async hasActiveCode(userId: string): Promise<boolean> {
    return this.getActiveChallenge(userId) !== null;
  }

  async reserveResend(userId: string): Promise<boolean> {
    const now = Date.now();
    const cooldown = this.resendCooldowns.get(userId) ?? 0;
    if (cooldown > now) return false;
    this.resendCooldowns.set(userId, now + 60_000);
    return true;
  }

  async verifyCode(userId: string, codeHash: string): Promise<TwoFactorVerificationResult> {
    const challenge = this.getActiveChallenge(userId);
    if (!challenge) return "EXPIRED";

    if (challenge.codeHash === codeHash) {
      this.challenges.delete(userId);
      return "VALID";
    }

    challenge.attempts += 1;
    if (challenge.attempts >= MAX_ATTEMPTS) {
      this.challenges.delete(userId);
      return "LOCKED";
    }

    return "INVALID";
  }

  async invalidateCode(userId: string): Promise<void> {
    this.challenges.delete(userId);
  }

  private getActiveChallenge(userId: string): Challenge | null {
    const challenge = this.challenges.get(userId);
    if (!challenge || challenge.expiresAt <= Date.now()) {
      this.challenges.delete(userId);
      return null;
    }
    return challenge;
  }
}

type Challenge = {
  codeHash: string;
  attempts: number;
  expiresAt: number;
};
