import { HistoricoTabBar, type HistoricoTab } from "./HistoricoTabBar";
import { HistoricoItem } from "./HistoricoItem";
import type { PatientHistoryResponse } from "../../types/api";

interface HistoricoListProps {
  items: PatientHistoryResponse[];
  isLoading: boolean;
  activeTab: HistoricoTab;
  onTabChange: (tab: HistoricoTab) => void;
  search: string;
}

export function HistoricoList({
  items,
  isLoading,
  activeTab,
  onTabChange,
  search,
}: HistoricoListProps) {
  const filtered = items.filter((item) => {
    const matchesTab = activeTab === "TODOS" || item.type === activeTab;
    const matchesSearch =
      search.trim() === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    // pen: S8FAB — History Card, bg #FFFFFF, border #E2E8F0, radius 12, clip
    <div className="flex flex-col bg-white border border-[#E2E8F0] rounded-xl flex-1 min-h-0 overflow-hidden dark:border-[#334155] dark:bg-[#1E293B]">
      <HistoricoTabBar activeTab={activeTab} onTabChange={onTabChange} />

      {/* pen: MhaoU — History List, layout vertical, fill_container */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-[#94A3B8] text-sm">
            Carregando histórico...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <span className="text-[#94A3B8] text-sm">
              {search ? "Nenhum registro encontrado para esta busca." : "Nenhum registro nesta categoria."}
            </span>
          </div>
        ) : (
          filtered.map((item, idx) => (
            <HistoricoItem
              key={item.id}
              item={item}
              isLast={idx === filtered.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
