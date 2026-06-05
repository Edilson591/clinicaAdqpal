import api from "./api";
import type {
  ApiResponse,
  SusProcedureResponse,
} from "../types/api";

export const susProcedureService = {
  findByCodigo: async (codigo: number): Promise<SusProcedureResponse> => {
    const res = await api.get<ApiResponse<SusProcedureResponse>>(
      `/sus-procedures/${codigo}`,
    );

    return res.data.data!;
  },
  getAll: async (): Promise<SusProcedureResponse[]> => {
    const res =
      await api.get<ApiResponse<SusProcedureResponse[]>>("/sus-procedures");

    return res.data.data ?? [];
  },
};
