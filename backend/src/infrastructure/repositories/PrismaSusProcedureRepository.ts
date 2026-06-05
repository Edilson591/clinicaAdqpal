import type { PrismaClient } from "@prisma/client";
import type { ISusProcedureRepository } from "../../domain/repositories/ISusProcedureRepository";
import type { SusProcedure, SusProcedureData } from "../../domain/entities/SusProcedure";

function toDomain(row: {
  id: string;
  codigo: string;
  nome: string;
  modalidade: string;
  createdAt: Date;
  updatedAt: Date;
}): SusProcedure {
  return {
    id: row.id,
    codigo: row.codigo,
    nome: row.nome,
    modalidade: row.modalidade,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaSusProcedureRepository implements ISusProcedureRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByCodigo(codigo: string): Promise<SusProcedure | null> {
    const row = await this.prisma.susProcedure.findUnique({ where: { codigo } });
    return row ? toDomain(row) : null;
  }

  async findAll(): Promise<SusProcedure[]> {
    const rows = await this.prisma.susProcedure.findMany({ orderBy: { nome: "asc" } });
    return rows.map(toDomain);
  }

  async upsertMany(data: SusProcedureData[]): Promise<number> {
    let count = 0;
    for (const item of data) {
      await this.prisma.susProcedure.upsert({
        where: { codigo: item.codigo },
        update: { nome: item.nome, modalidade: item.modalidade },
        create: { codigo: item.codigo, nome: item.nome, modalidade: item.modalidade },
      });
      count++;
    }
    return count;
  }

  async deleteAll(): Promise<void> {
    await this.prisma.susProcedure.deleteMany();
  }

  async count(): Promise<number> {
    return await this.prisma.susProcedure.count();
  }
}
