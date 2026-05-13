import type { PasswordResetToken, PrismaClient } from "@prisma/client";
import type { IPasswordResetRepository } from "../../domain/repositories/IPasswordResetRepository";

export class PrismaPasswordResetRepository implements IPasswordResetRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async createToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  findLatestByUserId(userId: string): Promise<PasswordResetToken | null> {
    return this.prisma.passwordResetToken.findFirst({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { token },
    });
  }

  async deleteToken(token: string): Promise<void> {
    await this.prisma.passwordResetToken.delete({
      where: { token },
    });
  }

  async deleteTokensByUserId(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }
}
