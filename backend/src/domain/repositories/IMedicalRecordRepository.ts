import type { MedicalRecord, CreateMedicalRecordData, UpdateMedicalRecordData, MedicalRecordFilters } from "../entities/MedicalRecord";
import type { PaginationQuery } from "../shared/pagination";

export interface IMedicalRecordRepository {
  findById(id: string): Promise<MedicalRecord | null>;
  findByAppointmentId(appointmentId: string): Promise<MedicalRecord | null>;
  findByPatientId(patientId: string): Promise<MedicalRecord[]>;
  findAll(pagination?: PaginationQuery, filters?: MedicalRecordFilters): Promise<MedicalRecord[]>;
  count(filters?: MedicalRecordFilters): Promise<number>;
  create(data: CreateMedicalRecordData): Promise<MedicalRecord>;
  update(id: string, data: UpdateMedicalRecordData): Promise<MedicalRecord>;
  delete(id: string): Promise<void>;
}
