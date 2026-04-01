import type { IMedicalRecordRepository } from "../../domain/repositories/IMedicalRecordRepository";
import type { CreateMedicalRecordDTO, MedicalRecordResponseDTO } from "../dtos/MedicalRecordDTOs";
import { ConflictError } from "../../domain/errors/DomainError";
import { toMedicalRecordResponseDTO } from "../mappers/medicalRecordMapper";

export class CreateMedicalRecord {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(dto: CreateMedicalRecordDTO): Promise<MedicalRecordResponseDTO> {
    const existing = await this.medicalRecordRepository.findByAppointmentId(dto.appointmentId);
    if (existing) throw new ConflictError("Já existe um prontuário para esta consulta.");

    const record = await this.medicalRecordRepository.create({
      appointmentId: dto.appointmentId,
      patientId: dto.patientId,
      diagnosis: dto.diagnosis ?? null,
      prescription: dto.prescription ?? null,
      notes: dto.notes ?? null,
    });

    return toMedicalRecordResponseDTO(record);
  }
}
