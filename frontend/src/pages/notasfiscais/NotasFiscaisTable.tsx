import { Download, FileX } from "lucide-react";
import { Button } from "../../components/ui/Button";
import type { NotaFiscalResponse, NotaFiscalStatus } from "../../types/api";
import type { NFStatusFilter } from "../../hooks/useNotasFiscais";

interface NotasFiscaisTableProps {
  notas: NotaFiscalResponse[];
  isLoading: boolean;
  patientMap: Record<string, string>;
  statusFilter: NFStatusFilter;
  onStatusFilter: (s: NFStatusFilter) => void;
  confirmDeleteId: string | null;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
  confirmEmitirId: string | null;
  onRequestEmitir: (id: string) => void;
  onCancelEmitir: () => void;
  onConfirmEmitir: () => void;
  isEmitindo: boolean;
  confirmCancelarId: string | null;
  onRequestCancelar: (id: string) => void;
  onCancelCancelar: () => void;
  onConfirmCancelar: () => void;
  isCancelando: boolean;
  onViewNF: (nf: NotaFiscalResponse) => void;
}

const STATUS_BADGE: Record<
  NotaFiscalStatus,
  { label: string; className: string }
> = {
  EMITIDA: {
    label: "Emitida",
    className: "bg-[#DCFCE7] text-[#16A34A]",
  },
  PENDENTE: {
    label: "Pendente",
    className: "bg-[#FEF3C7] text-[#D97706]",
  },
  CANCELADA: {
    label: "Cancelada",
    className: "bg-[#FEE2E2] text-[#DC2626]",
  },
};

// const TABS: { label: string; value: NFStatusFilter }[] = [
//   { label: "Todas", value: "" },
//   { label: "Emitida", value: "EMITIDA" },
//   { label: "Pendente", value: "PENDENTE" },
//   { label: "Cancelada", value: "CANCELADA" },
// ];

const SKELETON_COLS = 7;

export function NotasFiscaisTable({
  notas,
  isLoading,
  patientMap,
  // statusFilter,
  // onStatusFilter,
  confirmDeleteId,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  isDeleting,
  confirmEmitirId,
  onRequestEmitir,
  onCancelEmitir,
  onConfirmEmitir,
  isEmitindo,
  confirmCancelarId,
  onRequestCancelar,
  onCancelCancelar,
  onConfirmCancelar,
  isCancelando,
  onViewNF,
}: NotasFiscaisTableProps) {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] overflow-hidden flex flex-col">
      {/* Topo: tab filters */}
      {/* <div className="flex items-center gap-2 flex-wrap px-5 py-4">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => onStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-[#38A169] text-white"
                : "bg-[#F1F5F9] dark:bg-[#263548] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#334155]"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div> */}

      <div className="h-px bg-[#E2E8F0] dark:bg-[#334155]" />

      <div className="overflow-x-auto flex-1">
        {isLoading ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="dark:bg-[#0F172A]">
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-32.5">
                  Número
                </th>
                <th className="hidden md:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-27.5">
                  Data
                </th>
                <th className="hidden md:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-45">
                  Paciente
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Serviço
                </th>
                <th className="hidden lg:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-27.5">
                  Valor
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-27.5">
                  Status
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-32.5">
                  Ações
                </th>
              </tr>
              <tr>
                <td colSpan={SKELETON_COLS}>
                  <div className="h-px bg-[#E2E8F0] dark:bg-[#334155]" />
                </td>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#334155]">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse h-15">
                  <td className="px-5 py-3">
                    <div className="h-4 w-24 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="hidden md:table-cell px-5 py-3">
                    <div className="h-4 w-20 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="hidden md:table-cell px-5 py-3">
                    <div className="h-4 w-32 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="px-5 py-3">
                    <div className="h-4 w-40 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="hidden lg:table-cell px-5 py-3">
                    <div className="h-4 w-20 bg-[#E2E8F0] dark:bg-[#334155] rounded" />
                  </td>
                  <td className="px-5 py-3">
                    <div className="h-5 w-16 bg-[#E2E8F0] dark:bg-[#334155] rounded-full" />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <div className="h-7 w-14 bg-[#E2E8F0] dark:bg-[#334155] rounded-md" />
                      <div className="h-7 w-7 bg-[#E2E8F0] dark:bg-[#334155] rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : notas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#94A3B8] dark:text-[#64748B]">
            <FileX size={36} className="mb-3 opacity-40" />
            <p className="text-sm">Nenhuma nota fiscal encontrada</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className=" dark:bg-[#0F172A]">
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-32.5">
                  Número
                </th>
                <th className="hidden md:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-27.5">
                  Data
                </th>
                <th className="hidden md:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-45">
                  Paciente
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Serviço
                </th>
                <th className="hidden lg:table-cell text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-27.5">
                  Valor
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-27.5">
                  Status
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-[#64748B] dark:text-[#94A3B8] w-32.5">
                  Ações
                </th>
              </tr>
              <tr>
                <td colSpan={SKELETON_COLS}>
                  <div className="h-px bg-[#E2E8F0] dark:bg-[#334155]" />
                </td>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#334155]">
              {notas.map((nf) => {
                const badge = STATUS_BADGE[nf.status] ?? STATUS_BADGE.PENDENTE;
                const patientName = patientMap[nf.patientId] ?? "—";
                const data = new Date(nf.createdAt).toLocaleDateString("pt-BR");
                const valor = nf.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });

                const isConfirmingDelete = confirmDeleteId === nf.id;
                const isConfirmingEmitir = confirmEmitirId === nf.id;
                const isConfirmingCancelar = confirmCancelarId === nf.id;

                return (
                  <tr
                    key={nf.id}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]/50 transition-colors h-15"
                  >
                    {/* Número */}
                    <td className="px-5 py-3">
                      <span className="font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
                        {nf.numero}
                      </span>
                    </td>

                    {/* Data */}
                    <td className="hidden md:table-cell px-5 py-3 text-[#64748B] dark:text-[#94A3B8]">
                      {data}
                    </td>

                    {/* Paciente */}
                    <td className="hidden md:table-cell px-5 py-3 text-[#1E293B] dark:text-[#F1F5F9]">
                      {patientName}
                    </td>

                    {/* Serviço */}
                    <td className="px-5 py-3 text-[#64748B] dark:text-[#94A3B8] max-w-50 truncate">
                      {nf.servico}
                    </td>

                    {/* Valor */}
                    <td className="hidden lg:table-cell px-5 py-3 font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                      {valor}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="px-5 py-3">
                      {isConfirmingDelete ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="hidden sm:inline text-xs text-[#64748B]">
                            Excluir?
                          </span>
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
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] hover:bg-[#F3F4F6]"
                          >
                            Não
                          </Button>
                        </div>
                      ) : isConfirmingEmitir ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="hidden sm:inline text-xs text-[#64748B]">
                            Emitir?
                          </span>
                          <Button
                            variant="ghost"
                            onClick={onConfirmEmitir}
                            disabled={isEmitindo}
                            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#38A169] text-[#38A169] hover:bg-[#E6F5ED] disabled:opacity-50"
                          >
                            {isEmitindo ? "..." : "Sim"}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={onCancelEmitir}
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] hover:bg-[#F3F4F6]"
                          >
                            Não
                          </Button>
                        </div>
                      ) : isConfirmingCancelar ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="hidden sm:inline text-xs text-[#64748B]">
                            Cancelar?
                          </span>
                          <Button
                            variant="ghost"
                            onClick={onConfirmCancelar}
                            disabled={isCancelando}
                            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-red-500 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          >
                            {isCancelando ? "..." : "Sim"}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={onCancelCancelar}
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] hover:bg-[#F3F4F6]"
                          >
                            Não
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          {nf.status === "PENDENTE" && (
                            <Button
                              variant="ghost"
                              onClick={() => onRequestEmitir(nf.id)}
                              className="px-3 py-1.5 text-xs font-medium rounded-md border border-[#38A169] text-[#38A169] hover:bg-[#E6F5ED] dark:hover:bg-[#1E3A2F]"
                            >
                              Emitir
                            </Button>
                          )}
                          {nf.status === "EMITIDA" && (
                            <>
                              {nf.pdfUrl && (
                                <a
                                  href={nf.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#263548] transition-colors"
                                >
                                  <Download size={13} />
                                </a>
                              )}
                              <Button
                                variant="ghost"
                                onClick={() => onViewNF(nf)}
                                className="px-3 py-1.5 text-xs font-medium rounded-md border border-[#38A169] text-[#38A169] hover:bg-[#E6F5ED] dark:hover:bg-[#1E3A2F]"
                              >
                                Ver
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => onRequestCancelar(nf.id)}
                                className="px-3 py-1.5 text-xs font-medium rounded-md border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#263548]"
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                          {(nf.status === "PENDENTE" ||
                            nf.status === "CANCELADA") && (
                            <Button
                              variant="ghost"
                              onClick={() => onRequestDelete(nf.id)}
                              className="px-3 py-1.5 text-xs font-medium rounded-md border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Excluir
                            </Button>
                          )}
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
