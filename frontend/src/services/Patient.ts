import api from "./api";
import type {
  ApiResponse,
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
};
