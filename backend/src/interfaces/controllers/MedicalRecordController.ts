import type { Request, Response, NextFunction } from "express";
import { parsePagination } from "../../domain/shared/pagination";
import type {
  CreateMedicalRecordDTO,
  UpdateMedicalRecordDTO,
} from "../../application/dtos/MedicalRecordDTOs";
import { CreateMedicalRecord } from "../../application/use-cases/CreateMedicalRecord";
import {
  GetMedicalRecord,
  ListMedicalRecords,
  ListMedicalRecordsByPatient,
} from "../../application/use-cases/GetMedicalRecord";
import { UpdateMedicalRecord } from "../../application/use-cases/UpdateMedicalRecord";
import { DeleteMedicalRecord } from "../../application/use-cases/DeleteMedicalRecord";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaMedicalRecordRepository } from "../../infrastructure/repositories/PrismaMedicalRecordRepository";
import { PrismaAuditLogRepository } from "../../infrastructure/repositories/PrismaAuditLogRepository";
import { AuditService } from "../../application/services/AuditService";

const medicalRecordRepository = new PrismaMedicalRecordRepository(prisma);
const auditService = new AuditService(new PrismaAuditLogRepository(prisma));

export class MedicalRecordController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateMedicalRecordDTO;
      const record = await new CreateMedicalRecord(
        medicalRecordRepository,
      ).execute(dto);
      auditService.create(req, "MEDICAL_RECORD", record.id);
      res.status(201).json({
        success: true,
        message: "Prontuário criado com sucesso.",
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const search = req.query.search ? String(req.query.search) : undefined;
      const createdToday = req.query.createdToday === "true";

      const result = await new ListMedicalRecords(
        medicalRecordRepository,
      ).execute(pagination, {
        search,
        createdToday,
      });
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const record = await new GetMedicalRecord(
        medicalRecordRepository,
      ).execute(req.params.id as string);
      auditService.view(req, "MEDICAL_RECORD", record.id);
      res.status(200).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  async getByPatient(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const records = await new ListMedicalRecordsByPatient(
        medicalRecordRepository,
      ).execute(req.params.patientId as string);
      auditService.view(req, "MEDICAL_RECORD", req.params.patientId);
      res.status(200).json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateMedicalRecordDTO;

      const oldMedicalRecord = await medicalRecordRepository.findById(
        req.params.id as string,
      );
      const record = await new UpdateMedicalRecord(
        medicalRecordRepository,
      ).execute(req.params.id as string, dto);

      const oldMedical = oldMedicalRecord
        ? (({ patient, ...rest }) => rest)(oldMedicalRecord)
        : undefined;

      auditService.update(
        req,
        "MEDICAL_RECORD",
        record.id,
        oldMedical,
        record,
      );
      res.status(200).json({
        success: true,
        message: "Prontuário atualizado com sucesso.",
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteMedicalRecord(medicalRecordRepository).execute(
        req.params.id as string,
      );
      auditService.delete(req, "MEDICAL_RECORD", req.params.id);
      res
        .status(200)
        .json({ success: true, message: "Prontuário deletado com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}
