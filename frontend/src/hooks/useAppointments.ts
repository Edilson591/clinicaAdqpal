import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../services/Appointment";
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "../types/api";

type Order = "asc" | "desc"

export const APPOINTMENT_KEYS = {
  all: ["appointments"] as const,
  paginated: (page: number) => ["appointments", "page", page] as const,
  paginatedSearch: (
    page: number,
    limit: number,
    search?: string,
    date?: string,
    userId?: string,
    order?: Order,
  ) => ["appointments", "search", page, limit, search, date, userId, order] as const,
  detail: (id: string) => ["appointments", id] as const,
  byPatient: (patientId: string) =>
    ["appointments", "patient", patientId] as const,
  byDateAndTime: (date: string, timeStart: string, endTime: string) =>
    ["appointments", "date-time", date, timeStart, endTime] as const,
  allToday: () => ["appointments", "today"] as const,
  byUser: (userId: string) => ["appointments", "userId", userId] as const,
};

export function useAppointments() {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.all,
    queryFn: appointmentService.getAll,
  });
}
export function useAppointmentsByDoctor(userId: string) {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.byUser(userId),
    queryFn: () => appointmentService.getAllByUser(userId),
    enabled: !!userId,
  });
}

export function useAppointmentsPaginated(page: number) {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.paginated(page),
    queryFn: () => appointmentService.getAllPaginated(page),
  });
}

export function useAppointmentsPaginatedSearch(
  page: number,
  limit = 20,
  search = "",
  date?: string,
  userId?: string,
  order: "asc" | "desc" = "asc",
) {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.paginatedSearch(
      page,
      limit,
      search,
      date,
      userId,
      order,
    ),
    queryFn: () =>
      appointmentService.getAllPaginatedSearch(
        page,
        limit,
        search,
        date,
        userId,
        order,
      ),
  });
}

export function useAppointmentsToday() {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.allToday(),
    queryFn: () => appointmentService.getAllToday(),
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.detail(id),
    queryFn: () => appointmentService.getById(id),
    enabled: !!id,
  });
}

export function useAppointmentsByPatient(patientId: string) {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.byPatient(patientId),
    queryFn: () => appointmentService.getByPatient(patientId),
    enabled: !!patientId,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentInput) =>
      appointmentService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: APPOINTMENT_KEYS.byPatient(data.patientId),
      });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentInput }) =>
      appointmentService.update(id, data),
    onSuccess: (updated, { id }) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.detail(id) });
      queryClient.invalidateQueries({
        queryKey: APPOINTMENT_KEYS.byPatient(updated.patientId),
      });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.all });
    },
  });
}

export function useAppointmentsByDateAndTime(
  date?: string,
  timeStart?: string,
  endTime: string = "23:59",
) {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.byDateAndTime(
      date ?? "",
      timeStart ?? "",
      endTime ?? "",
    ),
    queryFn: () =>
      appointmentService.getByDateAndTime(date!, timeStart!, endTime),
    enabled: !!date && !!timeStart && !!endTime,
  });
}
