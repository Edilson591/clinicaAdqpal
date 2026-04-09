import api from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  AppointmentResponse,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "../types/api";

export const appointmentService = {
  create: async (
    data: CreateAppointmentInput,
  ): Promise<AppointmentResponse> => {
    const res = await api.post<ApiResponse<AppointmentResponse>>(
      "/appointments",
      data,
    );
    return res.data.data!;
  },

  getAll: async (): Promise<AppointmentResponse[]> => {
    const res =
      await api.get<ApiResponse<AppointmentResponse[]>>("/appointments");
    return res.data.data!;
  },
  getAllByUser: async (userId: string): Promise<AppointmentResponse[]> => {
    const res = await api.get<ApiResponse<AppointmentResponse[]>>(
      `/appointments?userId=${userId}`,
    );
    return res.data.data!;
  },

  getAllToday: async (): Promise<AppointmentResponse[]> => {
    const now = new Date();

    const dateToday = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const res = await api.get<ApiResponse<AppointmentResponse[]>>(
      `/appointments?date=${dateToday}`,
    );
    return res.data.data!;
  },

  getById: async (id: string): Promise<AppointmentResponse> => {
    const res = await api.get<ApiResponse<AppointmentResponse>>(
      `/appointments/${id}`,
    );
    return res.data.data!;
  },

  getByPatient: async (patientId: string): Promise<AppointmentResponse[]> => {
    const res = await api.get<ApiResponse<AppointmentResponse[]>>(
      `/appointments/patient/${patientId}`,
    );
    return res.data.data!;
  },

  getAllPaginatedSearch: async (
    page: number,
    limit: number,
    search: string,
    date?: string,
    userId?: string,
    order: "asc" | "desc" = "asc",
  ): Promise<PaginatedResponse<AppointmentResponse>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), order });
    if (search) params.set("search", search);
    if (date) params.set("date", date);
    if (userId) params.set("userId", userId);
    const res = await api.get<PaginatedResponse<AppointmentResponse>>(
      `/appointments?${params}`,
    );
    return res.data;
  },

  update: async (
    id: string,
    data: UpdateAppointmentInput,
  ): Promise<AppointmentResponse> => {
    const res = await api.put<ApiResponse<AppointmentResponse>>(
      `/appointments/${id}`,
      data,
    );
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  getByDateAndTime: async (
    date: string,
    timeStart: string,
    endTime: string,
  ): Promise<AppointmentResponse[]> => {
    const res = await api.get<ApiResponse<AppointmentResponse[]>>(
      `/appointments?date=${date}&timeStart=${timeStart}&timeEnd=${endTime}`,
    );
    return res.data.data!;
  },

  getAllPaginated: async (
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<AppointmentResponse>> => {
    const res = await api.get<PaginatedResponse<AppointmentResponse>>(
      `/appointments?page=${page}&limit=${limit}`,
    );
    return res.data;
  },
};
