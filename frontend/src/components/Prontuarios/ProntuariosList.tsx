import { Loader2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { MedicalRecordResponse } from "../../types/api";

interface ProntuariosListProps {
  records: MedicalRecordResponse[];
  patientMap: Map<string, string>;
  isLoading: boolean;
}

export function ProntuariosList({ records, patientMap, isLoading }: ProntuariosListProps) {
  return (
    // pen: uYC4k · bg #FFFFFF light · #1E293B dark · border #E2E8F0 / #334155 · cornerRadius 12
    <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl overflow-hidden transition-colors duration-200">
      {/* Título */}
      <div className="px-6 py-5 border-b border-[#E2E8F0] dark:border-[#334155]">
        <h2 className="text-xl font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          Prontuários Recentes
        </h2>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[#38A169]" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && records.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8] dark:text-[#64748B]">
          <FileText size={40} className="mb-3 opacity-40" />
          <p className="text-sm">Nenhum prontuário encontrado</p>
        </div>
      )}

      {/* Tabela */}
      {!isLoading && records.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* pen: P27zP · bg #F1F5F9 light · #263548 dark */}
            <thead>
              <tr className="bg-[#F1F5F9] dark:bg-[#263548] border-b border-[#E2E8F0] dark:border-[#334155]">
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-[#475569] dark:text-[#94A3B8]">
                  Paciente
                </th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-[#475569] dark:text-[#94A3B8] hidden md:table-cell">
                  Última Atualização
                </th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-[#475569] dark:text-[#94A3B8] hidden lg:table-cell">
                  Diagnóstico
                </th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-[#475569] dark:text-[#94A3B8]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => {
                const patientName = patientMap.get(r.patientId) ?? "—";
                const updatedAt = new Date(r.updatedAt).toLocaleDateString("pt-BR");

                return (
                  // Alternating rows — pen: cRhwy/6Tolh/8JiXo · h:56
                  <tr
                    key={r.id}
                    className={`border-b border-[#E2E8F0] dark:border-[#334155] last:border-0 transition-colors hover:bg-[#F8FAFC] dark:hover:bg-[#263548] ${
                      idx % 2 === 1 ? "bg-[#F8FAFC] dark:bg-[#202E3F]" : ""
                    }`}
                  >
                    {/* Paciente */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E8F5E9] dark:bg-[#1E3A2F] flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-[#38A169]">
                            {patientName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                          {patientName}
                        </span>
                      </div>
                    </td>

                    {/* Última Atualização */}
                    <td className="px-4 py-3 text-[#64748B] dark:text-[#94A3B8] hidden md:table-cell">
                      {updatedAt}
                    </td>

                    {/* Diagnóstico */}
                    <td className="px-4 py-3 text-[#64748B] dark:text-[#94A3B8] hidden lg:table-cell max-w-xs truncate">
                      {r.diagnosis ?? "—"}
                    </td>

                    {/* Ações — pen: wHOil · border #38a169, h:32, w:100, cornerRadius 6 */}
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/prontuarios/${r.id}/editar`}
                        className="inline-flex items-center justify-center h-8 px-4 rounded-md text-xs font-semibold text-[#38A169] border border-[#38A169] bg-transparent hover:bg-[#E8F5E9] dark:hover:bg-[#1E3A2F] transition-colors"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
