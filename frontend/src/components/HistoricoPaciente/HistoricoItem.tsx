import type { PatientHistoryResponse, HistoryType } from "../../types/api";

// pen: badges — cores por tipo
const BADGE_STYLES: Record<HistoryType, { bg: string; text: string; label: string }> = {
  CONSULTA:   { bg: "#DBEAFE", text: "#1D4ED8", label: "Consulta" },
  EXAME:      { bg: "#FEF3C7", text: "#B45309", label: "Exame" },
  PRESCRICAO: { bg: "#D1FAE5", text: "#065F46", label: "Prescrição" },
  OBSERVACAO: { bg: "#F3E8FF", text: "#7C3AED", label: "Observação" },
  SOLICITACAO:{ bg: "#FFE4E6", text: "#BE123C", label: "Solicitação" },
};

interface HistoricoItemProps {
  item: PatientHistoryResponse;
  isLast?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function HistoricoItem({ item, isLast }: HistoricoItemProps) {
  const badge = BADGE_STYLES[item.type as HistoryType] ?? BADGE_STYLES.CONSULTA;

  return (
    // pen: dkmjq / uXiMG / Z5LNg — Item, padding [16,20], gap 14, border-bottom #F1F5F9
    <div
      className={`flex items-start gap-3.5 px-5 py-4 ${
        !isLast ? "border-b border-[#F1F5F9]" : ""
      }`}
    >
      {/* pen: badge pill */}
      <div
        className="flex items-center px-2.5 py-1 rounded-full shrink-0 mt-0.5"
        style={{ backgroundColor: badge.bg }}
      >
        <span
          className="text-[11px] font-semibold"
          style={{ color: badge.text }}
        >
          {badge.label}
        </span>
      </div>

      {/* pen: bd — body vertical gap 6 */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <span className="text-[14px] font-semibold text-[#1E293B]">
          {item.title}
        </span>
        <p className="text-[12px] text-[#64748B] leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* pen: dt — date right */}
      <span className="text-[12px] text-[#94A3B8] shrink-0 mt-0.5">
        {formatDate(item.createdAt)}
      </span>
    </div>
  );
}
