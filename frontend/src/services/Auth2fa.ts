import api from "./api";
import type { ApiResponse, LoginResponse } from "../types/api";

export const auth2faService = {
  verify: async (data: { code: string }): Promise<LoginResponse> => {
    const res = await api.post<ApiResponse<LoginResponse>>(
      "users/verify-2fa",
      data,
    );
    return res.data.data!;
  },

  resend: async (): Promise<{ resendAvailableInSeconds: number }> => {
    const res = await api.post<ApiResponse<{ resendAvailableInSeconds: number }>>(
      "users/verify-2fa/resend",
    );
    return res.data.data ?? { resendAvailableInSeconds: 60 };
  },
};
