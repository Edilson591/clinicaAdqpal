import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicalRecordService } from "../services/MedicalRecord";
import type { CreateMedicalRecordInput, UpdateMedicalRecordInput } from "../types/api";

export const MEDICAL_RECORD_KEYS = {
  all: ["medical-records"] as const,
  paginated: (page: number) => ["medical-records", "page", page] as const,
  detail: (id: string) => ["medical-records", id] as const,
  byPatient: (patientId: string) => ["medical-records", "patient", patientId] as const,
};

export function useMedicalRecords() {
  return useQuery({
    queryKey: MEDICAL_RECORD_KEYS.all,
    queryFn: medicalRecordService.getAll,
  });
}

export function useMedicalRecordsPaginated(page: number) {
  return useQuery({
    queryKey: MEDICAL_RECORD_KEYS.paginated(page),
    queryFn: () => medicalRecordService.getAllPaginated(page),
  });
}

export function useMedicalRecord(id: string) {
  return useQuery({
    queryKey: MEDICAL_RECORD_KEYS.detail(id),
    queryFn: () => medicalRecordService.getById(id),
    enabled: !!id,
  });
}

export function useMedicalRecordsByPatient(patientId: string) {
  return useQuery({
    queryKey: MEDICAL_RECORD_KEYS.byPatient(patientId),
    queryFn: () => medicalRecordService.getByPatient(patientId),
    enabled: !!patientId,
  });
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMedicalRecordInput) => medicalRecordService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MEDICAL_RECORD_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEDICAL_RECORD_KEYS.byPatient(data.patientId) });
    },
  });
}

export function useUpdateMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicalRecordInput }) =>
      medicalRecordService.update(id, data),
    onSuccess: (updated, { id }) => {
      queryClient.invalidateQueries({ queryKey: MEDICAL_RECORD_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MEDICAL_RECORD_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: MEDICAL_RECORD_KEYS.byPatient(updated.patientId) });
    },
  });
}

export function useDeleteMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicalRecordService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICAL_RECORD_KEYS.all });
    },
  });
}
