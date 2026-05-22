import type { Request, Response, NextFunction } from "express";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaPasswordResetRepository } from "../../infrastructure/repositories/PrismaPasswordResetRepository";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import { MailService } from "../../infrastructure/services/MailService ";
import { ForgotPasswordDTO, ResetPasswordDTO } from "../../application/dtos/UserPasswordDTOS";
import { ForgotPassword } from "../../application/use-cases/ForgotPassword";
import { ResetPassword } from "../../application/use-cases/ResetPassword";

const prismaUserRepo = new PrismaUserRepository(prisma);
const prismaPasswordResetRepo = new PrismaPasswordResetRepository(prisma);
const mailService = new MailService() as any;
const hashService = new BcryptHashService();
export class ForgotPasswordController {
  async forgot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body as ForgotPasswordDTO;
      const result = await new ForgotPassword(
        prismaUserRepo,
        prismaPasswordResetRepo,
        mailService,
      ).execute(email);
       res.status(201).json({ success: true, message: result.message });
    } catch (err) {
      next(err);
    }
  }
  async reset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body as ResetPasswordDTO;
      const result = await new ResetPassword(
        prismaPasswordResetRepo,
        prismaUserRepo,
        hashService,
      ).execute(token, password);
      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      next(err);
    }
  }
}