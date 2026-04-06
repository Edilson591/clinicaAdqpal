import api from "./api";
import type {
  ApiResponse,
  PatientHistoryResponse,
  CreatePatientHistoryInput,
} from "../types/api";

export const patientHistoryService = {
  list: async (patientId: string): Promise<PatientHistoryResponse[]> => {
    const res = await api.get<ApiResponse<PatientHistoryResponse[]>>(
      `/patients/${patientId}/history`,
    );
    return res.data.data!;
  },

  create: async (
    patientId: string,
    data: CreatePatientHistoryInput,
  ): Promise<PatientHistoryResponse> => {
    const res = await api.post<ApiResponse<PatientHistoryResponse>>(
      `/patients/${patientId}/history`,
      data,
    );
    return res.data.data!;
  },
};
