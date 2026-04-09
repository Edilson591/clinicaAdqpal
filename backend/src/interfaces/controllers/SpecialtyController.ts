import type { Request, Response, NextFunction } from "express";
import { SpecialtyService } from "../../application/services/SpecialtyService";
import { PrismaSpecialtyRepository } from "../../infrastructure/repositories/PrismaSpecialtyRepository";
import prisma from "../../infrastructure/database/prismaClient";

const specialtyService = new SpecialtyService(new PrismaSpecialtyRepository(prisma));

export class SpecialtyController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const specialties = await specialtyService.getAll();
      res.status(200).json({ success: true, data: specialties });
    } catch (err) {
      next(err);
    }
  }

  async getByDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { doctorId } = req.params as { doctorId: string };
      const specialties = await specialtyService.getByDoctor(doctorId);
      res.status(200).json({ success: true, data: specialties });
    } catch (err) {
      next(err);
    }
  }
}
