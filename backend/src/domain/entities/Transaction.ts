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

export interface Transaction {
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
  dueDate: Date;
  paidAt: Date | null;
  reference: string | null;
  isRecurring: boolean;
  recurringGroupId: string | null;
  installmentNumber: number | null;
  totalInstallments: number | null;
  transferToAccountId: string | null;
  tags: string[];
  attachmentUrl: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // relations (optional, populated on demand)
  account?: { id: string; name: string; color: string | null } | null;
  category?: { id: string; name: string; color: string | null } | null;
  patient?: { id: string; name: string } | null;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  patientId?: string;
  appointmentId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  dateStart?: Date;
  dateEnd?: Date;
  search?: string;
  page?: number;
  limit?: number;
}
