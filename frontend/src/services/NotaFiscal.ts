import api from "./api";
import type { NotaFiscalResponse, NotaFiscalStatus, PaginatedResponse, CreateNotaFiscalInput } from "../types/api";

export interface NotaFiscalFilters {
  search?: string;
  status?: NotaFiscalStatus;
  patientId?: string;
  dateStart?: string;
  dateEnd?: string;
  page?: number;
  limit?: number;
}

export const NotaFiscalService = {
  async getAll(filters?: NotaFiscalFilters): Promise<PaginatedResponse<NotaFiscalResponse>> {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.patientId) params.set("patientId", filters.patientId);
    if (filters?.dateStart) params.set("dateStart", filters.dateStart);
    if (filters?.dateEnd) params.set("dateEnd", filters.dateEnd);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));
    const res = await api.get(`/fiscal/notas-fiscais?${params}`);
    return res.data;
  },

  async getById(id: string): Promise<NotaFiscalResponse> {
    const res = await api.get(`/fiscal/notas-fiscais/${id}`);
    return res.data.data;
  },

  async create(data: CreateNotaFiscalInput): Promise<NotaFiscalResponse> {
    const res = await api.post("/fiscal/notas-fiscais", data);
    return res.data.data;
  },

  async emitir(id: string): Promise<NotaFiscalResponse> {
    const res = await api.post(`/fiscal/notas-fiscais/${id}/emitir`);
    return res.data.data;
  },

  async cancelar(id: string): Promise<NotaFiscalResponse> {
    const res = await api.post(`/fiscal/notas-fiscais/${id}/cancelar`);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/fiscal/notas-fiscais/${id}`);
  },
};
