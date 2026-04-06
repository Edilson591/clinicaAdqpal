// =============================================================================
// Tipos que espelham os DTOs do backend ADQPAL
// =============================================================================

export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  roleId: number;
  cpf: string | null;
  cnpj: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  roleId: number;
  cpf?: string | null;
  cnpj?: string | null;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  roleId?: number;
  cpf?: string | null;
  cnpj?: string | null;
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export interface PatientResponse {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  dateOfBirth: string | null;

  // novos campos
  gender: string | null;
  agreement: string | null;

  street: string | null;
  streetNumber: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  additionalInfo: string | null;

  address: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  dateOfBirth?: string | null;

  additionalInfo?: string | null;
  agreement?: string | null;
  gender?: string | null;

  street?: string | null;
  streetNumber?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
}

export interface UpdatePatientInput {
  name?: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  dateOfBirth?: string | null;

  gender?: string | null;
  agreement?: string | null;

  street?: string | null;
  streetNumber?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  additionalInfo?: string | null;
}

// ─── Appointment ──────────────────────────────────────────────────────────────

export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface AppointmentResponse {
  id: string;
  userId: string;
  patientId: string;
  scheduledAt: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentInput {
  userId: string;
  patientId: string;
  scheduledAt: string;
  notes?: string | null;
}

export interface UpdateAppointmentInput {
  userId?: string;
  patientId?: string;
  scheduledAt?: string;
  status?: AppointmentStatus;
  notes?: string | null;
}

// ─── MedicalRecord ────────────────────────────────────────────────────────────

export interface MedicalRecordResponse {
  id: string;
  appointmentId: string;
  patientId: string;
  diagnosis: string | null;
  prescription: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordInput {
  appointmentId: string;
  patientId: string;
  diagnosis?: string | null;
  prescription?: string | null;
  notes?: string | null;
}

export interface UpdateMedicalRecordInput {
  diagnosis?: string | null;
  prescription?: string | null;
  notes?: string | null;
}

// ─── PatientHistory ───────────────────────────────────────────────────────────

export type HistoryType =
  | "CONSULTA"
  | "EXAME"
  | "PRESCRICAO"
  | "OBSERVACAO"
  | "SOLICITACAO";

export interface PatientHistoryResponse {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string | null;
  type: HistoryType;
  title: string;
  description: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientHistoryInput {
  type: string;
  title: string;
  description: string;
  appointmentId?: string | null;
  attachments?: string[];
}
