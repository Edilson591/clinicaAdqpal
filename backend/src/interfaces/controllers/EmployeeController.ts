import type { Request, Response, NextFunction } from "express";
import { parsePagination } from "../../domain/shared/pagination";
import { CreateEmployeeSchema, UpdateEmployeeSchema } from "../../application/dtos/EmployeeDTOs";
import { CreateEmployee } from "../../application/use-cases/CreateEmployee";
import { GetEmployee } from "../../application/use-cases/GetEmployee";
import { UpdateEmployee } from "../../application/use-cases/UpdateEmployee";
import { DeleteEmployee } from "../../application/use-cases/DeleteEmployee";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaEmployeeRepository } from "../../infrastructure/repositories/PrismaEmployeeRepository";
import { PrismaAuditLogRepository } from "../../infrastructure/repositories/PrismaAuditLogRepository";
import { AuditService } from "../../application/services/AuditService";
import type { EmployeeStatus } from "../../domain/entities/Employee";

const employeeRepository = new PrismaEmployeeRepository(prisma);
const auditService = new AuditService(new PrismaAuditLogRepository(prisma));

export class EmployeeController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = CreateEmployeeSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Dados inválidos.",
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }
      const employee = await new CreateEmployee(employeeRepository).execute(parsed.data);
      auditService.create(req, "EMPLOYEE", employee.id);
      res.status(201).json({ success: true, message: "Funcionário criado com sucesso.", data: employee });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const search = req.query.search as string | undefined;
      const status = req.query.status as EmployeeStatus | undefined;
      const department = req.query.department as string | undefined;

      const result = await new GetEmployee(employeeRepository).executeList(pagination, {
        search,
        status,
        department,
      });
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employee = await new GetEmployee(employeeRepository).executeById(String(req.params.id));
      res.status(200).json({ success: true, data: employee });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = UpdateEmployeeSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: "Dados inválidos.",
          errors: parsed.error.flatten().fieldErrors,
        });
        return;
      }
      const employee = await new UpdateEmployee(employeeRepository).execute(String(req.params.id), parsed.data);
      auditService.update(req, "EMPLOYEE", employee.id);
      res.status(200).json({ success: true, message: "Funcionário atualizado com sucesso.", data: employee });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteEmployee(employeeRepository).execute(String(req.params.id));
      auditService.delete(req, "EMPLOYEE", req.params.id);
      res.status(200).json({ success: true, message: "Funcionário removido com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}
