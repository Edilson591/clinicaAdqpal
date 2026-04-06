import { User, Plus } from "lucide-react";
import type { PatientResponse } from "../../types/api";
import { Button } from "../ui/Button";

interface PatientInfoCardProps {
  patient: PatientResponse;
  onNovoRegistro: () => void;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function PatientInfoCard({
  patient,
  onNovoRegistro,
}: PatientInfoCardProps) {
  const dob = formatDate(patient.dateOfBirth);

  return (
    // pen: HrbEw — Patient Card, bg #FFFFFF, border #E2E8F0, radius 12, padding [16,20], gap 16
    <div className="flex items-center gap-4 bg-white border border-[#E2E8F0] rounded-xl px-5 py-4 dark:border-[#334155] dark:bg-[#1E293B]">
      {/* pen: srkas — avatar verde #DCFCE7 */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#DCFCE7] shrink-0">
        <User size={22} className="text-[#38A169]" />
      </div>

      {/* pen: ptInfo */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* pen: ptName */}
        <span className="text-[15px] font-semibold text-[#1E293B]  dark:text-[#F1F5F9]">
          {patient.name}
        </span>

        {/* pen: ptMeta */}
        <div className="flex items-center gap-4 flex-wrap">
          {dob && (
            <span className="text-[12px] text-[#64748B]">Nasc. {dob}</span>
          )}
          {patient.phone && (
            <span className="text-[12px] text-[#64748B]">{patient.phone}</span>
          )}
          {patient.agreement && (
            <span className="text-[12px] text-[#64748B]">
              Plano: {patient.agreement}
            </span>
          )}
        </div>
      </div>

      {/* pen: f1rMd — badge Ativo */}
      <div className="flex items-center px-3 py-1 rounded-full bg-[#DCFCE7] shrink-0">
        <span className="text-[12px] font-semibold text-[#16A34A]">Ativo</span>
      </div>

      {/* pen: oLQqF — Novo Registro btn */}
      <Button
        variant="primary"
        onClick={onNovoRegistro}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#38A169] text-white text-[13px] font-semibold hover:bg-[#2F9259] transition-colors shrink-0"
      >
        <Plus size={16} />
        Novo Registro
      </Button>
    </div>
  );
}
