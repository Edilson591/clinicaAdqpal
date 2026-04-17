import { Receipt, Banknote, Timer, Ban } from "lucide-react";

interface NotasFiscaisStatsProps {
  totalEmitidas: number;
  valorTotal: number;
  totalPendentes: number;
  totalCanceladas: number;
  isLoading: boolean;
}

function StatCard({
  title,
  value,
  sub,
  subColor,
  iconBg,
  iconColor,
  Icon,
  isLoading,
}: {
  title: string;
  value: string;
  sub: string;
  subColor: string;
  iconBg: string;
  iconColor: string;
  Icon: React.ElementType;
  isLoading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">{title}</span>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-2 animate-pulse">
          <div className="h-7 w-20 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
          <div className="h-4 w-28 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
        </div>
      ) : (
        <>
          <span className="text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">{value}</span>
          <span className="text-xs font-normal" style={{ color: subColor }}>
            {sub}
          </span>
        </>
      )}
    </div>
  );
}

export function NotasFiscaisStats({
  totalEmitidas,
  valorTotal,
  totalPendentes,
  totalCanceladas,
  isLoading,
}: NotasFiscaisStatsProps) {
  const valorFormatado = valorTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="NFs Emitidas"
        value={String(totalEmitidas)}
        sub="Total de notas emitidas"
        subColor="#38A169"
        iconBg="#DCFCE7"
        iconColor="#38A169"
        Icon={Receipt}
        isLoading={isLoading}
      />
      <StatCard
        title="Valor Total"
        value={valorFormatado}
        sub="Faturado em notas emitidas"
        subColor="#94A3B8"
        iconBg="#DBEAFE"
        iconColor="#3B82F6"
        Icon={Banknote}
        isLoading={isLoading}
      />
      <StatCard
        title="Pendentes"
        value={String(totalPendentes)}
        sub="Aguardando emissão"
        subColor="#F59E0B"
        iconBg="#FEF3C7"
        iconColor="#F59E0B"
        Icon={Timer}
        isLoading={isLoading}
      />
      <StatCard
        title="Canceladas"
        value={String(totalCanceladas)}
        sub="Notas canceladas"
        subColor="#EF4444"
        iconBg="#FEE2E2"
        iconColor="#EF4444"
        Icon={Ban}
        isLoading={isLoading}
      />
    </div>
  );
}
