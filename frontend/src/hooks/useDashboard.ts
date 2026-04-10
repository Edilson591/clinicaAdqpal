import { useState, useMemo } from "react";
import {
  useAppointmentsPaginatedSearch,
} from "./useAppointments";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../types/roles";
import { formatTime } from "../utils/formatTime";
import type { AppointmentResponse } from "../types/api";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AgendaStatus =
  | "Confirmada"
  | "Concluido"
  | "Cancelado"
  | "Em Andamento";

export interface DashboardAppointment {
  id: string;
  horario: string;
  paciente: string;
  status: AgendaStatus;
  patientId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusMap: Record<AppointmentResponse["status"], AgendaStatus> = {
  SCHEDULED: "Confirmada",
  COMPLETED: "Concluido",
  CANCELLED: "Cancelado",
  CANCELED: "Cancelado",
  NO_SHOW: "Cancelado",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "Em Andamento",
};

// const TOLERANCE_MS = 30 * 60 * 1000; // 30 minutos

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboard(
  page: number,
  setPage: (p: number) => void,
  date: string | null,
) {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const userDoctor = user?.roleId === USER_ROLES.DOCTOR;

  const { data, isLoading: loadingAppts } = useAppointmentsPaginatedSearch(
    page,
    20,
    search,
    date ?? "",
    userDoctor ? user?.id : "",
    "asc",
  );

  const appointmentsToday = data?.data;

  console.log(data)

  const agendaDoDia = useMemo<DashboardAppointment[]>(() => {
    if (!user || !appointmentsToday) return [];

    if (
      user.roleId !== USER_ROLES.ADMIN &&
      user.roleId !== USER_ROLES.IT_SUPPORT &&
      user.roleId !== USER_ROLES.DOCTOR
    ) {
      return [];
    }

    // Backend já filtra por data/userId e ordena asc — apenas mapeia
    return appointmentsToday.map((a) => ({
      id: a.id,
      horario: formatTime(a.scheduledAt),
      paciente: a.pacient?.name ?? "—",
      status: statusMap[a.status],
      patientId: a.patientId,
    }));
  }, [appointmentsToday, user]);

  // console.log(agendaDoDia);
  // Próximo atendimento: primeiro SCHEDULED da agenda de hoje
  const proximoAtendimento = useMemo(
    () => agendaDoDia.find((a) => a.status === "Confirmada") ?? null,
    [agendaDoDia],
  );
  // console.log(agendaDoDia);

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return {
    agendaDoDia,
    proximoAtendimento,
    total: data?.pagination?.total ?? 0,
    totalPages: data?.pagination?.totalPages ?? 1,
    setSearch: handleSearchChange,
    search,
    isLoading: loadingAppts,
  };
}
