// =============================================================================
// DOMAIN ENTITY: MedicalRecord
// =============================================================================

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  diagnosis: string | null;
  prescription: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicalRecordData {
  appointmentId: string;
  patientId: string;
  diagnosis?: string | null;
  prescription?: string | null;
  notes?: string | null;
}

export interface UpdateMedicalRecordData {
  diagnosis?: string | null;
  prescription?: string | null;
  notes?: string | null;
}
