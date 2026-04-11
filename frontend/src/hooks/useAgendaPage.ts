import { useState } from "react";
import { useAppointmentsPaginatedSearch } from "./useAppointments";
import { useDoctors } from "./useUsers";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../types/roles";

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function useAgendaPage(
  page: number,
  setPage: (p: number) => void,
  date: Date | null,
) {
  const [search, setSearch] = useState("");
  const [selectDoctor, setSelectDoctor] = useState("");
  const { user } = useAuth();

  // Quando há busca ativa, ignora data e userId → busca global
  const dateStr = search.trim()
    ? undefined
    : date
      ? toDateStr(date)
      : undefined;

  const userId =
    user?.roleId === USER_ROLES.DOCTOR
      ? user?.id
      : selectDoctor.trim()
        ? selectDoctor
        : undefined;

  const effectiveUserId = search.trim() ? undefined : userId;

  

  const { data, isLoading } = useAppointmentsPaginatedSearch(
    page,
    20,
    search,
    dateStr,
    effectiveUserId,
    "asc",
  );

  const { data: users } = useDoctors();

  const doctorOptions =
    users?.map((u) => ({ value: u.id, label: u.username })) ?? [];

  const handleSelectChange = (value: string) => {
    setSelectDoctor(value);
    setPage(1);
  };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return {
    appointments: data?.data ?? [],
    total: data?.pagination?.total ?? 0,
    totalPages: data?.pagination?.totalPages ?? 1,
    doctorOptions,
    isLoading,
    search,
    setSearch: handleSearchChange,
    setSelectDoctor: handleSelectChange,
    selectDoctor,
  };
}
