import { PasswordResetToken } from "@prisma/client";

export interface IPasswordResetRepository {
  createToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  findByToken(token: string): Promise<{ userId: string; expiresAt: Date } | null>;
  deleteToken(token: string): Promise<void>;
  deleteTokensByUserId(userId: string): Promise<void>;
  findLatestByUserId(userId: string): Promise<PasswordResetToken | null>;
}