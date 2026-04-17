import { useState } from "react";
import { useEmployeeGetAll, useEmployeePaginated, useDeleteEmployee } from "./useEmployee";
import type { EmployeeResponse } from "../services/Employee";

export type StatusFilter = "" | "ACTIVE" | "ON_LEAVE" | "TERMINATED";

export interface EmployeeRow {
  id: string;
  name: string;
  email: string | null;
  position: string;
  department: string | null;
  hireDate: string | null;
  salary: number | null;
  status: EmployeeResponse["status"];
  initials: string;
}

const LIMIT = 20;

function toRow(e: EmployeeResponse): EmployeeRow {
  const words = e.name.trim().split(" ");
  const initials =
    words.length >= 2
      ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      : e.name.slice(0, 2).toUpperCase();

  return {
    id: e.id,
    name: e.name,
    email: e.email,
    position: e.position,
    department: e.department,
    hireDate: e.hireDate
      ? new Date(e.hireDate).toLocaleDateString("pt-BR")
      : null,
    salary: e.salary,
    status: e.status,
    initials,
  };
}

export function useRhPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: allEmployees = [] } = useEmployeeGetAll();

  const { data: pageData, isLoading } = useEmployeePaginated(
    page,
    LIMIT,
    search,
    statusFilter
  );

  const rows: EmployeeRow[] = (pageData?.data ?? []).map(toRow);
  const totalPages = pageData?.pagination.totalPages ?? 1;

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total = allEmployees.length;

  const totalAtivos = allEmployees.filter(
    (e) => e.status === "ACTIVE"
  ).length;

  const totalLicenca = allEmployees.filter(
    (e) => e.status === "ON_LEAVE"
  ).length;

  const totalDesligados = allEmployees.filter(
    (e) => e.status === "TERMINATED" || e.status === "INACTIVE"
  ).length;

  const now = new Date();

  const novosEsteMes = allEmployees.filter((e) => {
    if (!e.hireDate) return false;
    const d = new Date(e.hireDate);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteMutation = useDeleteEmployee();

  const handleConfirmDelete = () => {
    if (!confirmDeleteId) return;

    deleteMutation.mutate(confirmDeleteId, {
      onSuccess: () => {
        setConfirmDeleteId(null);
      },
    });
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSetSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSetStatusFilter = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  // ── Return ─────────────────────────────────────────────────────────────────
  return {
    rows,
    isLoading,

    search,
    setSearch: handleSetSearch,

    statusFilter,
    setStatusFilter: handleSetStatusFilter,

    page,
    setPage,
    totalPages,

    total,
    totalAtivos,
    totalLicenca,
    totalDesligados,
    novosEsteMes,

    confirmDeleteId,
    requestDelete: (id: string) => setConfirmDeleteId(id),
    cancelDelete: () => setConfirmDeleteId(null),
    confirmDelete: handleConfirmDelete,

    isDeleting: deleteMutation.isPending,
  };
}