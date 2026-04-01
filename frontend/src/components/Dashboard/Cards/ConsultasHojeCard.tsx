import { Calendar } from "lucide-react";

interface ConsultasHojeCardProps {
  total: number;
}

export function ConsultasHojeCard({ total }: ConsultasHojeCardProps) {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#334155] transition-colors duration-200">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={18} className="text-[#38A169]" />
        <span className="text-sm text-[#6B7280] dark:text-[#94A3B8]">Consultas Hoje</span>
      </div>
      <p className="text-4xl font-bold text-[#1C2B3A] dark:text-[#F1F5F9]">{total}</p>
    </div>
  );
}
