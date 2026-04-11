import type { Request, Response, NextFunction } from "express";
import { parsePagination } from "../../domain/shared/pagination";
import type { CreatePatientDTO, UpdatePatientDTO } from "../../application/dtos/PatientDTOs";
import { CreatePatient } from "../../application/use-cases/CreatePatient";
import { GetPatient } from "../../application/use-cases/GetPatient";
import { UpdatePatient } from "../../application/use-cases/UpdatePatient";
import { DeletePatient } from "../../application/use-cases/DeletePatient";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaPatientRepository } from "../../infrastructure/repositories/PrismaPatientRepository";

const patientRepository = new PrismaPatientRepository(prisma);

export class PatientController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreatePatientDTO;
      const userId = (req as Request & { userId: string }).userId;

      const patient = await new CreatePatient(patientRepository).execute(dto);

      // Monta descrição com os dados informados no cadastro
      const lines: string[] = [`Paciente cadastrado no sistema.`];
      if (dto.dateOfBirth) lines.push(`Data de nascimento: ${new Date(dto.dateOfBirth).toLocaleDateString("pt-BR")}`);
      if (dto.gender)      lines.push(`Gênero: ${dto.gender}`);
      if (dto.cpf)         lines.push(`CPF: ${dto.cpf}`);
      if (dto.phone)       lines.push(`Telefone: ${dto.phone}`);
      if (dto.email)       lines.push(`E-mail: ${dto.email}`);
      if (dto.agreement)   lines.push(`Convênio/Plano: ${dto.agreement}`);
      if (dto.street)      lines.push(`Endereço: ${dto.street}${dto.streetNumber ? `, ${dto.streetNumber}` : ""}${dto.city ? ` — ${dto.city}` : ""}${dto.state ? `/${dto.state}` : ""}`);
      if (dto.additionalInfo) lines.push(`Observações: ${dto.additionalInfo}`);

      await prisma.patientHistory.create({
        data: {
          patientId:   patient.id,
          doctorId:    userId,
          type:        "OBSERVACAO",
          title:       "Cadastro inicial do paciente",
          description: lines.join("\n"),
        },
      });


      res.status(201).json({ success: true, message: "Paciente criado com sucesso.", data: patient });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const search = req.query.search ? String(req.query.search) : undefined;
      const createdToday = req.query.createdToday === "true";

      const where: Record<string, unknown> = {};
      if (search) where.name = { contains: search, mode: "insensitive" };
      if (createdToday) {
        const start = new Date(); start.setHours(0, 0, 0, 0);
        const end   = new Date(); end.setHours(23, 59, 59, 999);
        where.createdAt = { gte: start, lte: end };
      }

      const [rows, total] = await Promise.all([
        prisma.patient.findMany({
          where,
          orderBy: { name: "asc" },
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
          include: {
            medicalRecords: {
              select: { id: true, createdAt: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        }),
        prisma.patient.count({ where }),
      ]);

      const data = rows.map(({ medicalRecords, ...p }) => ({
        ...p,
        dateOfBirth: p.dateOfBirth?.toISOString() ?? null,
        createdAt:   p.createdAt.toISOString(),
        updatedAt:   p.updatedAt.toISOString(),
        latestMedicalRecordId: medicalRecords[0]?.id ?? null,
      }));

      res.status(200).json({
        success: true,
        data,
        pagination: {
          total,
          page:       pagination.page,
          limit:      pagination.limit,
          totalPages: Math.ceil(total / pagination.limit),
        },
      });
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
