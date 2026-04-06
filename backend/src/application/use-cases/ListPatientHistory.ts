import type { IPatientHistoryRepository } from "../../domain/repositories/IPatientHistoryRepository";
import type { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import type { PatientHistoryResponseDTO } from "../dtos/PatientHistoryDTOs";
import { toPatientHistoryResponseDTO } from "../dtos/PatientHistoryDTOs";
import type { PatientHistoryType } from "../../domain/entities/PatientHistory";
import type { PaginationQuery, PaginatedResult } from "../../domain/shared/pagination";
import { toPaginatedResult } from "../../domain/shared/pagination";
import { NotFoundError } from "../../domain/errors/DomainError";

export interface ListPatientHistoryFilters {
  type?: PatientHistoryType;
  search?: string;
  pagination: PaginationQuery;
}

export class ListPatientHistory {
  constructor(
    private readonly historyRepository: IPatientHistoryRepository,
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(
    patientId: string,
    filters: ListPatientHistoryFilters,
  ): Promise<PaginatedResult<PatientHistoryResponseDTO>> {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new NotFoundError("Paciente");

    const [rows, total] = await this.historyRepository.findByPatient(patientId, filters);

    return toPaginatedResult(
      rows.map(toPatientHistoryResponseDTO),
      total,
      filters.pagination,
    );
  }
}
