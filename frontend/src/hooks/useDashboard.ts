import { useMemo } from "react";
import { useAppointments } from "./useAppointments";
import { usePatients } from "./usePatients";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../types/roles";
import type { AppointmentResponse } from "../types/api";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AgendaStatus = "Confirmada" | "Concluido" | "Cancelado";

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
};

// const TOLERANCE_MS = 30 * 60 * 1000; // 30 minutos

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/** Retorna true se a consulta passou do horário + 30 min de tolerância */
// function isExpired(dateStr: string): boolean {
//   return Date.now() > new Date(dateStr).getTime() + TOLERANCE_MS;
// }

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboard() {
  const { user } = useAuth();
  const { data: appointments = [], isLoading: loadingAppts } = useAppointments();
  const { data: patients = [], isLoading: loadingPatients } = usePatients();


  const agendaDoDia = useMemo<DashboardAppointment[]>(() => {
    if (!user) return [];

    let filtered: AppointmentResponse[];

    if (user.roleId === USER_ROLES.ADMIN || user.roleId === USER_ROLES.IT_SUPPORT) {
      // Admin e Suporte: todas as consultas de hoje
      filtered = appointments.filter((a) => isToday(a.scheduledAt));
    } else if (user.roleId === USER_ROLES.DOCTOR) {
      // Médico: só as consultas dele hoje
      filtered = appointments.filter(
        (a) => isToday(a.scheduledAt) && a.userId === user.id,
      );
    } else {
      // Demais perfis: sem agenda
      return [];
    }

    return filtered
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      )
      .map((a) => {
        const patient = patients.find((p) => p.id === a.patientId);
        const horario = new Date(a.scheduledAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        });
        // const expired = a.status === "SCHEDULED" ;
        return {
          id: a.id,
          horario,
          paciente: patient?.name ?? "—",
          status: statusMap[a.status],
          patientId: a.patientId,
        };
      });
  }, [appointments, patients, user]);

    console.log(agendaDoDia)
  // Próximo atendimento: primeiro SCHEDULED da agenda de hoje
  const proximoAtendimento = useMemo(
    () => agendaDoDia.find((a) => a.status === "Confirmada") ?? null,
    [agendaDoDia],
  );
  console.log(agendaDoDia)

  return {
    consultasHoje: agendaDoDia.length,
    agendaDoDia,
    proximoAtendimento,
    isLoading: loadingAppts || loadingPatients,
  };
}
