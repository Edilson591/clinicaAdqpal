import { useQuery } from "@tanstack/react-query";
import { susProcedureService } from "../services/SusProcedure";

export const SUS_KEYS = {
  all: ["sus-procedures"] as const,

  byCodigo: (codigo: number) => [...SUS_KEYS.all, codigo] as const,
};

export function useSusProcedure() {
  return useQuery({
    queryKey: SUS_KEYS.all,
    queryFn: susProcedureService.getAll,
  });
}
export function useSusProcedureByCodigo(codigo: number) {
  return useQuery({
    queryKey: SUS_KEYS.byCodigo(codigo),
    queryFn: () => susProcedureService.findByCodigo(codigo),
    enabled: !!codigo,
  });
}
