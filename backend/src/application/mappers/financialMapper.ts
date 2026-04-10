import type { FinancialAccount } from "../../domain/entities/FinancialAccount";
import type { FinancialCategory } from "../../domain/entities/FinancialCategory";
import type { Transaction } from "../../domain/entities/Transaction";
import type {
  FinancialAccountResponseDTO,
  FinancialCategoryResponseDTO,
  TransactionResponseDTO,
} from "../dtos/FinancialDTOs";

export function toFinancialAccountResponseDTO(
  account: FinancialAccount & { currentBalance?: number }
): FinancialAccountResponseDTO {
  return {
    id: account.id,
    name: account.name,
    type: account.type,
    bank: account.bank,
    initialBalance: account.initialBalance,
    currentBalance: account.currentBalance ?? account.initialBalance,
    currency: account.currency,
    isActive: account.isActive,
    isDefault: account.isDefault,
    color: account.color,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  };
}

export function toFinancialCategoryResponseDTO(
  category: FinancialCategory
): FinancialCategoryResponseDTO {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    color: category.color,
    icon: category.icon,
    parentId: category.parentId,
    parent: category.parent ?? null,
    children: category.children ?? [],
    isDefault: category.isDefault,
    isActive: category.isActive,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function toTransactionResponseDTO(tx: Transaction): TransactionResponseDTO {
  return {
    id: tx.id,
    accountId: tx.accountId,
    categoryId: tx.categoryId,
    patientId: tx.patientId,
    appointmentId: tx.appointmentId,
    createdBy: tx.createdBy,
    type: tx.type,
    amount: tx.amount,
    description: tx.description,
    status: tx.status,
    paymentMethod: tx.paymentMethod,
    dueDate: tx.dueDate.toISOString(),
    paidAt: tx.paidAt ? tx.paidAt.toISOString() : null,
    reference: tx.reference,
    isRecurring: tx.isRecurring,
    recurringGroupId: tx.recurringGroupId,
    installmentNumber: tx.installmentNumber,
    totalInstallments: tx.totalInstallments,
    transferToAccountId: tx.transferToAccountId,
    tags: tx.tags,
    attachmentUrl: tx.attachmentUrl,
    account: tx.account ?? null,
    category: tx.category ?? null,
    patient: tx.patient ?? null,
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
  };
}
