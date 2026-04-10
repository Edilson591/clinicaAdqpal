// =============================================================================
// Tipos que espelham os DTOs do backend ADQPAL
// =============================================================================

export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
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

// ─── Specialty ────────────────────────────────────────────────────────────────

export interface SpecialtyResponse {
  id: string;
  name: string;
}

// ─── Appointment ──────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "NO_SHOW"
  | "CANCELLED";

export type AppointmentType = "IN_PERSON" | "ONLINE" | "HOME_CARE";

export interface AppointmentResponse {
  id: string;
  userId: string;
  patientId: string;
  scheduledAt: string;
  status: AppointmentStatus;
  type: AppointmentType;
  specialtyId: string | null;
  pacient: PatientResponse;
  roomId: string | null;
  meetingLink: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentInput {
  userId: string;
  patientId: string;
  scheduledAt: string;
  type?: AppointmentType;
  specialtyId?: string | null;
  roomId?: string | null;
  meetingLink?: string | null;
  address?: string | null;
  notes?: string | null;
}

export interface UpdateAppointmentInput {
  userId?: string;
  patientId?: string;
  scheduledAt?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  specialtyId?: string | null;
  roomId?: string | null;
  meetingLink?: string | null;
  address?: string | null;
  notes?: string | null;
}

// ─── MedicalRecord ────────────────────────────────────────────────────────────

export interface MedicalRecordResponse {
  id: string;
  appointmentId: string;
  patientId: string;
  diagnosis: string | null;
  patient: PatientResponse;
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

// ─── Financial ────────────────────────────────────────────────────────────────

export type AccountType = "CHECKING" | "SAVINGS" | "CASH" | "CREDIT_CARD" | "INVESTMENT";
export type CategoryType = "INCOME" | "EXPENSE" | "BOTH";
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type TransactionStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type PaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "PIX"
  | "BANK_TRANSFER"
  | "INSURANCE"
  | "OTHER";

export interface FinancialAccountResponse {
  id: string;
  name: string;
  type: AccountType;
  bank: string | null;
  initialBalance: number;
  currentBalance: number;
  currency: string;
  isActive: boolean;
  isDefault: boolean;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialCategoryResponse {
  id: string;
  name: string;
  type: CategoryType;
  color: string | null;
  icon: string | null;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  children: { id: string; name: string }[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  id: string;
  accountId: string;
  categoryId: string;
  patientId: string | null;
  appointmentId: string | null;
  createdBy: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  dueDate: string;
  paidAt: string | null;
  reference: string | null;
  isRecurring: boolean;
  recurringGroupId: string | null;
  installmentNumber: number | null;
  totalInstallments: number | null;
  transferToAccountId: string | null;
  tags: string[];
  attachmentUrl: string | null;
  account: { id: string; name: string; color: string | null } | null;
  category: { id: string; name: string; color: string | null } | null;
  patient: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}
