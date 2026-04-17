import api from "./api";
import type {
  FinancialAccountResponse,
  FinancialCategoryResponse,
  TransactionResponse,
  PaginatedResponse,
} from "../types/api";

// ─── Accounts ─────────────────────────────────────────────────────────────────

export const FinancialAccountService = {
  async getAll(isActive?: boolean): Promise<FinancialAccountResponse[]> {
    const params = new URLSearchParams();
    if (isActive !== undefined) params.set("isActive", String(isActive));
    const res = await api.get(`/financial/accounts?${params}`);
    return res.data.data;
  },

  async getById(id: string): Promise<FinancialAccountResponse> {
    const res = await api.get(`/financial/accounts/${id}`);
    return res.data.data;
  },

  async create(data: Record<string, unknown>): Promise<FinancialAccountResponse> {
    const res = await api.post("/financial/accounts", data);
    return res.data.data;
  },

  async update(id: string, data: Record<string, unknown>): Promise<FinancialAccountResponse> {
    const res = await api.put(`/financial/accounts/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/financial/accounts/${id}`);
  },
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const FinancialCategoryService = {
  async getAll(type?: string, isActive?: boolean): Promise<FinancialCategoryResponse[]> {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (isActive !== undefined) params.set("isActive", String(isActive));
    const res = await api.get(`/financial/categories?${params}`);
    return res.data.data;
  },

  async getById(id: string): Promise<FinancialCategoryResponse> {
    const res = await api.get(`/financial/categories/${id}`);
    return res.data.data;
  },

  async create(data: Record<string, unknown>): Promise<FinancialCategoryResponse> {
    const res = await api.post("/financial/categories", data);
    return res.data.data;
  },

  async update(id: string, data: Record<string, unknown>): Promise<FinancialCategoryResponse> {
    const res = await api.put(`/financial/categories/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/financial/categories/${id}`);
  },
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  patientId?: string;
  type?: "INCOME" | "EXPENSE" | "TRANSFER";
  status?: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentMethod?: string;
  dateStart?: string;
  dateEnd?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const TransactionService = {
  async getAll(filters?: TransactionFilters): Promise<PaginatedResponse<TransactionResponse>> {
    const params = new URLSearchParams();
    if (filters?.accountId) params.set("accountId", filters.accountId);
    if (filters?.categoryId) params.set("categoryId", filters.categoryId);
    if (filters?.patientId) params.set("patientId", filters.patientId);
    if (filters?.type) params.set("type", filters.type);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.paymentMethod) params.set("paymentMethod", filters.paymentMethod);
    if (filters?.dateStart) params.set("dateStart", filters.dateStart);
    if (filters?.dateEnd) params.set("dateEnd", filters.dateEnd);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    const res = await api.get(`/financial/transactions?${params}`);
    return { data: res.data.data, pagination: res.data.pagination, success: res.data.success };
  },

  async getById(id: string): Promise<TransactionResponse> {
    const res = await api.get(`/financial/transactions/${id}`);
    return res.data.data;
  },

  async create(data: Record<string, unknown>): Promise<TransactionResponse> {
    const res = await api.post("/financial/transactions", data);
    return res.data.data;
  },

  async update(id: string, data: Record<string, unknown>): Promise<TransactionResponse> {
    const res = await api.put(`/financial/transactions/${id}`, data);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/financial/transactions/${id}`);
  },
};

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardMonthData {
  month: string;  // "YYYY-MM"
  label: string;  // "Abr"
  income: number;
  expense: number;
}

export const DashboardService = {
  async getDashboard(month: string): Promise<DashboardMonthData[]> {
    const res = await api.get(`/financial/dashboard?month=${month}`);
    return res.data.data;
  },
};
