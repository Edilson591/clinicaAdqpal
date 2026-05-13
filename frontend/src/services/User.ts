import api from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  UserResponse,
  LoginResponse,
  RegisterUserInput,
  LoginUserInput,
  UpdateUserInput,
} from "../types/api";
import type { AxiosError } from "axios";

export const userService = {
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const res = await api.post<ApiResponse>("/password/forgot", { email });
    return res.data;
  },
  resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    const res = await api.post<ApiResponse>("/password/reset", { token, password });
    return res.data;
  },
  register: async (data: RegisterUserInput): Promise<UserResponse> => {
    const res = await api.post<ApiResponse<UserResponse>>(
      "/users/register",
      data,
    );
    return res.data.data!;
  },

  login: async (data: LoginUserInput): Promise<LoginResponse> => {
    const res = await api.post<ApiResponse<LoginResponse>>(
      "/users/login",
      data,
    );
    return res.data.data!;
  },

  getAll: async (): Promise<UserResponse[]> => {
    const res =
      await api.get<PaginatedResponse<UserResponse>>("/users?limit=9999");
    return res.data.data;
  },

  getAllPaginated: async (
    page: number,
    limit: number,
    search?: string,
    roleId?: number,
  ): Promise<PaginatedResponse<UserResponse>> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set("search", search);
      if (roleId !== undefined) params.set("roleId", String(roleId));
      const res = await api.get<PaginatedResponse<UserResponse>>(
        `/users?${params}`,
      );
      return res.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Erro ao buscar dashboard",
      );
    }
  },

  getById: async (id: string): Promise<UserResponse> => {
    const res = await api.get<ApiResponse<UserResponse>>(`/users/${id}`);
    return res.data.data!;
  },

  update: async (id: string, data: UpdateUserInput): Promise<UserResponse> => {
    const res = await api.put<ApiResponse<UserResponse>>(`/users/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
