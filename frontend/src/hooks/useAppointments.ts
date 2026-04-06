import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../services/Appointment";
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "../types/api";

export const APPOINTMENT_KEYS = {
  all: ["appointments"] as const,
  detail: (id: string) => ["appointments", id] as const,
  byPatient: (patientId: string) =>
    ["appointments", "patient", patientId] as const,
  byDateAndTime: (date: string, timeStart: string) =>
    ["appointments", "date-time", date, timeStart] as const,
};

export function useAppointments() {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.all,
    queryFn: appointmentService.getAll,
  });
}
export function useAppointmentsToday() {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.all,
    queryFn: appointmentService.getAll,
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

export function useAppointmentsByDateAndTime(date?: string, timeStart?: string) {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.byDateAndTime(date ?? "", timeStart ?? ""),
    queryFn: () => appointmentService.getByDateAndTime(date!, timeStart!),
    enabled: !!date && !!timeStart,
  });
}
