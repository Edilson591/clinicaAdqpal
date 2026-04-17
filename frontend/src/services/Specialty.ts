import api from "./api";
import type { ApiResponse, SpecialtyResponse } from "../types/api";

export const specialtyService = {
  getAll: async (): Promise<SpecialtyResponse[]> => {
    const res = await api.get<ApiResponse<SpecialtyResponse[]>>("/specialties");
    return res.data.data!;
  },

  getByDoctor: async (doctorId: string): Promise<SpecialtyResponse[]> => {
    const res = await api.get<ApiResponse<SpecialtyResponse[]>>(
      `/specialties/doctor/${doctorId}`,
    );

    return res.data.data!;
  },
};
