import { useNavigate } from "react-router-dom";
import type {
  DashboardAppointment,
  AgendaStatus,
} from "../../hooks/useDashboard";
// Status badge — Pendente muda no dark (pen: #334155 bg, #94A3B8 text)
const statusStyles: Record<AgendaStatus, string> = {
  Agendada:
    "bg-[#DBEAFE] text-[#1D4ED8] dark:bg-[#1E3A5F] dark:text-[#60A5FA]",

  Confirmada:
    "bg-[#DCFCE7] text-[#166534] dark:bg-[#1E3A2F] dark:text-[#4ADE80]",

  "Em Andamento":
    "bg-[#FEF3C7] text-[#92400E] dark:bg-[#3F2A1E] dark:text-[#FCD34D]",

  Concluído:
    "bg-[#EDE9FE] text-[#5B21B6] dark:bg-[#2E1065] dark:text-[#C4B5FD]",

  Cancelado:
    "bg-[#FEE2E2] text-[#991B1B] dark:bg-[#3F1E1E] dark:text-[#FCA5A5]",

  "Não Compareceu":
    "bg-[#F3F4F6] text-[#4B5563] dark:bg-[#1F2937] dark:text-[#D1D5DB]",
};


function StatusBadge({ status }: { status: AgendaStatus }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-25 h-7 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

interface AgendaTableProps {
  appointments: DashboardAppointment[];
  isLoading: boolean;
  search?: string;
}

export function AgendaTable({
  appointments,
  isLoading,
  search,
}: AgendaTableProps) {
  const navigate = useNavigate();

  // const {} = useMedicalRecordsByPatient(appointments.map((a) => a.patientId))

  return (
    // pen: jBwnl · bg #FFFFFF light · #1E293B dark · border #E5E7EB/#334155
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] overflow-hidden transition-colors duration-200">
      <div className="px-6 py-5 border-b border-[#E5E7EB] dark:border-[#334155]">
        <h2 className="text-base font-semibold text-[#1C2B3A] dark:text-[#F1F5F9]">
          Agenda do Dia
        </h2>
      </div>

      {/* Table header — pen: CYc32 · #F9FAFB light · #263548 dark */}
      <div className="hidden sm:grid grid-cols-[80px_1fr_120px_4px_140px] items-center px-6 py-3 bg-[#F9FAFB] dark:bg-[#263548] border-b border-[#E5E7EB] dark:border-[#334155]">
        {["Horário", "Paciente", "Status", "", "Ações"].map((col, i) => (
          <span
            key={i}
            className={`text-xs font-medium text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wide ${i >= 2 ? "text-center" : ""}`}
          >
            {col}
          </span>
        ))}
      </div>

      {/* Loading — skeleton rows */}
      {isLoading && (
        <div className="divide-y divide-[#F3F4F6] dark:divide-[#334155]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 px-4 py-4 sm:grid sm:grid-cols-[80px_1fr_120px_4px_140px] sm:items-center sm:px-6"
            >
              <div className="h-4 w-14 rounded bg-[#E2E8F0] dark:bg-[#334155] animate-pulse" />
              <div className="h-4 w-40 rounded bg-[#E2E8F0] dark:bg-[#334155] animate-pulse" />
              <div className="flex justify-center">
                <div className="h-7 w-24 rounded-full bg-[#E2E8F0] dark:bg-[#334155] animate-pulse" />
              </div>
              <span />
              <div className="flex justify-center">
                <div className="h-8 w-28 rounded-lg bg-[#E2E8F0] dark:bg-[#334155] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && appointments.length === 0 && (
        <div className="px-6 py-8 text-center text-sm text-[#94A3B8]">
          {search?.trim()
            ? `Nenhum resultado para "${search}".`
            : "Nenhuma consulta agendada para hoje."}
        </div>
      )}

      {/* Rows */}
      {!isLoading &&
        appointments.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-col gap-3 px-4 py-4 border-b border-[#F3F4F6] dark:border-[#334155] last:border-0 hover:bg-[#F9FAFB] dark:hover:bg-[#263548] transition-colors sm:grid sm:grid-cols-[80px_1fr_120px_4px_140px] sm:items-center sm:px-6"
            >
              <span className="text-sm font-medium text-[#374151] dark:text-[#F1F5F9]">
                {item.horario}
              </span>
              <span className="text-sm text-[#374151] dark:text-[#CBD5E1] break-words">
                {item.paciente}
              </span>
              <div className="flex sm:justify-center">
                <StatusBadge status={item.status} />
              </div>
              <span className="hidden sm:block" />
              <div className="flex sm:justify-center">
                <button
                  onClick={() =>
                    item.medicalRecordId
                      ? navigate(`/prontuarios/${item.medicalRecordId}/editar`)
                      : navigate(`/prontuarios?patientId=${item.patientId}`)
                  }
                  className="w-full text-xs font-medium text-[#38A169] border border-[#38A169] rounded-lg px-4 py-2 hover:bg-[#38A169] hover:text-white transition-colors whitespace-nowrap cursor-pointer sm:w-auto"
                >
                  Ver Prontuário
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
