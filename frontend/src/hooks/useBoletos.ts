import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BoletoService } from "../services/Boleto";
import type { BoletoFilters, CreateBoletoRequest } from "../types/boleto";

export const boletoKeys = {
  all: ["boletos"] as const,
  list: (filters: BoletoFilters) => ["boletos", "list", filters] as const,
};

export function useBoletos() {
  return useQuery({
    queryKey: boletoKeys.all,
    queryFn: () => BoletoService.listAll(),
    refetchInterval: (query) => {
      const items = query.state.data?.items ?? [];
      return items.some((item) =>
        ["PENDING", "PROCESSING", "REGISTERED"].includes(item.status),
      )
        ? 5_000
        : false;
    },
  });
}

export function useCreateBoleto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      idempotencyKey,
    }: {
      payload: CreateBoletoRequest;
      idempotencyKey: string;
    }) => BoletoService.create(payload, idempotencyKey),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: boletoKeys.all }),
  });
}
