import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { HistoricoTabBar, type HistoricoTab } from "./HistoricoTabBar";
import { HistoricoItem } from "./HistoricoItem";
import type { PatientHistoryResponse, AppointmentResponse } from "../../types/api";

// ─── Status badge de consulta ─────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  SCHEDULED:   { bg: "#DBEAFE", text: "#1D4ED8", label: "Agendada" },
  CONFIRMED:   { bg: "#D1FAE5", text: "#065F46", label: "Confirmada" },
  IN_PROGRESS: { bg: "#FEF3C7", text: "#B45309", label: "Em andamento" },
  COMPLETED:   { bg: "#DCFCE7", text: "#166534", label: "Concluída" },
  CANCELED:    { bg: "#FEE2E2", text: "#991B1B", label: "Cancelada" },
  CANCELLED:   { bg: "#FEE2E2", text: "#991B1B", label: "Cancelada" },
  NO_SHOW:     { bg: "#F3F4F6", text: "#6B7280", label: "Não compareceu" },
};

function AppointmentItem({
  appt,
  isLast,
}: {
  appt: AppointmentResponse;
  isLast: boolean;
}) {
  const navigate = useNavigate();
  const badge = STATUS_STYLES[appt.status] ?? STATUS_STYLES.SCHEDULED;

  const date = new Date(appt.scheduledAt).toLocaleDateString("pt-BR");
  const time = new Date(appt.scheduledAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-start gap-3.5 px-5 py-4 ${
        !isLast ? "border-b border-[#F1F5F9] dark:border-[#334155]" : ""
      }`}
    >
      {/* Badge status */}
      <div
        className="flex items-center px-2.5 py-1 rounded-full shrink-0 mt-0.5"
        style={{ backgroundColor: badge.bg }}
      >
        <span className="text-[11px] font-semibold" style={{ color: badge.text }}>
          {badge.label}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-[14px] font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          Consulta — {date} às {time}
        </span>
        {appt.notes && (
          <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            {appt.notes}
          </p>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 shrink-0 mt-0.5">
        <span className="text-[12px] text-[#94A3B8]">{date}</span>
        {appt.medicalRecordId && (
          <button
            onClick={() => navigate(`/prontuarios/${appt.medicalRecordId}/editar`)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-[#38A169] border border-[#38A169] hover:bg-[#38A169] hover:text-white transition-colors cursor-pointer"
            title="Abrir prontuário"
          >
            <FileText size={11} />
            Prontuário
          </button>
        )}
      </div>
    </div>
  );
}

// ─── HistoricoList ────────────────────────────────────────────────────────────

interface HistoricoListProps {
  items: PatientHistoryResponse[];
  isLoading: boolean;
  activeTab: HistoricoTab;
  onTabChange: (tab: HistoricoTab) => void;
  search: string;
  appointments?: AppointmentResponse[];
  appointmentsLoading?: boolean;
}

export function HistoricoList({
  items,
  isLoading,
  activeTab,
  onTabChange,
  search,
  appointments = [],
  appointmentsLoading = false,
}: HistoricoListProps) {
  const isConsultaTab = activeTab === "CONSULTA";
  const isTodosTab = activeTab === "TODOS";

  const filteredHistory = items.filter((item) => {
    const matchesTab = activeTab === "TODOS" || item.type === activeTab;
    const matchesSearch =
      search.trim() === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const filteredAppointments = appointments.filter((a) =>
    search.trim() === "" || a.notes?.toLowerCase().includes(search.toLowerCase())
  );

  // Para a aba TODOS: mescla histórico + agendamentos ordenados por data desc
  type MergedItem =
    | { kind: "history"; data: PatientHistoryResponse; date: number }
    | { kind: "appt"; data: AppointmentResponse; date: number };

  const mergedItems: MergedItem[] = isTodosTab
    ? [
        ...filteredHistory.map((h) => ({
          kind: "history" as const,
          data: h,
          date: new Date(h.createdAt).getTime(),
        })),
        ...filteredAppointments.map((a) => ({
          kind: "appt" as const,
          data: a,
          date: new Date(a.scheduledAt).getTime(),
        })),
      ].sort((a, b) => b.date - a.date)
    : [];

  const loading = isConsultaTab ? appointmentsLoading : isTodosTab ? isLoading || appointmentsLoading : isLoading;
  const empty = isConsultaTab
    ? filteredAppointments.length === 0
    : isTodosTab
    ? mergedItems.length === 0
    : filteredHistory.length === 0;

  return (
    <div className="flex flex-col bg-white border border-[#E2E8F0] rounded-xl flex-1 min-h-0 overflow-hidden dark:border-[#334155] dark:bg-[#1E293B]">
      <HistoricoTabBar activeTab={activeTab} onTabChange={onTabChange} />

      <div className="flex flex-col flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#94A3B8] text-sm">
            Carregando...
          </div>
        ) : empty ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <span className="text-[#94A3B8] text-sm">
              {search ? "Nenhum registro encontrado para esta busca." : "Nenhum registro nesta categoria."}
            </span>
          </div>
        ) : isConsultaTab ? (
          filteredAppointments
            .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
            .map((appt, idx) => (
              <AppointmentItem
                key={appt.id}
                appt={appt}
                isLast={idx === filteredAppointments.length - 1}
              />
            ))
        ) : isTodosTab ? (
          mergedItems.map((item, idx) =>
            item.kind === "appt" ? (
              <AppointmentItem
                key={item.data.id}
                appt={item.data}
                isLast={idx === mergedItems.length - 1}
              />
            ) : (
              <HistoricoItem
                key={item.data.id}
                item={item.data}
                isLast={idx === mergedItems.length - 1}
              />
            )
          )
        ) : (
          filteredHistory.map((item, idx) => (
            <HistoricoItem
              key={item.id}
              item={item}
              isLast={idx === filteredHistory.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
