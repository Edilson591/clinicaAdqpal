import api from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  PatientResponse,
  CreatePatientInput,
  UpdatePatientInput,
} from "../types/api";

export const patientService = {
  create: async (data: CreatePatientInput): Promise<PatientResponse> => {
    try {
      const res = await api.post<ApiResponse<PatientResponse>>(
        "/patients",
        data,
      );
      return res.data.data!;
    } catch (error) {
      console.error("erro na requisição", error);
      throw error;
    }
  },

  getAll: async (): Promise<PatientResponse[]> => {
    const res = await api.get<ApiResponse<PatientResponse[]>>("/patients");
    return res.data.data!;
  },

  getAllByUser: async (userId: string): Promise<PatientResponse[]> => {
    const res = await api.get<ApiResponse<PatientResponse[]>>(`/patients?userId=${userId}`);
    return res.data.data!;
  },

  getAllPaginated: async (
    page: number,
    limit: number,
    search: string,
  ): Promise<PaginatedResponse<PatientResponse>> => {
    const res = await api.get<PaginatedResponse<PatientResponse>>(
      `/patients?page=${page}&limit=${limit}&search=${search}`,
    );
    return res.data;
  },

  getById: async (id: string): Promise<PatientResponse> => {
    const res = await api.get<ApiResponse<PatientResponse>>(`/patients/${id}`);
    return res.data.data!;
  },

  update: async (
    id: string,
    data: UpdatePatientInput,
  ): Promise<PatientResponse> => {
    const res = await api.put<ApiResponse<PatientResponse>>(
      `/patients/${id}`,
      data,
    );
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  countToday: async (): Promise<number> => {
    const res = await api.get<PaginatedResponse<unknown>>(
      "/patients?page=1&limit=1&createdToday=true",
    );
    return res.data.pagination?.total ?? 0;
  },
};
