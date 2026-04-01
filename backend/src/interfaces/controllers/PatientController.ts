import type { Request, Response, NextFunction } from "express";
import { parsePagination } from "../../domain/shared/pagination";
import type { CreatePatientDTO, UpdatePatientDTO } from "../../application/dtos/PatientDTOs";
import { CreatePatient } from "../../application/use-cases/CreatePatient";
import { GetPatient, ListPatients } from "../../application/use-cases/GetPatient";
import { UpdatePatient } from "../../application/use-cases/UpdatePatient";
import { DeletePatient } from "../../application/use-cases/DeletePatient";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaPatientRepository } from "../../infrastructure/repositories/PrismaPatientRepository";

const patientRepository = new PrismaPatientRepository(prisma);

export class PatientController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreatePatientDTO;
      const patient = await new CreatePatient(patientRepository).execute(dto);
      res.status(201).json({ success: true, message: "Paciente criado com sucesso.", data: patient });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const result = await new ListPatients(patientRepository).execute(pagination);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await new GetPatient(patientRepository).execute(req.params.id as string);
      res.status(200).json({ success: true, data: patient });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdatePatientDTO;
      const patient = await new UpdatePatient(patientRepository).execute(req.params.id as string, dto);
      res.status(200).json({ success: true, message: "Paciente atualizado com sucesso.", data: patient });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeletePatient(patientRepository).execute(req.params.id as string);
      res.status(200).json({ success: true, message: "Paciente deletado com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}
