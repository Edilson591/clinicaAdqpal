import { useQuery } from "@tanstack/react-query";
import { specialtyService } from "../services/Specialty";

export const SPECIALTY_KEYS = {
  all: ["specialties"] as const,
  byDoctor: (doctorId: string) => ["specialties", "doctor", doctorId] as const,
};

export function useSpecialties() {
  return useQuery({
    queryKey: SPECIALTY_KEYS.all,
    queryFn: specialtyService.getAll,
  });
}

export function useSpecialtiesByDoctor(doctorId: string) {
  return useQuery({
    queryKey: SPECIALTY_KEYS.byDoctor(doctorId),
    queryFn: () => specialtyService.getByDoctor(doctorId),
    enabled: !!doctorId,
  });
}
