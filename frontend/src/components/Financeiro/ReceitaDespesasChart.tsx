interface BarData {
  month: string;
  receita: number;
  despesa: number;
}

// Valores relativos (0–120) usados para altura proporcional das barras
const chartData: BarData[] = [
  { month: "Out", receita: 95, despesa: 40 },
  { month: "Nov", receita: 78, despesa: 34 },
  { month: "Dez", receita: 110, despesa: 50 },
  { month: "Jan", receita: 85, despesa: 30 },
  { month: "Fev", receita: 100, despesa: 44 },
  { month: "Mar", receita: 120, despesa: 52 },
];

const MAX = 120;
const BAR_HEIGHT = 140; // px total disponível para as barras

export function ReceitaDespesasChart() {
  return (
    <div className="flex-1 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-5 flex flex-col gap-4 min-w-0 transition-colors duration-200">
      {/* Header */}
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

      {/* Chart area */}
      <div className="flex items-end justify-between gap-2 flex-1">
        {chartData.map((d) => (
          <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="flex items-end gap-1 w-full justify-center"
              style={{ height: BAR_HEIGHT }}
            >
              <div
                className="w-5 rounded-t-sm bg-[#38A169]"
                style={{ height: `${(d.receita / MAX) * BAR_HEIGHT}px` }}
              />
              <div
                className="w-5 rounded-t-sm bg-[#FCA5A5]"
                style={{ height: `${(d.despesa / MAX) * BAR_HEIGHT}px` }}
              />
            </div>
            <span className="text-[11px] text-[#94A3B8]">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
