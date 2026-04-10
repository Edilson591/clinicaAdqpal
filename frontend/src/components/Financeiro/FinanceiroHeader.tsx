import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TABS = [
  { label: "Visão Geral", path: "/financeiro" },
  { label: "Transações", path: "/financeiro/transacoes" },
];

export function FinanceiroHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentMonth = format(new Date(), "MMMM yyyy", { locale: ptBR });
  const displayMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  return (
    <div className="flex flex-col gap-3">
      {/* Título + botão */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-[#1E293B] dark:text-[#F1F5F9]">
            Gestão Financeira
          </h1>
          <span className="text-[13px] text-[#94A3B8]">{displayMonth}</span>
        </div>

        <button
          onClick={() => navigate("/financeiro/nova")}
          className="flex items-center gap-2 h-9.5 px-3.5 rounded-lg bg-[#38A169] text-white text-[13px] font-semibold hover:bg-[#2F9259] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          Nova Transação
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E2E8F0] dark:border-[#334155]">
        {TABS.map((tab) => {
          const isActive =
            tab.path === "/financeiro" ? pathname === "/financeiro" : pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors cursor-pointer -mb-px ${
                isActive
                  ? "border-[#38A169] text-[#38A169]"
                  : "border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#F1F5F9]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
