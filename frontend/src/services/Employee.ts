import api from "./api";
import type { ApiResponse, PaginatedResponse } from "../types/api";


type Status = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";


export interface EmployeeResponse {
  id: string;
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  position: string;
  department: string | null;
  hireDate: string | null;
  salary: number | null;
  status: Status;
  dateOfBirth: string | null;
  gender: string | null;
  street: string | null;
  streetNumber: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  name: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  position: string;
  department?: string | null;
  hireDate?: string | null;
  salary?: number | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  street?: string | null;
  status?: Status;
  streetNumber?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  notes?: string | null;
}

export const employeeService = {
  create: async (data: CreateEmployeeInput): Promise<EmployeeResponse | null> => {
    try {
      const res = await api.post<ApiResponse<EmployeeResponse>>(
        "/employees",
        data,
      );
      console.log(res)
      return res.data.data!;
    } catch (error) {
      console.error(error);
      return null
    }
  },

  getAll: async (): Promise<EmployeeResponse[]> => {
    const res = await api.get<PaginatedResponse<EmployeeResponse>>("/employees?limit=9999");
    return res.data.data;
  },

  getAllPaginated: async (
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ): Promise<PaginatedResponse<EmployeeResponse>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    const res = await api.get<PaginatedResponse<EmployeeResponse>>(`/employees?${params}`);
    return res.data;
  },

  getById: async (id: string): Promise<EmployeeResponse> => {
    const res = await api.get<ApiResponse<EmployeeResponse>>(
      `/employees/${id}`,
    );
    return res.data.data!;
  },

  update: async (
    id: string,
    data: Partial<CreateEmployeeInput>,
  ): Promise<EmployeeResponse> => {
    const res = await api.put<ApiResponse<EmployeeResponse>>(
      `/employees/${id}`,
      data,
    );
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
