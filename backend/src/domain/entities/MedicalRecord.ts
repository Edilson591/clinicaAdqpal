// =============================================================================
// DOMAIN ENTITY: MedicalRecord
// =============================================================================

export interface MedicalRecord {
  id: string;
  appointmentId: string | null;
  patientId: string;
  diagnosis: string | null;
  prescription: string | null;
  notes: string | null;
  patient?: { id: string; name: string; phone?: string | null; email?: string | null } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicalRecordData {
  appointmentId: string | null;
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

export interface MedicalRecordFilters {
  /** Busca por nome do paciente (case-insensitive) */
  search?: string;
  /** Retorna apenas pacientes criados hoje */
  createdToday?: boolean;
}
