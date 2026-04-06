import type { PatientHistory, CreatePatientHistoryData, PatientHistoryType } from "../entities/PatientHistory";
import type { PaginationQuery } from "../shared/pagination";

export interface ListHistoryFilters {
  type?: PatientHistoryType;
  search?: string;
  pagination: PaginationQuery;
}

export interface IPatientHistoryRepository {
  create(data: CreatePatientHistoryData): Promise<PatientHistory>;
  findByPatient(patientId: string, filters: ListHistoryFilters): Promise<[PatientHistory[], number]>;
  findById(id: string): Promise<PatientHistory | null>;
  softDelete(id: string): Promise<void>;
}
