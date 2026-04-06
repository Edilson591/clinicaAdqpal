import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientHistoryService } from "../services/PatientHistory";
import type { CreatePatientHistoryInput } from "../types/api";

export const HISTORY_KEYS = {
  all: (patientId: string) => ["patientHistory", patientId] as const,
};

export function usePatientHistory(patientId: string) {
  return useQuery({
    queryKey: HISTORY_KEYS.all(patientId),
    queryFn: () => patientHistoryService.list(patientId),
    enabled: !!patientId,
  });
}

export function useCreatePatientHistory(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatientHistoryInput) =>
      patientHistoryService.create(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HISTORY_KEYS.all(patientId) });
    },
  });
}
