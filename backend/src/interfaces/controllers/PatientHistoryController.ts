import type { Request, Response, NextFunction } from "express";
import { parsePagination } from "../../domain/shared/pagination";
import { CreatePatientHistorySchema } from "../../application/dtos/PatientHistoryDTOs";
import { CreatePatientHistory } from "../../application/use-cases/CreatePatientHistory";
import { ListPatientHistory } from "../../application/use-cases/ListPatientHistory";
import { SoftDeletePatientHistory } from "../../application/use-cases/SoftDeletePatientHistory";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaPatientHistoryRepository } from "../../infrastructure/repositories/PrismaPatientHistoryRepository";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import { PrismaPatientRepository } from "../../infrastructure/repositories/PrismaPatientRepository";
import type { PatientHistoryType } from "../../domain/entities/PatientHistory";

const historyRepository = new PrismaPatientHistoryRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);
const patientRepository = new PrismaPatientRepository(prisma);

export class PatientHistoryController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = CreatePatientHistorySchema.safeParse(req.body);
      if (!parsed.success) {
        res
          .status(400)
          .json({
            success: false,
            message: "Dados inválidos.",
            errors: parsed.error.flatten().fieldErrors,
          });
        return;
      }
      const history = await new CreatePatientHistory(
        historyRepository,
        userRepository,
        patientRepository,
      ).execute(req.userId, req.params.patientId as string, parsed.data);
      res
        .status(201)
        .json({
          success: true,
          message: "Registro criado com sucesso.",
          data: history,
        });
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const type = req.query.type as PatientHistoryType | undefined;
      const search = req.query.search as string | undefined;

      const result = await new ListPatientHistory(
        historyRepository,
        patientRepository,
      ).execute(req.params.patientId as string, { type, search, pagination });
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async softDelete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await new SoftDeletePatientHistory(
        historyRepository,
        userRepository,
      ).execute(req.userId, req.params.id as string);
      res
        .status(200)
        .json({ success: true, message: "Registro removido com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}
