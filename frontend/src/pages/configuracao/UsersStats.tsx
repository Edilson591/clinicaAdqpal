import { Users, UserCheck, Stethoscope, ShieldCheck } from "lucide-react";

interface UsersStatsProps {
  total: number;
  totalAdmins: number;
  totalDoctors: number;
  totalReceptionists: number;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ label, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">{value}</p>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{label}</p>
      </div>
    </div>
  );
}

export function UsersStats({ total, totalAdmins, totalDoctors, totalReceptionists }: UsersStatsProps) {
  return (
    <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-4 gap-4">
      <StatCard
        label="Total de usuários"
        value={total}
        iconBg="bg-blue-50 dark:bg-blue-900/20"
        icon={<Users size={22} className="text-blue-500 dark:text-blue-400" />}
      />
      <StatCard
        label="Médicos"
        value={totalDoctors}
        iconBg="bg-green-50 dark:bg-[#1E3A2F]"
        icon={<Stethoscope size={22} className="text-[#38A169]" />}
      />
      <StatCard
        label="Recepcionistas"
        value={totalReceptionists}
        iconBg="bg-purple-50 dark:bg-purple-900/20"
        icon={<UserCheck size={22} className="text-purple-500 dark:text-purple-400" />}
      />
      <StatCard
        label="Administradores"
        value={totalAdmins}
        iconBg="bg-orange-50 dark:bg-orange-900/20"
        icon={<ShieldCheck size={22} className="text-orange-500 dark:text-orange-400" />}
      />
    </div>
  );
}
