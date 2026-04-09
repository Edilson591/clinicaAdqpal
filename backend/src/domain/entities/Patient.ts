// =============================================================================
// DOMAIN ENTITY: Patient
// =============================================================================

export interface Patient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  dateOfBirth: Date | null;
  street: string | null;
  streetNumber: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  gender: string | null;
  agreement: string | null;
  additionalInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PacientFilters {
  /** Busca por nome do paciente (case-insensitive) */
  search?: string;
  /** Retorna apenas pacientes criados hoje */
  createdToday?: boolean;
}

export interface CreatePatientData {
  name: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  dateOfBirth?: string | null;
  gender: string;
  agreement: string;
  street?: string | null;
  streetNumber?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  additionalInfo?: string | null;
}

export interface UpdatePatientData {
  name?: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  dateOfBirth?: Date | null;
  gender?: string | null;
  agreement?: string | null;
  street?: string | null;
  streetNumber?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  additionalInfo?: string | null;
}
