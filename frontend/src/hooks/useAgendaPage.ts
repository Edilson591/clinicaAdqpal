import { useState } from "react";
import { useAppointmentsPaginatedSearch } from "./useAppointments";

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function useAgendaPage(
  page: number,
  setPage: (p: number) => void,
  date: Date | null,
  userId?: string,
) {
  const [search, setSearch] = useState("");

  // Quando há busca ativa, ignora data e userId → busca global
  const dateStr = search.trim() ? undefined : (date ? toDateStr(date) : undefined);


  const effectiveUserId = search.trim() ? undefined : userId;

  const { data, isLoading } = useAppointmentsPaginatedSearch(
    page,
    20,
    search,
    dateStr,
    effectiveUserId,
    "asc",
  );

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return {
    appointments: data?.data ?? [],
    total: data?.pagination?.total ?? 0,
    totalPages: data?.pagination?.totalPages ?? 1,
    isLoading,
    search,
    setSearch: handleSearchChange,
  };
}
