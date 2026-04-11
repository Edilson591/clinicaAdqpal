import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SearchableSelect } from "../ui/SearchableSelect";
import { useSelectedMonth } from "./useSelectedMonth";


const TABS = [
  { label: "Visão Geral", path: "/financeiro" },
  { label: "Transações", path: "/financeiro/transacoes" },
];

/** Gera lista dos últimos 13 meses (mês atual + 12 anteriores) */
function buildMonthOptions() {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 13; i++) {
    const d = subMonths(startOfMonth(now), i);
    const value = format(d, "yyyy-MM");
    const label = format(d, "MMMM yyyy", { locale: ptBR });
    options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return options;
}

const MONTH_OPTIONS = buildMonthOptions();


export function FinanceiroHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedMonth, setMonth } = useSelectedMonth();

  // const selectedLabel =
  //   MONTH_OPTIONS.find((o) => o.value === selectedMonth)?.label ??
  //   MONTH_OPTIONS[0].label;

  function navigateTab(path: string) {
    // Preserva o filtro de mês ao trocar de aba
    const params = selectedMonth !== format(new Date(), "yyyy-MM")
      ? `?month=${selectedMonth}`
      : "";
    navigate(`${path}${params}`);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Título + seletor de mês + botão */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-[#1E293B] dark:text-[#F1F5F9]">
            Gestão Financeira
          </h1>

          {/* Seletor de mês */}
          <div className="w-48">
            <SearchableSelect
              options={MONTH_OPTIONS}
              value={selectedMonth}
              onChange={setMonth}
              placeholder="Selecionar mês..."
              className="h-8 px-3 text-[12px] font-medium text-[#475569] dark:text-[#CBD5E1] bg-[#F1F5F9] dark:bg-[#334155] border-[#E2E8F0] dark:border-[#475569] focus:ring-[#38A169]/30"
            />
          </div>
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
              onClick={() => navigateTab(tab.path)}
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
