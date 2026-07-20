import { isAxiosError } from "axios";
import api from "./api";
import type {
  BoletoFilters,
  BoletoListResponse,
  CreateBoletoRequest,
  CreateBoletoResponse,
} from "../types/boleto";

export const BoletoService = {
  async list(filters: BoletoFilters = {}): Promise<BoletoListResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
    if (filters.search) params.set("search", filters.search);
    if (filters.status) params.set("status", filters.status);
    if (filters.dueDateFrom) params.set("dueDateFrom", filters.dueDateFrom);
    if (filters.dueDateTo) params.set("dueDateTo", filters.dueDateTo);

    const response = await api.get<BoletoListResponse>(`/boletos?${params}`);
    return response.data;
  },

  async listAll(): Promise<BoletoListResponse> {
    const firstPage = await this.list({ page: 1, pageSize: 50 });
    if (firstPage.pagination.totalPages <= 1) return firstPage;

    const remainingPages = await Promise.all(
      Array.from({ length: firstPage.pagination.totalPages - 1 }, (_, index) =>
        this.list({ page: index + 2, pageSize: 50 }),
      ),
    );
    const items = [firstPage, ...remainingPages].flatMap((page) => page.items);
    return {
      items,
      pagination: {
        page: 1,
        pageSize: items.length,
        totalItems: items.length,
        totalPages: items.length ? 1 : 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  },

  async create(
    payload: CreateBoletoRequest,
    idempotencyKey: string,
  ): Promise<CreateBoletoResponse> {
    const csrfResponse = await api.get<{ csrfToken: string }>("/users/csrf");
    const response = await api.post<CreateBoletoResponse>("/boletos", payload, {
      headers: {
        "X-CSRF-Token": csrfResponse.data.csrfToken,
        "X-Idempotency-Key": idempotencyKey,
      },
    });
    return response.data;
  },
};

export function boletoErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) return "Não foi possível concluir a emissão. Tente novamente.";

  const data = error.response?.data as
    | { message?: string; error?: { message?: string } }
    | undefined;
  return (
    data?.error?.message ??
    data?.message ??
    (error.code === "ECONNABORTED"
      ? "A emissão está demorando mais que o esperado. Consulte a lista antes de tentar novamente."
      : "Não foi possível concluir a emissão. Verifique os dados e tente novamente.")
  );
}
