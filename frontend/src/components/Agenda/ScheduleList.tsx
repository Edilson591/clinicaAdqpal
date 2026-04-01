import { useState } from "react";
import { Eye } from "lucide-react";
import { usePatients } from "../../hooks/usePatients";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../types/roles";
import type {
  AppointmentResponse,
  AppointmentStatus,
  PatientResponse,
  UserResponse,
} from "../../types/api";
import { AppointmentDetailModal } from "./AppointmentDetailModal";
import { useCalendar } from "../../hooks/useCalendar";
import { FieldSkeleton } from "../ui/FieldSkeleton";

const STATUS_CONFIG: Record<
  AppointmentStatus,
  {
    label: string;
    bgLight: string;
    textLight: string;
    bgDark: string;
    textDark: string;
  }
> = {
  SCHEDULED: {
    label: "Agendada",
    bgLight: "bg-[#DBEAFE]",
    textLight: "text-[#1D4ED8]",
    bgDark: "dark:bg-[#1E3A5F]",
    textDark: "dark:text-[#60A5FA]",
  },
  COMPLETED: {
    label: "Concluída",
    bgLight: "bg-[#DCFCE7]",
    textLight: "text-[#166534]",
    bgDark: "dark:bg-[#1E3A2F]",
    textDark: "dark:text-[#4ADE80]",
  },
  CANCELLED: {
    label: "Cancelada",
    bgLight: "bg-[#FEE2E2]",
    textLight: "text-[#991B1B]",
    bgDark: "dark:bg-[#3F1E1E]",
    textDark: "dark:text-[#FCA5A5]",
  },
};

// =============================================================================
// SCHEDULE LIST
// =============================================================================

type PropsScheduleList = {
  date: Date;
  appointments: AppointmentResponse[];
  isLoading: boolean;
};

export function ScheduleList({ date, appointments, isLoading}: PropsScheduleList) {
  const { user } = useAuth();
 
  const { data: patients = [] } = usePatients();
  const { data: users = [] } = useUsers();
  const [selected, setSelected] = useState<AppointmentResponse | null>(null);
  const { isSameDay } = useCalendar();

  const roleId = user?.roleId ?? 0;

  // Filtra consultas de hoje
  const today = date.toDateString();
  const todayAppointments = appointments.filter(
    (a) => new Date(a.scheduledAt).toDateString() === today,
  );

  // Lookup helpers
  const getPatient = (patientId: string): PatientResponse | undefined =>
    patients.find((p) => p.id === patientId);
  const getDoctor = (userId: string): UserResponse | undefined =>
    users.find((u) => u.id === userId);

  // Admin e IT_SUPPORT veem qualquer médico; Doctor só vê o próprio
  const canSeeDoctor = (appt: AppointmentResponse): boolean => {
    if (roleId === USER_ROLES.ADMIN || roleId === USER_ROLES.IT_SUPPORT)
      return true;
    if (roleId === USER_ROLES.DOCTOR) return appt.userId === user?.id;
    return false;
  };

  // Coluna de médico aparece apenas para roles que podem ver ao menos alguns
  const showDoctorColumn =
    roleId === USER_ROLES.ADMIN ||
    roleId === USER_ROLES.IT_SUPPORT ||
    roleId === USER_ROLES.DOCTOR;

  const isToday = isSameDay(date, new Date());

  return (
    <>
      {/* pen: ysozS · bg #FFFFFF light · #1E293B dark · border #E2E8F0 / #334155 · cornerRadius 12 */}
      <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl overflow-hidden transition-colors duration-200">
        {/* Título — pen: uuauv */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] dark:border-[#334155]">
          <h2 className="text-xl font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
            {isToday
              ? "Consultas de hoje"
              : `Consultas de ${date.toLocaleDateString("pt-BR")}`}
          </h2>
        </div>

        {/* Rows — pen: O5G23 */}
        <div className="flex flex-col gap-3 p-6">
          {isLoading && (
            // <p className="text-sm text-[#64748B] dark:text-[#94A3B8] text-center py-4">
            //   Carregando...
            // </p>
            <FieldSkeleton/>
          )}

          {!isLoading && todayAppointments.length === 0 && (
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] text-center py-4">
              Nenhuma consulta para hoje.
            </p>
          )}

          {todayAppointments.map((appt) => {
            const s = STATUS_CONFIG[appt.status];
            const patient = getPatient(appt.patientId);
            const doctor = getDoctor(appt.userId);
            const showDoctor = canSeeDoctor(appt);
            const timeStr = new Date(appt.scheduledAt).toLocaleTimeString(
              "pt-BR",
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <div
                key={appt.id}
                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-[#F8FAFC] dark:bg-[#263548] transition-colors"
              >
                {/* Horário */}
                <span className="text-base font-semibold text-[#1E293B] dark:text-[#F1F5F9] w-14 shrink-0">
                  {timeStr}
                </span>

                {/* Paciente + médico (se permitido) */}
                <div className="flex-1 min-w-0">
                  <p className="text-base text-[#1E293B] dark:text-[#F1F5F9] truncate">
                    {patient?.name ?? "—"}
                  </p>
                  {showDoctorColumn && (
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">
                      {showDoctor ? (doctor?.username ?? "—") : ""}
                    </p>
                  )}
                </div>

                {/* Status badge */}
                <span
                  className={`shrink-0 h-7 px-4 flex items-center rounded-full text-xs font-medium ${s.bgLight} ${s.textLight} ${s.bgDark} ${s.textDark}`}
                >
                  {s.label}
                </span>

                {/* Botão Ver */}
                <button
                  onClick={() => setSelected(appt)}
                  className="shrink-0 h-8 w-8 flex items-center cursor-pointer justify-center rounded-lg border border-[#38A169] text-[#38A169] hover:bg-[#DCFCE7] dark:hover:bg-[#1E3A2F] transition-colors"
                  title="Ver consulta"
                >
                  <Eye size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <AppointmentDetailModal
          appointment={selected}
          patient={getPatient(selected.patientId)}
          doctor={getDoctor(selected.userId)}
          showDoctor={canSeeDoctor(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
