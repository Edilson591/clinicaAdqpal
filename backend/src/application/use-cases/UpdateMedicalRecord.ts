import type { IMedicalRecordRepository } from "../../domain/repositories/IMedicalRecordRepository";
import type { UpdateMedicalRecordDTO, MedicalRecordResponseDTO } from "../dtos/MedicalRecordDTOs";
import { NotFoundError } from "../../domain/errors/DomainError";
import { toMedicalRecordResponseDTO } from "../mappers/medicalRecordMapper";

export class UpdateMedicalRecord {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(id: string, dto: UpdateMedicalRecordDTO): Promise<MedicalRecordResponseDTO> {
    const record = await this.medicalRecordRepository.findById(id);
    if (!record) throw new NotFoundError("Prontuário");

    const updated = await this.medicalRecordRepository.update(id, dto);
    return toMedicalRecordResponseDTO(updated);
  }
}
