import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/User";
import { USER_ROLES } from "../types/roles";

export const USER_KEYS = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
  byRole: (roleId: number) => ["users", "role", roleId] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: USER_KEYS.all,
    queryFn: userService.getAll,
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
