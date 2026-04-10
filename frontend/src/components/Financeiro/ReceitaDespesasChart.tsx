import { format, subMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReceitaDespesasChartProps {
  currentIncome?: number;
  currentExpense?: number;
}

const BAR_HEIGHT = 140;

// Gera labels dos últimos 6 meses (o último é o mês atual)
function getLast6Months() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(startOfMonth(now), 5 - i);
    return format(date, "MMM", { locale: ptBR });
  }).map((m) => m.charAt(0).toUpperCase() + m.slice(1));
}

// Dados ilustrativos para os 5 meses anteriores (valores relativos 0-100)
const HISTORIC = [
  { receita: 78, despesa: 32 },
  { receita: 95, despesa: 42 },
  { receita: 68, despesa: 28 },
  { receita: 110, despesa: 48 },
  { receita: 88, despesa: 36 },
];

export function ReceitaDespesasChart({
  currentIncome,
  currentExpense,
}: ReceitaDespesasChartProps) {
  const months = getLast6Months();

  // Normaliza o mês atual em relação ao máximo histórico para manter escala visual
  const historicMax = Math.max(...HISTORIC.map((d) => Math.max(d.receita, d.despesa)));
  const realMax = Math.max(currentIncome ?? 0, currentExpense ?? 0, 1);
  const scaleFactor = historicMax / realMax;

  const currentReceita =
    currentIncome != null ? Math.min((currentIncome * scaleFactor) / historicMax, 1) * 120 : 100;
  const currentDespesa =
    currentExpense != null
      ? Math.min((currentExpense * scaleFactor) / historicMax, 1) * 120
      : 44;

  const chartData = [
    ...HISTORIC.map((d, i) => ({ month: months[i], receita: d.receita, despesa: d.despesa })),
    { month: months[5], receita: currentReceita, despesa: currentDespesa },
  ];

  const MAX = Math.max(...chartData.map((d) => Math.max(d.receita, d.despesa)), 1);

  return (
    <div className="flex-1 min-h-[280px] bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-4 sm:p-5 flex flex-col gap-4 min-w-0 transition-colors duration-200">
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
            <span className="w-3 h-3 rounded-sm bg-[#FCA5A5] inline-block" />
            Despesas
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 flex-1">
        {chartData.map((d, idx) => (
          <div key={d.month + idx} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="flex items-end gap-1 w-full justify-center"
              style={{ height: BAR_HEIGHT }}
            >
              <div
                className={`w-5 rounded-t-sm ${idx === 5 ? "bg-[#38A169]" : "bg-[#86EFAC]"}`}
                style={{ height: `${(d.receita / MAX) * BAR_HEIGHT}px` }}
              />
              <div
                className={`w-5 rounded-t-sm ${idx === 5 ? "bg-[#EF4444]" : "bg-[#FCA5A5]"}`}
                style={{ height: `${(d.despesa / MAX) * BAR_HEIGHT}px` }}
              />
            </div>
            <span className={`text-[11px] ${idx === 5 ? "text-[#1E293B] dark:text-[#F1F5F9] font-semibold" : "text-[#94A3B8]"}`}>
              {d.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
