import type { PrismaClient } from "@prisma/client";
import type { ISpecialtyRepository } from "../../domain/repositories/ISpecialtyRepository";
import type { Specialty, DoctorSpecialty } from "../../domain/entities/Specialty";
import { DomainError } from "../../domain/errors/DomainError";

export class PrismaSpecialtyRepository implements ISpecialtyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Specialty[]> {
    try {
      return await this.prisma.specialty.findMany({
        orderBy: { name: "asc" },
      });
    } catch (err) {
      throw new DomainError(`Erro ao listar especialidades: ${String(err)}`, 500);
    }
  }

  async findByDoctor(doctorId: string): Promise<Specialty[]> {
    try {
      const rows = await this.prisma.doctorSpecialty.findMany({
        where: { doctorId },
        include: { specialty: true },
      });
      return rows.map((r) => r.specialty);
    } catch (err) {
      throw new DomainError(`Erro ao listar especialidades do médico: ${String(err)}`, 500);
    }
  }

  async addToDoctor(doctorId: string, specialtyId: string): Promise<DoctorSpecialty> {
    try {
      return await this.prisma.doctorSpecialty.create({
        data: { doctorId, specialtyId },
      });
    } catch (err) {
      throw new DomainError(`Erro ao associar especialidade: ${String(err)}`, 500);
    }
  }

  async removeFromDoctor(doctorId: string, specialtyId: string): Promise<void> {
    try {
      await this.prisma.doctorSpecialty.delete({
        where: { doctorId_specialtyId: { doctorId, specialtyId } },
      });
    } catch (err) {
      throw new DomainError(`Erro ao remover especialidade: ${String(err)}`, 500);
    }
  }
}
