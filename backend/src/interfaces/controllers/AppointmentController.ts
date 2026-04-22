import type { Request, Response, NextFunction } from "express";
import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  SendWhatsAppDTO,
  ListAppointmentsQuery,
  ListByPartyQuery,
} from "../../application/dtos/AppointmentDTOs";
import { sseManager } from "../../infrastructure/sse/SSEManager";
import { parsePagination } from "../../domain/shared/pagination";
import {
  ListAppointmentsQuerySchema,
  ListByPartyQuerySchema,
} from "../../application/dtos/AppointmentDTOs";
import { DomainError } from "../../domain/errors/DomainError";
import { CreateAppointment } from "../../application/use-cases/CreateAppointment";
import {
  GetAppointment,
  ListAppointments,
  ListAppointmentsByPatient,
  ListAppointmentsByUser,
} from "../../application/use-cases/GetAppointment";
import { UpdateAppointment } from "../../application/use-cases/UpdateAppointment";
import { DeleteAppointment } from "../../application/use-cases/DeleteAppointment";
import { getNotificationQueue } from "../../infrastructure/queue/NotificationQueue";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaAppointmentRepository } from "../../infrastructure/repositories/PrismaAppointmentRepository";
import { CachedAppointmentRepository } from "../../infrastructure/cache/CachedAppointmentRepository";
import { getRedisClient } from "../../infrastructure/cache/RedisClient";

const appointmentRepository = new CachedAppointmentRepository(
  new PrismaAppointmentRepository(prisma),
  getRedisClient(),
);

export class AppointmentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateAppointmentDTO;
      const appointment = await new CreateAppointment(
        appointmentRepository,
      ).execute(dto);

      // Cria prontuário vazio automaticamente vinculado à consulta
      await prisma.medicalRecord.create({
        data: {
          appointmentId: appointment.id,
          patientId:     appointment.patientId,
        },
      });

      sseManager.broadcast("appointment_created", appointment);
      res.status(201).json({
        success: true,
        message: "Consulta criada com sucesso.",
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const parsed = ListAppointmentsQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        throw new DomainError(parsed.error.errors[0].message, 400);
      }
      const filters: ListAppointmentsQuery = parsed.data;
      const pagination = parsePagination(req.query);
      const result = await new ListAppointments(appointmentRepository).execute(filters, pagination);
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
      const appointment = await new GetAppointment(
        appointmentRepository,
      ).execute(req.params.id as string);
      res.status(200).json({ success: true, data: appointment });
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
      const parsed = ListByPartyQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        throw new DomainError(parsed.error.errors[0].message, 400);
      }
      const appointments = await new ListAppointmentsByPatient(appointmentRepository).execute(
        req.params.patientId as string,
        parsed.data as ListByPartyQuery,
      );
      res.status(200).json({ success: true, data: appointments });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateAppointmentDTO;
      const appointment = await new UpdateAppointment(
        appointmentRepository,
      ).execute(req.params.id as string, dto);
      sseManager.broadcast("appointment_updated", appointment);
      res.status(200).json({
        success: true,
        message: "Consulta atualizada com sucesso.",
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteAppointment(appointmentRepository).execute(
        req.params.id as string,
      );
      sseManager.broadcast("appointment_deleted", { id: req.params.id });
      res
        .status(200)
        .json({ success: true, message: "Consulta deletada com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  async sendWhatsApp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { telefone, channels } = req.body as SendWhatsAppDTO;
      const { id } = req.params as { id: string };

      // Verify appointment exists before enqueuing
      await new GetAppointment(appointmentRepository).execute(id);

      const job = await getNotificationQueue().add("send-notification", {
        appointmentId: id,
        telefone,
        channels,
      });

      res.status(202).json({
        success: true,
        message: "Notificação enfileirada com sucesso.",
        data: { jobId: job.id, channels },
      });
    } catch (err) {
      next(err);
    }
  }

  subscribe(req: Request, res: Response): void {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    sseManager.addClient(res);

    // Ping inicial para confirmar conexão
    res.write("event: connected\ndata: {}\n\n");

    req.on("close", () => {
      sseManager.removeClient(res);
    });
  }

  async getAppointmentUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const parsed = ListByPartyQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        throw new DomainError(parsed.error.errors[0].message, 400);
      }
      const appointments = await new ListAppointmentsByUser(appointmentRepository).execute(
        req.params.userId as string,
        parsed.data as ListByPartyQuery,
      );
      res.status(200).json({ success: true, data: appointments });
    } catch (err) {
      next(err);
    }
  }
}
