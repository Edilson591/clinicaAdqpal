import type { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import type { PatientResponseDTO } from "../dtos/PatientDTOs";
import { NotFoundError } from "../../domain/errors/DomainError";
import { toPatientResponseDTO } from "../mappers/patientMapper";
import type { PaginationQuery, PaginatedResult } from "../../domain/shared/pagination";
import { toPaginatedResult } from "../../domain/shared/pagination";
import type { PacientFilters } from "../../domain/entities/Patient";

export class GetPatient {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(id: string): Promise<PatientResponseDTO> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) throw new NotFoundError("Paciente");
    return toPatientResponseDTO(patient);
  }
}

export class ListPatients {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(pagination?: PaginationQuery, filters?: PacientFilters): Promise<PaginatedResult<PatientResponseDTO>> {
    const pg: PaginationQuery = pagination ?? { page: 1, limit: 20 };
    const [patients, total] = await Promise.all([
      this.patientRepository.findAll(pg, filters),
      this.patientRepository.count(filters),
    ]);
    return toPaginatedResult(patients.map(toPatientResponseDTO), total, pg);
  }
}
