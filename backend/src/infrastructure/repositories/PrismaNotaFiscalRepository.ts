import type { PrismaClient } from "@prisma/client";
import type { INotaFiscalRepository } from "../../domain/repositories/INotaFiscalRepository";
import type {
  NotaFiscal,
  CreateNotaFiscalData,
  UpdateNotaFiscalData,
  NotaFiscalFilters,
  NotaFiscalStatus,
} from "../../domain/entities/NotaFiscal";
import type { PaginationQuery } from "../../domain/shared/pagination";
import { DomainError } from "../../domain/errors/DomainError";

function toDomain(row: {
  id: string;
  numero: string;
  patientId: string;
  appointmentId: string | null;
  transactionId: string | null;
  createdBy: string;
  servico: string;
  valor: unknown;
  status: string;
  dataEmissao: Date | null;
  pdfUrl: string | null;
  observacoes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): NotaFiscal {
  return {
    id: row.id,
    numero: row.numero,
    patientId: row.patientId,
    appointmentId: row.appointmentId,
    transactionId: row.transactionId,
    createdBy: row.createdBy,
    servico: row.servico,
    valor: Number(row.valor),
    status: row.status as NotaFiscalStatus,
    dataEmissao: row.dataEmissao,
    pdfUrl: row.pdfUrl,
    observacoes: row.observacoes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaNotaFiscalRepository implements INotaFiscalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getNextNumero(): Promise<string> {
    try {
      const count = await this.prisma.notaFiscal.count();
      const next = count + 1;
      return `NF-${String(next).padStart(6, "0")}`;
    } catch (err) {
      throw new DomainError(`Erro ao gerar número da NF: ${String(err)}`, 500);
    }
  }

  async findById(id: string): Promise<NotaFiscal | null> {
    try {
      const row = await this.prisma.notaFiscal.findUnique({ where: { id } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar nota fiscal: ${String(err)}`, 500);
    }
  }

  async findByNumero(numero: string): Promise<NotaFiscal | null> {
    try {
      const row = await this.prisma.notaFiscal.findUnique({ where: { numero } });
      return row ? toDomain(row) : null;
    } catch (err) {
      throw new DomainError(`Erro ao buscar nota fiscal: ${String(err)}`, 500);
    }
  }

  private buildWhere(filters?: NotaFiscalFilters) {
    const where: Record<string, unknown> = {};

    if (filters?.search) {
      where.OR = [
        { numero: { contains: filters.search, mode: "insensitive" } },
        { servico: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters?.dateStart || filters?.dateEnd) {
      where.createdAt = {
        ...(filters.dateStart && { gte: new Date(filters.dateStart) }),
        ...(filters.dateEnd && { lte: new Date(filters.dateEnd) }),
      };
    }

    return where;
  }

  async findAll(pagination?: PaginationQuery, filters?: NotaFiscalFilters): Promise<NotaFiscal[]> {
    try {
      const rows = await this.prisma.notaFiscal.findMany({
        where: this.buildWhere(filters),
        orderBy: { createdAt: "desc" },
        ...(pagination && {
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
        }),
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar notas fiscais: ${String(err)}`, 500);
    }
  }

  async findByPatient(patientId: string, pagination?: PaginationQuery): Promise<NotaFiscal[]> {
    try {
      const rows = await this.prisma.notaFiscal.findMany({
        where: { patientId },
        orderBy: { createdAt: "desc" },
        ...(pagination && {
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
        }),
      });
      return rows.map(toDomain);
    } catch (err) {
      throw new DomainError(`Erro ao listar notas fiscais do paciente: ${String(err)}`, 500);
    }
  }

  async count(filters?: NotaFiscalFilters): Promise<number> {
    try {
      return await this.prisma.notaFiscal.count({ where: this.buildWhere(filters) });
    } catch (err) {
      throw new DomainError(`Erro ao contar notas fiscais: ${String(err)}`, 500);
    }
  }

  async countByPatient(patientId: string): Promise<number> {
    try {
      return await this.prisma.notaFiscal.count({ where: { patientId } });
    } catch (err) {
      throw new DomainError(`Erro ao contar notas fiscais do paciente: ${String(err)}`, 500);
    }
  }

  async create(data: CreateNotaFiscalData): Promise<NotaFiscal> {
    try {
      const row = await this.prisma.notaFiscal.create({
        data: {
          numero: data.numero,
          patientId: data.patientId,
          appointmentId: data.appointmentId ?? null,
          transactionId: data.transactionId ?? null,
          createdBy: data.createdBy,
          servico: data.servico,
          valor: data.valor,
          observacoes: data.observacoes ?? null,
        },
      });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao criar nota fiscal: ${String(err)}`, 500);
    }
  }

  async update(id: string, data: UpdateNotaFiscalData): Promise<NotaFiscal> {
    try {
      const row = await this.prisma.notaFiscal.update({ where: { id }, data });
      return toDomain(row);
    } catch (err) {
      throw new DomainError(`Erro ao atualizar nota fiscal: ${String(err)}`, 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.notaFiscal.delete({ where: { id } });
    } catch (err) {
      throw new DomainError(`Erro ao deletar nota fiscal: ${String(err)}`, 500);
    }
  }
}
