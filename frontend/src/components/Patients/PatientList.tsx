import { Users } from "lucide-react";
import { PatientCard } from "./PatientCard";
import { FieldSkeleton } from "../ui/FieldSkeleton";
import type { PatientResponse } from "../../types/api";

interface PatientListProps {
  patients: PatientResponse[];
  isLoading: boolean;
}

export function PatientList({ patients, isLoading }: PatientListProps) {
  return (
    // pen: jBwnl · bg #FFFFFF light · #1E293B dark · border #E2E8F0 / #334155 · cornerRadius 12
    <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl overflow-hidden transition-colors duration-200">
      {/* Título — pen: wcwRS "Lista de Pacientes" */}
      <div className="px-4 py-4 sm:px-5 border-b border-[#E2E8F0] dark:border-[#334155]">
        <h2 className="text-base font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          Lista de Pacientes
        </h2>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-4 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && patients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8] dark:text-[#64748B]">
          <Users size={40} className="mb-3 opacity-40" />
          <p className="text-sm">Nenhum paciente encontrado</p>
        </div>
      )}

      {/* Tabela — pen: CYc32 header · #F1F5F9 light · #263548 dark */}
      {!isLoading && patients.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm sm:min-w-0">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#334155] bg-[#F1F5F9] dark:bg-[#263548]">
                {["Nome", "CPF", "Telefone", "Última Consulta", ""].map((col, i) => (
                  <th
                    key={i}
                    className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-[#475569] dark:text-[#94A3B8] ${
                      i === 1 ? "hidden md:table-cell" :
                      i === 2 ? "hidden lg:table-cell" :
                      i === 3 ? "hidden xl:table-cell" : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
