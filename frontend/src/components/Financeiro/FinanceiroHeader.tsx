import { Calendar, ChevronDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FinanceiroHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-bold text-[#1E293B] dark:text-[#F1F5F9]">
          Gestão Financeira
        </h1>
        <span className="text-[13px] text-[#94A3B8]">Março 2026</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 h-9.5 px-3.5 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#475569] dark:text-[#CBD5E1] text-[13px] font-medium hover:bg-[#F8FAFC] dark:hover:bg-[#263548] transition-colors">
          <Calendar size={15} className="text-[#64748B]" />
          Este mês
          <ChevronDown size={14} className="text-[#94A3B8]" />
        </button>

        <button
          onClick={() => navigate("/financeiro/nova")}
          className="flex items-center gap-2 h-9.5 px-3.5 rounded-lg bg-[#38A169] text-white text-[13px] font-semibold hover:bg-[#2F9259] transition-colors cursor-pointer"
        >
          <Plus size={15} />
          Nova Transação
        </button>
      </div>
    </div>
  );
}
