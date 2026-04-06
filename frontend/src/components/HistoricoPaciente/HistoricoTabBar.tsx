import type { HistoryType } from "../../types/api";

export type HistoricoTab = "TODOS" | HistoryType;

const TABS: { value: HistoricoTab; label: string }[] = [
  { value: "TODOS",      label: "Todos" },
  { value: "CONSULTA",   label: "Consulta" },
  { value: "EXAME",      label: "Exame" },
  { value: "PRESCRICAO", label: "Prescrição" },
  { value: "OBSERVACAO", label: "Observação" },
  { value: "SOLICITACAO",label: "Solicitação" },
];

interface HistoricoTabBarProps {
  activeTab: HistoricoTab;
  onTabChange: (tab: HistoricoTab) => void;
}

export function HistoricoTabBar({ activeTab, onTabChange }: HistoricoTabBarProps) {
  return (
    // pen: LyjKW — Tab Bar, border-bottom #E2E8F0, padding [0,8]
    <div className="flex items-center gap-0 border-b border-[#E2E8F0] px-2 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`px-4 py-3.5 text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
              isActive
                ? "font-semibold text-[#38A169] border-b-2 border-[#38A169]"
                : "font-normal text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] "
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
