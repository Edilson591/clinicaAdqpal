import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUsers, useUsersPaginated, USER_KEYS } from "./useUsers";
import { userService } from "../services/User";
import { ROLE_LABELS } from "../types/roles";
import type { SearchableOption } from "../components/ui/SearchableSelect";
import type { UserResponse } from "../types/api";

export interface UserRow {
  id: string;
  username: string;
  email: string;
  roleLabel: string;
  roleId: number;
  memberSince: string;
}

function toUserRow(u: UserResponse): UserRow {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    roleId: u.roleId,
    roleLabel: ROLE_LABELS[u.roleId as keyof typeof ROLE_LABELS] ?? "Desconhecido",
    memberSince: new Date(u.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
}

// Opções de perfil derivadas dos roles presentes na base
export const ROLE_OPTIONS: SearchableOption[] = [
  { value: "", label: "Todos os perfis" },
  ...Object.entries(ROLE_LABELS).map(([id, label]) => ({
    value: id,
    label,
  })),
];

const LIMIT = 20;

export function useUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Stats query — fetches all users (no filters) for accurate counts
  const { data: allUsers = [] } = useUsers();

  // Table query — server-side paginated + filtered
  const { data: pageData, isLoading,error } = useUsersPaginated(page, LIMIT, search, roleFilter);

  const users: UserRow[] = (pageData?.data ?? []).map(toUserRow);
  const totalPages = pageData?.pagination.totalPages ?? 1;

  // ── Stats (sempre sobre todos os usuários, ignoram filtros) ───────────────
  const total = allUsers.length;
  const totalAdmins = allUsers.filter((u) => u.roleId === 1).length;
  const totalDoctors = allUsers.filter((u) => u.roleId === 3).length;
  const totalReceptionists = allUsers.filter((u) => u.roleId === 5).length;

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["users", "paginated"] });
      setConfirmDeleteId(null);
    },
  });

  const requestDelete = (id: string) => setConfirmDeleteId(id);
  const cancelDelete = () => setConfirmDeleteId(null);
  const confirmDelete = () => {
    if (confirmDeleteId) deleteMutation.mutate(confirmDeleteId);
  };

  const handleSetSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSetRoleFilter = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  return {
    users,
    isLoading,
    search,
    setSearch: handleSetSearch,
    roleFilter,
    setRoleFilter: handleSetRoleFilter,
    page,
    setPage,
    error,
    totalPages,
    total,
    totalAdmins,
    totalDoctors,
    totalReceptionists,
    confirmDeleteId,
    requestDelete,
    cancelDelete,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
  };
}
