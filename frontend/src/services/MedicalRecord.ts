import api from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  MedicalRecordResponse,
  CreateMedicalRecordInput,
  UpdateMedicalRecordInput,
} from "../types/api";

export const medicalRecordService = {
  create: async (
    data: CreateMedicalRecordInput,
  ): Promise<MedicalRecordResponse> => {
    const res = await api.post<ApiResponse<MedicalRecordResponse>>(
      "/medical-records",
      data,
    );
    return res.data.data!;
  },

  getAll: async (): Promise<MedicalRecordResponse[]> => {
    const res =
      await api.get<ApiResponse<MedicalRecordResponse[]>>("/medical-records");
    return res.data.data!;
  },

  getAllPaginated: async (
    page: number,
    limit: number,
    search: string,
  ): Promise<PaginatedResponse<MedicalRecordResponse>> => {
    const res = await api.get<PaginatedResponse<MedicalRecordResponse>>(
      `/medical-records?page=${page}&limit=${limit}&search=${search}`,
    );
    return res.data;
  },

  getById: async (id: string): Promise<MedicalRecordResponse> => {
    const res = await api.get<ApiResponse<MedicalRecordResponse>>(
      `/medical-records/${id}`,
    );
    return res.data.data!;
  },

  getByPatient: async (
    patientId: string[],
  ): Promise<MedicalRecordResponse[]> => {
    const res = await api.get<ApiResponse<MedicalRecordResponse[]>>(
      `/medical-records/${patientId}`,
    );
    return res.data.data!;
  },

  update: async (
    id: string,
    data: UpdateMedicalRecordInput,
  ): Promise<MedicalRecordResponse> => {
    const res = await api.put<ApiResponse<MedicalRecordResponse>>(
      `/medical-records/${id}`,
      data,
    );
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/medical-records/${id}`);
  },
};
