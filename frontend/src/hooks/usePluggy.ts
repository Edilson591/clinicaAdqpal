import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PluggyService } from "../services/Pluggy";
import { financialKeys } from "./useFinancial";

export const pluggyKeys = {
  items: ["pluggy", "items"] as const,
};

export function usePluggyItems() {
  return useQuery({
    queryKey: pluggyKeys.items,
    queryFn: PluggyService.listItems,
  });
}

export function useSyncPluggyItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => PluggyService.syncItem(itemId),
    onSuccess: () => {
      // Invalida transações e contas para refletir os dados importados
      qc.invalidateQueries({ queryKey: pluggyKeys.items });
      qc.invalidateQueries({ queryKey: financialKeys.transactions.all });
      qc.invalidateQueries({ queryKey: financialKeys.accounts.all });
    },
  });
}

export function useDeletePluggyItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => PluggyService.deleteItem(itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pluggyKeys.items });
      qc.invalidateQueries({ queryKey: financialKeys.accounts.all });
    },
  });
}
