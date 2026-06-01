import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/User";
import { USER_ROLES } from "../types/roles";

export const USER_KEYS = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
  byRole: (roleId: number) => ["users", "role", roleId] as const,
  paginated: (page: number, limit: number, search: string, roleId: string) =>
    ["users", "paginated", page, limit, search, roleId] as const,
  checkAdmin: ["users", "check-admin"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: USER_KEYS.all,
    queryFn: userService.getAll,
  });
}

export function useUsersPaginated(
  page: number,
  limit: number,
  search: string,
  roleId: string,
) {
  return useQuery({
    queryKey: USER_KEYS.paginated(page, limit, search, roleId),
    queryFn: () =>
      userService.getAllPaginated(
        page,
        limit,
        search || undefined,
        roleId ? Number(roleId) : undefined,
      ),
  });
}

/**
 * Retorna apenas usuários com role DOCTOR (roleId = 3).
 * Usado nos selects de "médico responsável" em consultas.
 */
export function useDoctors() {
  const query = useQuery({
    queryKey: USER_KEYS.byRole(USER_ROLES.DOCTOR),
    queryFn: userService.getAll,
    select: (users) => users.filter((u) => u.roleId === USER_ROLES.DOCTOR),
  });

  return query;
}

export function useCheckAdmin() {
  return useQuery({
    queryKey: USER_KEYS.checkAdmin,
    queryFn: () => userService.checkAdmin(),
  });
}
