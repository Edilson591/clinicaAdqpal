export type TwoFactorVerificationResult = "VALID" | "INVALID" | "EXPIRED" | "LOCKED";

export interface IAuth2FA {
  saveCode(userId: string, codeHash: string): Promise<void>;
  hasActiveCode(userId: string): Promise<boolean>;
  reserveResend(userId: string): Promise<boolean>;
  verifyCode(userId: string, codeHash: string): Promise<TwoFactorVerificationResult>;
  invalidateCode(userId: string): Promise<void>;
}
