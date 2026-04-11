import type { PrismaClient } from "@prisma/client";
import type { IPatientHistoryRepository, ListHistoryFilters } from "../../domain/repositories/IPatientHistoryRepository";
import type { PatientHistory, CreatePatientHistoryData } from "../../domain/entities/PatientHistory";

export class PrismaPatientHistoryRepository implements IPatientHistoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreatePatientHistoryData): Promise<PatientHistory> {
    const record = await this.prisma.patientHistory.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        appointmentId: data.appointmentId! ?? null,
        type: data.type,
        title: data.title,
        description: data.description,
        attachments: data.attachments ?? [],
      },
    });
    return this.toDomain(record);
  }

  async findByPatient(
    patientId: string,
    { type, search, pagination }: ListHistoryFilters,
  ): Promise<[PatientHistory[], number]> {
    const where = {
      patientId,
      deletedAt: null,
      ...(type ? { type } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [records, total] = await this.prisma.$transaction([
      this.prisma.patientHistory.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      this.prisma.patientHistory.count({ where }),
    ]);

    return [records.map(this.toDomain), total];
  }

  async findById(id: string): Promise<PatientHistory | null> {
    const record = await this.prisma.patientHistory.findFirst({
      where: { id, deletedAt: null },
    });
    return record ? this.toDomain(record) : null;
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.patientHistory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private toDomain(record: {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentId: string | null;
    type: string;
    title: string;
    description: string;
    attachments: string[];
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): PatientHistory {
    return {
      id: record.id,
      patientId: record.patientId,
      doctorId: record.doctorId,
      appointmentId: record.appointmentId,
      type: record.type as PatientHistory["type"],
      title: record.title,
      description: record.description,
      attachments: record.attachments,
      deletedAt: record.deletedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
