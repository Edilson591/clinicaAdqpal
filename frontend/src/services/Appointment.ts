import api from "./api";
import type {
  ApiResponse,
  AppointmentResponse,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "../types/api";

export const appointmentService = {
  create: async (data: CreateAppointmentInput): Promise<AppointmentResponse> => {
    const res = await api.post<ApiResponse<AppointmentResponse>>("/appointments", data);
    return res.data.data!;
  },

  getAll: async (): Promise<AppointmentResponse[]> => {
    const res = await api.get<ApiResponse<AppointmentResponse[]>>("/appointments");
    return res.data.data!;
  },

  getById: async (id: string): Promise<AppointmentResponse> => {
    const res = await api.get<ApiResponse<AppointmentResponse>>(`/appointments/${id}`);
    return res.data.data!;
  },

  getByPatient: async (patientId: string): Promise<AppointmentResponse[]> => {
    const res = await api.get<ApiResponse<AppointmentResponse[]>>(`/appointments/patient/${patientId}`);
    return res.data.data!;
  },

  update: async (id: string, data: UpdateAppointmentInput): Promise<AppointmentResponse> => {
    const res = await api.put<ApiResponse<AppointmentResponse>>(`/appointments/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  getByDateAndTime:async (date: string, timeStart: string): Promise<AppointmentResponse[]>=> {
    const res = await api.get<ApiResponse<AppointmentResponse[]>>(`/appointments?date=${date}&timeStart=${timeStart}`);
    return res.data.data!;
  }
};
