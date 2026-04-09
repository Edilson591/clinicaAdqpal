import type { MedicalRecord } from "../../domain/entities/MedicalRecord";
import type { MedicalRecordResponseDTO } from "../dtos/MedicalRecordDTOs";

export function toMedicalRecordResponseDTO(record: MedicalRecord): MedicalRecordResponseDTO {
  return {
    id: record.id,
    appointmentId: record.appointmentId,
    patientId: record.patientId,
    diagnosis: record.diagnosis,
    prescription: record.prescription,
    notes: record.notes,
    patient: record.patient ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
