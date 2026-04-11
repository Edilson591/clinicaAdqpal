import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FinancialAccountService,
  FinancialCategoryService,
  TransactionService,
  DashboardService,
  type TransactionFilters,
} from "../services/Financial";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const financialKeys = {
  accounts: {
    all: ["financial", "accounts"] as const,
    list: (isActive?: boolean) => ["financial", "accounts", "list", { isActive }] as const,
    detail: (id: string) => ["financial", "accounts", id] as const,
  },
  categories: {
    all: ["financial", "categories"] as const,
    list: (type?: string, isActive?: boolean) =>
      ["financial", "categories", "list", { type, isActive }] as const,
    detail: (id: string) => ["financial", "categories", id] as const,
  },
  transactions: {
    all: ["financial", "transactions"] as const,
    list: (filters?: TransactionFilters) =>
      ["financial", "transactions", "list", filters] as const,
    detail: (id: string) => ["financial", "transactions", id] as const,
  },
};

// ─── Accounts ─────────────────────────────────────────────────────────────────

export function useFinancialAccounts(isActive?: boolean) {
  return useQuery({
    queryKey: financialKeys.accounts.list(isActive),
    queryFn: () => FinancialAccountService.getAll(isActive),
  });
}

export function useFinancialAccountById(id: string) {
  return useQuery({
    queryKey: financialKeys.accounts.detail(id),
    queryFn: () => FinancialAccountService.getById(id),
    enabled: !!id,
  });
}

export function useCreateFinancialAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => FinancialAccountService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialKeys.accounts.all }),
  });
}

export function useUpdateFinancialAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      FinancialAccountService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialKeys.accounts.all }),
  });
}

export function useDeleteFinancialAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => FinancialAccountService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialKeys.accounts.all }),
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useFinancialCategories(type?: string, isActive?: boolean) {
  return useQuery({
    queryKey: financialKeys.categories.list(type, isActive),
    queryFn: () => FinancialCategoryService.getAll(type, isActive),
  });
}

export function useCreateFinancialCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => FinancialCategoryService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialKeys.categories.all }),
  });
}

export function useUpdateFinancialCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      FinancialCategoryService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialKeys.categories.all }),
  });
}

export function useDeleteFinancialCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => FinancialCategoryService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialKeys.categories.all }),
  });
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: financialKeys.transactions.list(filters),
    queryFn: () => TransactionService.getAll(filters),
  });
}

export function useTransactionById(id: string) {
  return useQuery({
    queryKey: financialKeys.transactions.detail(id),
    queryFn: () => TransactionService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => TransactionService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financialKeys.transactions.all });
      qc.invalidateQueries({ queryKey: financialKeys.accounts.all }); // saldo pode mudar
    },
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      TransactionService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financialKeys.transactions.all });
      qc.invalidateQueries({ queryKey: financialKeys.accounts.all });
    },
  });
}

export function useDashboardFinance(month: string) {
  return useQuery({
    queryKey: ["financial", "dashboard", month],
    queryFn: () => DashboardService.getDashboard(month),
    enabled: !!month,
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TransactionService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financialKeys.transactions.all });
      qc.invalidateQueries({ queryKey: financialKeys.accounts.all });
    },
  });
}
