import type { Patient, CreatePatientData, UpdatePatientData, PacientFilters } from "../entities/Patient";
import type { PaginationQuery } from "../shared/pagination";

export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>;
  findByCpf(cpf: string): Promise<Patient | null>;
  findAll(pagination?: PaginationQuery, filters?: PacientFilters): Promise<Patient[]>;
  count(filters?: PacientFilters): Promise<number>;
  create(data: CreatePatientData): Promise<Patient>;
  update(id: string, data: UpdatePatientData): Promise<Patient>;
  delete(id: string): Promise<void>;
}
