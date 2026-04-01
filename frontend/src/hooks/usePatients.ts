import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../services/Patient";
import type { CreatePatientInput, UpdatePatientInput } from "../types/api";

export const PATIENT_KEYS = {
  all: ["patients"] as const,
  detail: (id: string) => ["patients", id] as const,
};

export function usePatients() {
  return useQuery({
    queryKey: PATIENT_KEYS.all,
    queryFn: patientService.getAll,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: PATIENT_KEYS.detail(id),
    queryFn: () => patientService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatientInput) => patientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.all });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientInput }) =>
      patientService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.detail(id) });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.all });
    },
  });
}
