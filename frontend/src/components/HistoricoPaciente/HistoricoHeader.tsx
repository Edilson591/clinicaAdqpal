import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";

interface HistoricoHeaderProps {
  patientName: string;
  patientId: string;
  search: string;
  onSearchChange: (value: string) => void;
}

export function HistoricoHeader({
  patientName,
  patientId,
}: HistoricoHeaderProps) {
  // const { user } = useAuth();
  // const initial = user?.username?.charAt(0).toUpperCase() ?? "M";

  return (
    // pen: obI21 — Header bg #FFFFFF, h:64, border-bottom #E5E7EB
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center flex-wrap">
          {/* Left: back btn + breadcrumb */}
          <Link
            to={`/pacientes/${patientId}/editar`}
            className="flex items-center gap-1 px-1.5 py-1 rounded text-[#64748B] text-sm hover:bg-[#F1F5F9] transition-colors"
          >
            <ArrowLeft size={16} />
             Pacientes
          </Link>

          {/* pen: bcRow — breadcrumbs */}
          <div className="flex items-center gap-1">
            <ChevronRight size={14} className="text-[#94A3B8]" />
            <Link
              to={`/pacientes/${patientId}/editar`}
              className="flex items-center gap-1 px-1.5 py-1 rounded text-[#64748B] text-sm hover:bg-[#F1F5F9] transition-colors"
            >
              {patientName}
            </Link>
            <ChevronRight size={14} className="text-[#94A3B8]" />
            <ClipboardList size={16} className="text-[#38A169]" />
            <span className="text-[22px] font-semibold text-[#1E293B] dark:text-[#64748B] ">
              Histórico
            </span>
          </div>
        </div>

        {/* Right: search + bell + avatar */}
      </div>
    </div>
  );
}
