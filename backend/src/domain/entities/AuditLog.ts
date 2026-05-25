export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "LOGIN_FAILED"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "EXPORT"
  | "PERMISSION_CHANGE"
  | "2FA_VERIFIED"
  | "2FA_RESENT"
  | "PASSWORD_RESET"
  | "PASSWORD_CHANGE";

export type AuditEntity =
  | "USER"
  | "PATIENT"
  | "APPOINTMENT"
  | "MEDICAL_RECORD"
  | "PATIENT_HISTORY"
  | "FINANCIAL_ACCOUNT"
  | "FINANCIAL_CATEGORY"
  | "TRANSACTION"
  | "EMPLOYEE"
  | "NOTA_FISCAL"
  | "SPECIALTY"
  | "ROLE"
  | "SYSTEM";

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface CreateAuditLogData {
  userId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
}
