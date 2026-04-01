import api from "./api";
import type {
  ApiResponse,
  UserResponse,
  LoginResponse,
  RegisterUserInput,
  LoginUserInput,
  UpdateUserInput,
} from "../types/api";

export const userService = {
  register: async (data: RegisterUserInput): Promise<UserResponse> => {
    const res = await api.post<ApiResponse<UserResponse>>("/users/register", data);
    return res.data.data!;
  },

  login: async (data: LoginUserInput): Promise<LoginResponse> => {
    const res = await api.post<ApiResponse<LoginResponse>>("/users/login", data);
    console.log(res)
    return res.data.data!;
  },

  getAll: async (): Promise<UserResponse[]> => {
    const res = await api.get<ApiResponse<UserResponse[]>>("/users");
    return res.data.data!;
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
