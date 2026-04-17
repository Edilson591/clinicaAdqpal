import type { DashboardMonthData } from "../../services/Financial";

interface ReceitaDespesasChartProps {
  data?: DashboardMonthData[];
  isLoading?: boolean;
  selectedMonth?: string; // "YYYY-MM" — para destacar a barra do mês selecionado
}

const BAR_HEIGHT = 140;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function SkeletonBar() {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="flex items-end gap-1 w-full justify-center" style={{ height: BAR_HEIGHT }}>
        <div className="w-5 rounded-t-sm bg-[#E2E8F0] dark:bg-[#334155] animate-pulse" style={{ height: "60%" }} />
        <div className="w-5 rounded-t-sm bg-[#E2E8F0] dark:bg-[#334155] animate-pulse" style={{ height: "35%" }} />
      </div>
      <div className="h-2.5 w-6 rounded bg-[#E2E8F0] dark:bg-[#334155] animate-pulse" />
    </div>
  );
}

export function ReceitaDespesasChart({
  data,
  isLoading,
  selectedMonth,
}: ReceitaDespesasChartProps) {
  const MAX = data
    ? Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1)
    : 1;

  // Índice do mês selecionado (ou último se não especificado)
  const selectedIdx = data && selectedMonth
    ? data.findIndex((d) => d.month === selectedMonth)
    : (data ? data.length - 1 : 5);
  const activeIdx = selectedIdx === -1 ? (data ? data.length - 1 : 5) : selectedIdx;

  return (
    <div className="flex-1 min-h-70 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-4 sm:p-5 flex flex-col gap-4 min-w-0 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          Receita vs Despesas
        </h2>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
            <span className="w-3 h-3 rounded-sm bg-[#38A169] inline-block" />
            Receita
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
            <span className="w-3 h-3 rounded-sm bg-[#EF4444] inline-block" />
            Despesas
          </span>
        </div>
      </div>

      {/* Barras */}
      <div className="flex items-end justify-between gap-2 flex-1">
        {isLoading || !data
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonBar key={i} />)
          : data.map((d, idx) => {
              const isActive = idx === activeIdx;
              const incomeH = Math.max((d.income / MAX) * BAR_HEIGHT, d.income > 0 ? 4 : 0);
              const expenseH = Math.max((d.expense / MAX) * BAR_HEIGHT, d.expense > 0 ? 4 : 0);

              return (
                <div key={d.month} className="group flex flex-col items-center gap-1 flex-1 relative">
                  {/* Tooltip */}
                  {isActive && (d.income > 0 || d.expense > 0) && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1E293B] dark:bg-[#F1F5F9] text-white dark:text-[#1E293B] text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10">
                      {formatCurrency(d.income - d.expense)}
                    </div>
                  )}

                  <div
                    className="flex items-end gap-1 w-full justify-center"
                    style={{ height: BAR_HEIGHT }}
                  >
                    <div
                      className={`w-5 rounded-t-sm transition-all duration-300 ${
                        isActive ? "bg-[#38A169]" : "bg-[#86EFAC] dark:bg-[#166534]"
                      }`}
                      style={{ height: `${incomeH}px` }}
                    />
                    <div
                      className={`w-5 rounded-t-sm transition-all duration-300 ${
                        isActive ? "bg-[#EF4444]" : "bg-[#FCA5A5] dark:bg-[#7F1D1D]"
                      }`}
                      style={{ height: `${expenseH}px` }}
                    />
                  </div>

                  <span
                    className={`text-[11px] ${
                      isActive
                        ? "text-[#1E293B] dark:text-[#F1F5F9] font-semibold"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
      </div>

      {/* Rodapé com totais do mês ativo */}
      {data && data[activeIdx] && (
        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] dark:border-[#334155]">
          <span className="text-[11px] text-[#94A3B8]">
            {data[activeIdx].label}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-medium text-[#38A169]">
              +{formatCurrency(data[activeIdx].income)}
            </span>
            <span className="text-[12px] font-medium text-[#EF4444]">
              -{formatCurrency(data[activeIdx].expense)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
