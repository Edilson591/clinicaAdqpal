import type { Patient, CreatePatientData, UpdatePatientData } from "../entities/Patient";
import type { PaginationQuery } from "../shared/pagination";

export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>;
  findByCpf(cpf: string): Promise<Patient | null>;
  findAll(pagination?: PaginationQuery): Promise<Patient[]>;
  count(): Promise<number>;
  create(data: CreatePatientData): Promise<Patient>;
  update(id: string, data: UpdatePatientData): Promise<Patient>;
  delete(id: string): Promise<void>;
}
