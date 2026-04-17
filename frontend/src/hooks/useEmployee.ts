import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StatusFilter } from "./useRhPage";
import { employeeService } from "../services/Employee";

export const employeeKeys = {
  stats: ["employees", "stats"] as const,
  paginated: (
    page: number,
    limit: number,
    search: string,
    status: StatusFilter,
  ) => ["employees", "paginated", page, limit, search, status] as const,
  detail: (id: string) => ["employees", id] as const,
};

export function useEmployeeGetAll() {
  return useQuery({
    queryKey: employeeKeys.stats,
    queryFn: employeeService.getAll,
  });
}

export function useEmployeePaginated(
  page: number,
  limit: number,
  search: string,
  status: StatusFilter,
) {
  return useQuery({
    queryKey: employeeKeys.paginated(page, limit, search, status),
    queryFn: () =>
      employeeService.getAllPaginated(
        page,
        limit,
        search || undefined,
        status || undefined,
      ),
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: employeeKeys.stats });
      qc.invalidateQueries({ queryKey: ["employees", "paginated"] });
      qc.invalidateQueries({ queryKey: employeeKeys.detail(id) });
    },
  });
}
