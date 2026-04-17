import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import type { EmployeeRow, StatusFilter } from "../../hooks/useRhPage";

interface RhTableProps {
  rows: EmployeeRow[];
  isLoading: boolean;
  statusFilter: StatusFilter;
  onStatusFilter: (s: StatusFilter) => void;
  confirmDeleteId: string | null;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  ACTIVE:     { label: "Ativo",       className: "bg-[#F0FFF4] text-[#38A169]" },
  ON_LEAVE:   { label: "Em Licença",  className: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
  INACTIVE:   { label: "Inativo",     className: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
  TERMINATED: { label: "Desligado",   className: "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400" },
};

// const TABS: { label: string; value: StatusFilter }[] = [
//   { label: "Todos",       value: "" },
//   { label: "Ativos",      value: "ACTIVE" },
//   { label: "Em Licença",  value: "ON_LEAVE" },
//   { label: "Desligados",  value: "TERMINATED" },
// ];

export function RhTable({
  rows,
  isLoading,
  // statusFilter,
  // onStatusFilter,
  confirmDeleteId,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  isDeleting,
}: RhTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] overflow-hidden flex flex-col">
      {/* Topo: filtros por tab */}
      {/* <div className="flex items-center justify-between gap-3 px-5 py-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {TABS.map((tab) => (
            <Button
              key={tab.value}
              onClick={() => onStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-[#3182CE] text-white"
                  : "bg-[#F1F5F9] dark:bg-[#263548] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#334155]"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div> */}

      <div className="h-px bg-[#E2E8F0] dark:bg-[#334155]" />

      <div className="overflow-x-auto flex-1">
        {isLoading ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-[#0F172A]">
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-55">Funcionário</th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-40">Cargo</th>
                <th className="hidden md:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-37.5">Departamento</th>
                <th className="hidden lg:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-32.5">Admissão</th>
                <th className="hidden lg:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-32.5">Salário</th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-30">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8]">Ações</th>
              </tr>
              <tr><td colSpan={7}><div className="h-px bg-[#E2E8F0] dark:bg-[#334155]" /></td></tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#334155]">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse h-15">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#E2E8F0] dark:bg-[#334155] shrink-0" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-3.5 w-32 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                        <div className="h-3 w-24 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="h-4 w-28 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="hidden md:table-cell px-5 py-3">
                    <div className="h-4 w-24 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3">
                    <div className="h-4 w-20 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3">
                    <div className="h-4 w-20 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="px-5 py-3">
                    <div className="h-5 w-16 bg-[#E2E8F0] dark:bg-[#334155] rounded-full" />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <div className="h-7 w-12 bg-[#E2E8F0] dark:bg-[#334155] rounded-md" />
                      <div className="h-7 w-16 bg-[#E2E8F0] dark:bg-[#334155] rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : rows.length === 0 ? (
          <div className="flex justify-center p-12">
            <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">Nenhum funcionário encontrado.</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-[#0F172A]">
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-55">Funcionário</th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-40">Cargo</th>
                <th className="hidden md:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-37.5">Departamento</th>
                <th className="hidden lg:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-32.5">Admissão</th>
                <th className="hidden lg:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-32.5">Salário</th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-30">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8]">Ações</th>
              </tr>
              <tr><td colSpan={7}><div className="h-px bg-[#E2E8F0] dark:bg-[#334155]" /></td></tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#334155]">
              {rows.map((emp) => {
                const badge = STATUS_BADGE[emp.status] ?? STATUS_BADGE.INACTIVE;
                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]/50 transition-colors h-15"
                  >
                    {/* Funcionário */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0">
                          <span className="text-[#3182CE] text-xs font-bold">{emp.initials}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#1E293B] dark:text-[#F1F5F9] truncate">{emp.name}</p>
                          {emp.email && (
                            <p className="text-xs text-[#94A3B8] truncate">{emp.email}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cargo */}
                    <td className="px-5 py-3 text-sm text-[#1E293B] dark:text-[#F1F5F9]">{emp.position}</td>

                    {/* Departamento */}
                    <td className="hidden md:table-cell px-5 py-3 text-sm text-[#1E293B] dark:text-[#F1F5F9]">
                      {emp.department ?? "—"}
                    </td>

                    {/* Admissão */}
                    <td className="hidden lg:table-cell px-5 py-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
                      {emp.hireDate ?? "—"}
                    </td>

                    {/* Salário */}
                    <td className="hidden lg:table-cell px-5 py-3 text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                      {emp.salary != null
                        ? `R$ ${emp.salary.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="px-5 py-3">
                      {confirmDeleteId === emp.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="hidden sm:inline text-xs text-[#64748B]">Confirmar?</span>
                          <Button
                            variant="ghost"
                            onClick={onConfirmDelete}
                            disabled={isDeleting}
                            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                          >
                            {isDeleting ? "..." : "Sim"}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={onCancelDelete}
                            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] hover:bg-[#F3F4F6] dark:hover:bg-[#263548]"
                          >
                            Não
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => navigate(`/rh/${emp.id}/editar`)}
                            className="px-3 py-1.5 text-xs font-medium rounded-md border border-[#38A169] text-[#38A169] hover:bg-[#E6F5ED] dark:hover:bg-[#1E3A2F]"
                          >
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => onRequestDelete(emp.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded-md border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Excluir
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
