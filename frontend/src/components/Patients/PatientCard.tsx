import { FileText, ClipboardList } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { PatientResponse } from "../../types/api";
import { formatCpf } from "../../utils/formatCpf";
import { formatPhone } from "../../utils/formatPhone";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

interface PatientCardProps {
  patient: PatientResponse;
}

export function PatientCard({ patient }: PatientCardProps) {
  const navigate = useNavigate();

  console.log(patient)
  return (
    // pen: lV5VV / PhFNz rows · hover #263548 dark
    <tr className="border-b border-[#E2E8F0] dark:border-[#334155] last:border-0 hover:bg-[#F8FAFC] dark:hover:bg-[#263548] transition-colors">
      {/* Nome + avatar inicial (pen: avatarBg #E8F5E9 light · #1E3A2F dark) */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E8F5E9] dark:bg-[#1E3A2F] flex items-center justify-center shrink-0">
            <span className="text-[#38A169] text-xs font-semibold">
              {patient.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">
            {patient.name}
          </span>
        </div>
      </td>

      {/* CPF */}
      <td className="px-4 py-3.5 text-sm text-[#475569] dark:text-[#94A3B8] hidden md:table-cell">
        {formatCpf(patient.cpf ?? "") ?? "—"}
      </td>

      {/* Telefone */}
      <td className="px-4 py-3.5 text-sm text-[#475569] dark:text-[#94A3B8] hidden lg:table-cell">
        {formatPhone(patient.phone ?? "") ?? "—"}
      </td>

      {/* Última consulta / createdAt */}
      <td className="px-4 py-3.5 text-sm text-[#475569] dark:text-[#94A3B8] hidden xl:table-cell">
        {formatDate(patient.updatedAt ?? null)}
      </td>

      {/* Ações */}
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/pacientes/${patient.id}/historico`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#3B82F6] border border-[#3B82F6] bg-transparent hover:bg-[#3B82F6] hover:text-white transition-colors"
            title="Ver histórico do paciente"
          >
            <ClipboardList size={12} />
            Histórico
          </Link>
          <button
            onClick={() =>
              patient.latestMedicalRecordId
                ? navigate(`/prontuarios/${patient.latestMedicalRecordId}/editar`)
                : navigate(`/prontuarios?patientId=${patient.id}`)
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#38A169] border border-[#38A169] bg-transparent hover:bg-[#38A169] hover:text-white transition-colors cursor-pointer"
            title="Ver prontuário"
          >
            <FileText size={12} />
            Prontuário
          </button>
          <Link
            to={`/pacientes/${patient.id}/editar`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#64748B] border border-[#64748B] bg-transparent hover:bg-[#64748B] hover:text-white transition-colors"
            title="Ver cadastro"
          >
            Ver
          </Link>
        </div>
      </td>
    </tr>
  );
}
