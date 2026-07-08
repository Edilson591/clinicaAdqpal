import type { Request, Response, NextFunction } from "express";
import { parsePagination } from "../../domain/shared/pagination";
import { CreateNotaFiscalSchema, UpdateNotaFiscalSchema } from "../../application/dtos/NotaFiscalDTOs";
import { CreateNotaFiscal } from "../../application/use-cases/CreateNotaFiscal";
import { GetNotaFiscal } from "../../application/use-cases/GetNotaFiscal";
import { UpdateNotaFiscal } from "../../application/use-cases/UpdateNotaFiscal";
import { EmitirNotaFiscal } from "../../application/use-cases/EmitirNotaFiscal";
import { CancelNotaFiscal } from "../../application/use-cases/CancelNotaFiscal";
import { DeleteNotaFiscal } from "../../application/use-cases/DeleteNotaFiscal";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaNotaFiscalRepository } from "../../infrastructure/repositories/PrismaNotaFiscalRepository";
import type { NotaFiscalStatus } from "../../domain/entities/NotaFiscal";

const notaFiscalRepository = new PrismaNotaFiscalRepository(prisma);

export class NotaFiscalController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = CreateNotaFiscalSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Dados inválidos. Verifique as informações enviadas.",
        });
        return;
      }
      const notaFiscal = await new CreateNotaFiscal(notaFiscalRepository).execute(
        parsed.data,
        req.userId,
      );
      res.status(201).json({ success: true, message: "Nota fiscal criada com sucesso.", data: notaFiscal });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const search = req.query.search as string | undefined;
      const status = req.query.status as NotaFiscalStatus | undefined;
      const patientId = req.query.patientId as string | undefined;
      const dateStart = req.query.dateStart as string | undefined;
      const dateEnd = req.query.dateEnd as string | undefined;

      const result = await new GetNotaFiscal(notaFiscalRepository).executeList(pagination, {
        search,
        status,
        patientId,
        dateStart,
        dateEnd,
      });
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notaFiscal = await new GetNotaFiscal(notaFiscalRepository).executeById(req.params.id as string);
      res.status(200).json({ success: true, data: notaFiscal });
    } catch (err) {
      next(err);
    }
  }

  async getByPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const result = await new GetNotaFiscal(notaFiscalRepository).executeByPatient(
        req.params.patientId as string,
        pagination,
      );
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = UpdateNotaFiscalSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Dados inválidos. Verifique as informações enviadas.",
        });
        return;
      }
      const notaFiscal = await new UpdateNotaFiscal(notaFiscalRepository).execute(
        req.params.id as string,
        parsed.data,
      );
      res.status(200).json({ success: true, message: "Nota fiscal atualizada com sucesso.", data: notaFiscal });
    } catch (err) {
      next(err);
    }
  }

  async emitir(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notaFiscal = await new EmitirNotaFiscal(notaFiscalRepository).execute(req.params.id as string);
      res.status(200).json({ success: true, message: "Nota fiscal emitida com sucesso.", data: notaFiscal });
    } catch (err) {
      next(err);
    }
  }

  async cancelar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notaFiscal = await new CancelNotaFiscal(notaFiscalRepository).execute(req.params.id as string);
      res.status(200).json({ success: true, message: "Nota fiscal cancelada com sucesso.", data: notaFiscal });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteNotaFiscal(notaFiscalRepository).execute(req.params.id as string);
      res.status(200).json({ success: true, message: "Nota fiscal removida com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}
