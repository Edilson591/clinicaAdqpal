import type { Request, Response, NextFunction } from "express";
import { parsePagination } from "../../domain/shared/pagination";
import type { CreateMedicalRecordDTO, UpdateMedicalRecordDTO } from "../../application/dtos/MedicalRecordDTOs";
import { CreateMedicalRecord } from "../../application/use-cases/CreateMedicalRecord";
import { GetMedicalRecord, ListMedicalRecords, ListMedicalRecordsByPatient } from "../../application/use-cases/GetMedicalRecord";
import { UpdateMedicalRecord } from "../../application/use-cases/UpdateMedicalRecord";
import { DeleteMedicalRecord } from "../../application/use-cases/DeleteMedicalRecord";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaMedicalRecordRepository } from "../../infrastructure/repositories/PrismaMedicalRecordRepository";

const medicalRecordRepository = new PrismaMedicalRecordRepository(prisma);

export class MedicalRecordController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateMedicalRecordDTO;
      const record = await new CreateMedicalRecord(medicalRecordRepository).execute(dto);
      res.status(201).json({ success: true, message: "Prontuário criado com sucesso.", data: record });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const result = await new ListMedicalRecords(medicalRecordRepository).execute(pagination);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await new GetMedicalRecord(medicalRecordRepository).execute(req.params.id as string);
      res.status(200).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async getByPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await new ListMedicalRecordsByPatient(medicalRecordRepository).execute(req.params.patientId as string);
      res.status(200).json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateMedicalRecordDTO;
      const record = await new UpdateMedicalRecord(medicalRecordRepository).execute(req.params.id as string, dto);
      res.status(200).json({ success: true, message: "Prontuário atualizado com sucesso.", data: record });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteMedicalRecord(medicalRecordRepository).execute(req.params.id as string);
      res.status(200).json({ success: true, message: "Prontuário deletado com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}
