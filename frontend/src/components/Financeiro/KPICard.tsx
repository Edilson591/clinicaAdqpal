import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  trend: string;
  trendPositive: boolean;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export function KPICard({
  title,
  value,
  trend,
  trendPositive,
  Icon,
  iconBg,
  iconColor,
}: KPICardProps) {
  return (
    <div className="flex-1 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-5 flex flex-col gap-3 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#64748B] dark:text-[#94A3B8]">{title}</span>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>

      <p className="text-[24px] font-bold text-[#1E293B] dark:text-[#F1F5F9] leading-none">
        {value}
      </p>

      <span
        className="text-[12px] font-medium"
        style={{ color: trendPositive ? "#38A169" : "#EF4444" }}
      >
        {trend}
      </span>
    </div>
  );
}
