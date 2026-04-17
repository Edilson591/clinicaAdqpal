import { Users, UserCheck, Hourglass, UserX } from "lucide-react";

interface RhStatsProps {
  total: number;
  totalAtivos: number;
  totalLicenca: number;
  totalDesligados: number;
  novosEsteMes: number;
}

interface StatCardProps {
  label: string;
  value: number;
  sub: string;
  subColor?: string;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ label, value, sub, subColor = "#94A3B8", icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="text-[28px] font-bold text-[#1E293B] dark:text-[#F1F5F9] leading-none">{value}</p>
      <p className="text-xs" style={{ color: subColor }}>{sub}</p>
    </div>
  );
}

export function RhStats({ total, totalAtivos, totalLicenca, totalDesligados, novosEsteMes }: RhStatsProps) {
  const pctAtivos = total > 0 ? Math.round((totalAtivos / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total de Funcionários"
        value={total}
        sub={novosEsteMes > 0 ? `↑ ${novosEsteMes} este mês` : "Nenhuma admissão este mês"}
        subColor={novosEsteMes > 0 ? "#38A169" : "#94A3B8"}
        iconBg="bg-blue-50 dark:bg-blue-900/20"
        icon={<Users size={18} className="text-blue-500 dark:text-blue-400" />}
      />
      <StatCard
        label="Ativos"
        value={totalAtivos}
        sub={`${pctAtivos}% do total`}
        iconBg="bg-green-50 dark:bg-[#1E3A2F]"
        icon={<UserCheck size={18} className="text-[#38A169]" />}
      />
      <StatCard
        label="Em Licença"
        value={totalLicenca}
        sub="Retorno previsto"
        iconBg="bg-amber-50 dark:bg-amber-900/20"
        icon={<Hourglass size={18} className="text-amber-600 dark:text-amber-400" />}
      />
      <StatCard
        label="Desligados"
        value={totalDesligados}
        sub="Este trimestre"
        iconBg="bg-red-50 dark:bg-red-900/20"
        icon={<UserX size={18} className="text-red-500 dark:text-red-400" />}
      />
    </div>
  );
}
