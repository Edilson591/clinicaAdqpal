import api from "./api";
import type {
  ApiResponse,
  MedicalRecordResponse,
  CreateMedicalRecordInput,
  UpdateMedicalRecordInput,
} from "../types/api";

export const medicalRecordService = {
  create: async (data: CreateMedicalRecordInput): Promise<MedicalRecordResponse> => {
    const res = await api.post<ApiResponse<MedicalRecordResponse>>("/medical-records", data);
    return res.data.data!;
  },

  getAll: async (): Promise<MedicalRecordResponse[]> => {
    const res = await api.get<ApiResponse<MedicalRecordResponse[]>>("/medical-records");
    return res.data.data!;
  },

  getById: async (id: string): Promise<MedicalRecordResponse> => {
    const res = await api.get<ApiResponse<MedicalRecordResponse>>(`/medical-records/${id}`);
    return res.data.data!;
  },

  getByPatient: async (patientId: string): Promise<MedicalRecordResponse[]> => {
    const res = await api.get<ApiResponse<MedicalRecordResponse[]>>(`/medical-records/patient/${patientId}`);
    return res.data.data!;
  },

  update: async (id: string, data: UpdateMedicalRecordInput): Promise<MedicalRecordResponse> => {
    const res = await api.put<ApiResponse<MedicalRecordResponse>>(`/medical-records/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/medical-records/${id}`);
  },
};
