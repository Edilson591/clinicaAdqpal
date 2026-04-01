import type { IMedicalRecordRepository } from "../../domain/repositories/IMedicalRecordRepository";
import { NotFoundError } from "../../domain/errors/DomainError";

export class DeleteMedicalRecord {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(id: string): Promise<void> {
    const record = await this.medicalRecordRepository.findById(id);
    if (!record) throw new NotFoundError("Prontuário");
    await this.medicalRecordRepository.delete(id);
  }
}
