import type { IMedicalRecordRepository } from "../../domain/repositories/IMedicalRecordRepository";
import type { MedicalRecordResponseDTO } from "../dtos/MedicalRecordDTOs";
import { NotFoundError } from "../../domain/errors/DomainError";
import { toMedicalRecordResponseDTO } from "../mappers/medicalRecordMapper";
import type { PaginationQuery, PaginatedResult } from "../../domain/shared/pagination";
import { toPaginatedResult } from "../../domain/shared/pagination";

export class GetMedicalRecord {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(id: string): Promise<MedicalRecordResponseDTO> {
    const record = await this.medicalRecordRepository.findById(id);
    if (!record) throw new NotFoundError("Prontuário");
    return toMedicalRecordResponseDTO(record);
  }
}

export class ListMedicalRecords {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(pagination?: PaginationQuery): Promise<PaginatedResult<MedicalRecordResponseDTO>> {
    const pg: PaginationQuery = pagination ?? { page: 1, limit: 20 };
    const [records, total] = await Promise.all([
      this.medicalRecordRepository.findAll(pg),
      this.medicalRecordRepository.count(),
    ]);
    return toPaginatedResult(records.map(toMedicalRecordResponseDTO), total, pg);
  }
}

export class ListMedicalRecordsByPatient {
  constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) {}

  async execute(patientId: string): Promise<MedicalRecordResponseDTO[]> {
    const records = await this.medicalRecordRepository.findByPatientId(patientId);
    return records.map(toMedicalRecordResponseDTO);
  }
}
