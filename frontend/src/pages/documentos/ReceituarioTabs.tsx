import { type RecTab } from "../../hooks/useReceituarioPage";
import { cn } from "../../lib/utils";

interface ReceituarioTabsProps {
  activeTab: RecTab;
  onTabChange: (tab: RecTab) => void;
}

const TABS: { key: RecTab; label: string }[] = [
  { key: "exames", label: "Solicitação de Exames" },
  { key: "receita_com", label: "Receita c/ Assinatura" },
  { key: "receita_sem", label: "Receita s/ Assinatura" },
  { key: "controle", label: "Controle Especial" },
  { key: "encaminhamento", label: "Encaminhamento" },
  { key: "autorizacao", label: "Autorização" },
];

export function ReceituarioTabs({ activeTab, onTabChange }: ReceituarioTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 no-print">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={cn(
            "px-4 py-2.5 text-sm font-semibold rounded-t-lg border border-b-0 transition-colors cursor-pointer",
            activeTab === key
              ? "bg-white dark:bg-[#1E293B] text-[#38A169] dark:text-[#38A169] border-[#E2E8F0] dark:border-[#334155]"
              : "bg-[#F3F4F6] dark:bg-[#263548] text-[#4B5563] dark:text-[#94A3B8] border-transparent hover:bg-[#E5E7EB] dark:hover:bg-[#334155]",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
