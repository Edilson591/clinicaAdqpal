import { Loader2, Users, FileText } from "lucide-react";
import type { PatientResponse } from "../../types/api";

interface PatientTableProps {
  patients: PatientResponse[];
  isLoading: boolean;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function PatientTable({ patients, isLoading }: PatientTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#38A169]" />
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#64748B]">
        <Users size={40} className="mb-3 opacity-40" />
        <p className="text-sm">Nenhum paciente encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#334155]">
        <h2 className="text-sm font-semibold text-[#F1F5F9]">Lista de Pacientes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#334155]">
              <th className="text-left px-5 py-3.5 text-[#64748B] font-medium">Nome</th>
              <th className="text-left px-5 py-3.5 text-[#64748B] font-medium hidden md:table-cell">CPF</th>
              <th className="text-left px-5 py-3.5 text-[#64748B] font-medium hidden lg:table-cell">E-mail</th>
              <th className="text-left px-5 py-3.5 text-[#64748B] font-medium hidden lg:table-cell">Telefone</th>
              <th className="text-left px-5 py-3.5 text-[#64748B] font-medium hidden xl:table-cell">Nascimento</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-[#334155] last:border-0 hover:bg-[#263548] transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1E3A2F] flex items-center justify-center shrink-0">
                      <span className="text-[#38A169] text-xs font-semibold">
                        {patient.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[#F1F5F9] font-medium">{patient.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[#94A3B8] hidden md:table-cell">
                  {patient.cpf ?? "—"}
                </td>
                <td className="px-5 py-3.5 text-[#94A3B8] hidden lg:table-cell">
                  {patient.email ?? "—"}
                </td>
                <td className="px-5 py-3.5 text-[#94A3B8] hidden lg:table-cell">
                  {patient.phone ?? "—"}
                </td>
                <td className="px-5 py-3.5 text-[#94A3B8] hidden xl:table-cell">
                  {formatDate(patient.dateOfBirth)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#38A169] bg-[#1E3A2F]/60 border border-[#1E3A2F] hover:bg-[#1E3A2F] transition-colors cursor-pointer">
                    <FileText size={13} />
                    Prontuário
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
