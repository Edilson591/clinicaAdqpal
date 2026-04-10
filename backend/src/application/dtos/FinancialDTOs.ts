import { z } from "zod";

// ─── FinancialAccount ─────────────────────────────────────────────────────────

export const CreateFinancialAccountSchema = z.object({
  name: z.string({ required_error: "name é obrigatório" }).min(2).max(100),
  type: z.enum(["CHECKING", "SAVINGS", "CASH", "CREDIT_CARD", "INVESTMENT"], {
    required_error: "type é obrigatório",
  }),
  bank: z.string().max(100).nullable().optional(),
  initialBalance: z.number().default(0),
  currency: z.string().length(3).default("BRL"),
  isDefault: z.boolean().default(false),
  color: z.string().max(20).nullable().optional(),
});

export type CreateFinancialAccountDTO = z.infer<typeof CreateFinancialAccountSchema>;

export const UpdateFinancialAccountSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  type: z.enum(["CHECKING", "SAVINGS", "CASH", "CREDIT_CARD", "INVESTMENT"]).optional(),
  bank: z.string().max(100).nullable().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  color: z.string().max(20).nullable().optional(),
}).refine((d) => Object.keys(d).length > 0, {
  message: "Ao menos um campo deve ser fornecido para atualização",
});

export type UpdateFinancialAccountDTO = z.infer<typeof UpdateFinancialAccountSchema>;

export interface FinancialAccountResponseDTO {
  id: string;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CASH" | "CREDIT_CARD" | "INVESTMENT";
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

// ─── FinancialCategory ────────────────────────────────────────────────────────

export const CreateFinancialCategorySchema = z.object({
  name: z.string({ required_error: "name é obrigatório" }).min(2).max(100),
  type: z.enum(["INCOME", "EXPENSE", "BOTH"], { required_error: "type é obrigatório" }),
  color: z.string().max(20).nullable().optional(),
  icon: z.string().max(50).nullable().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export type CreateFinancialCategoryDTO = z.infer<typeof CreateFinancialCategorySchema>;

export const UpdateFinancialCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  type: z.enum(["INCOME", "EXPENSE", "BOTH"]).optional(),
  color: z.string().max(20).nullable().optional(),
  icon: z.string().max(50).nullable().optional(),
  parentId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().optional(),
}).refine((d) => Object.keys(d).length > 0, {
  message: "Ao menos um campo deve ser fornecido para atualização",
});

export type UpdateFinancialCategoryDTO = z.infer<typeof UpdateFinancialCategorySchema>;

export interface FinancialCategoryResponseDTO {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE" | "BOTH";
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

// ─── Transaction ──────────────────────────────────────────────────────────────

export const CreateTransactionSchema = z.object({
  accountId: z.string({ required_error: "accountId é obrigatório" }).uuid(),
  categoryId: z.string({ required_error: "categoryId é obrigatório" }).uuid(),
  createdBy: z.string({ required_error: "createdBy é obrigatório" }).uuid(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"], { required_error: "type é obrigatório" }),
  amount: z.number({ required_error: "amount é obrigatório" }).positive("amount deve ser positivo"),
  description: z.string({ required_error: "description é obrigatório" }).min(1).max(500),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).default("PENDING"),
  paymentMethod: z
    .enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "BANK_TRANSFER", "INSURANCE", "OTHER"])
    .default("OTHER"),
  dueDate: z.coerce.date({ required_error: "dueDate é obrigatório" }),
  paidAt: z.coerce.date().nullable().optional(),
  patientId: z.string().uuid().nullable().optional(),
  appointmentId: z.string().uuid().nullable().optional(),
  reference: z.string().max(200).nullable().optional(),
  isRecurring: z.boolean().default(false),
  recurringGroupId: z.string().uuid().nullable().optional(),
  installmentNumber: z.number().int().positive().nullable().optional(),
  totalInstallments: z.number().int().positive().nullable().optional(),
  transferToAccountId: z.string().uuid().nullable().optional(),
  tags: z.array(z.string().max(50)).default([]),
  attachmentUrl: z.string().url().nullable().optional(),
});

export type CreateTransactionDTO = z.infer<typeof CreateTransactionSchema>;

export const UpdateTransactionSchema = z.object({
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]).optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(500).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
  paymentMethod: z
    .enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "BANK_TRANSFER", "INSURANCE", "OTHER"])
    .optional(),
  dueDate: z.coerce.date().optional(),
  paidAt: z.coerce.date().nullable().optional(),
  reference: z.string().max(200).nullable().optional(),
  tags: z.array(z.string().max(50)).optional(),
  attachmentUrl: z.string().url().nullable().optional(),
}).refine((d) => Object.keys(d).length > 0, {
  message: "Ao menos um campo deve ser fornecido para atualização",
});

export type UpdateTransactionDTO = z.infer<typeof UpdateTransactionSchema>;

export interface TransactionResponseDTO {
  id: string;
  accountId: string;
  categoryId: string;
  patientId: string | null;
  appointmentId: string | null;
  createdBy: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  description: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentMethod: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "BANK_TRANSFER" | "INSURANCE" | "OTHER";
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

export const ListTransactionsQuerySchema = z.object({
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
  paymentMethod: z
    .enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "BANK_TRANSFER", "INSURANCE", "OTHER"])
    .optional(),
  dateStart: z.coerce.date().optional(),
  dateEnd: z.coerce.date().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ListTransactionsQuery = z.infer<typeof ListTransactionsQuerySchema>;
