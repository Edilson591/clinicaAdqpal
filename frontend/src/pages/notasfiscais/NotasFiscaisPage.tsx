import { useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import { Pagination } from "../../components/ui/Pagination";
import { usePatients } from "../../hooks/usePatients";
import { useNotasFiscaisPage } from "../../hooks/useNotasFiscais";
import { NotasFiscaisStats } from "./NotasFiscaisStats";
import { NotasFiscaisTable } from "./NotasFiscaisTable";
import { NovaNotaFiscalModal } from "./NovaNotaFiscalModal";
import { NotaFiscalViewer } from "./NotaFiscalViewer";
import { SearchableSelectGroup } from "../../components/ui/SearchableSelect";




const STATUS_OPTIONS = [
  { label: "Todas", value: "" },
  { label: "Emitida", value: "EMITIDA" },
  { label: "Pendente", value: "PENDENTE" },
  { label: "Cancelada", value: "CANCELADA" },
];

export default function NotasFiscaisPage() {
  const {
    notas,
    pagination,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    stats,
    confirmDeleteId,
    requestDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,
    confirmEmitirId,
    requestEmitir,
    cancelEmitir,
    confirmEmitir,
    isEmitindo,
    confirmCancelarId,
    requestCancelar,
    cancelCancelar,
    confirmCancelar,
    isCancelando,
    viewerNF,
    openViewer,
    closeViewer,
  } = useNotasFiscaisPage();

  const { data: patients = [] } = usePatients();
  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((p) => [p.id, p.name])),
    [patients],
  );
  const patientDetailsMap = useMemo(
    () =>
      Object.fromEntries(
        patients.map((p) => [p.id, { name: p.name, cpf: p.cpf }]),
      ),
    [patients],
  );

  return (
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <Header />

        {/* Título + ações */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Notas Fiscais
            </h1>
            <p className="text-sm text-[#94A3B8] dark:text-[#64748B] mt-1">
              Emissão e controle de notas fiscais
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setModalOpen(true)}
            className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-10 px-4 flex items-center gap-2 shrink-0"
          >
            <Plus size={16} />
            Emitir NF
          </Button>
        </div>

        {/* KPI Cards */}
        <NotasFiscaisStats
          totalEmitidas={stats.totalEmitidas}
          valorTotal={stats.valorTotal}
          totalPendentes={stats.totalPendentes}
          totalCanceladas={stats.totalCanceladas}
          isLoading={stats.isLoading}
        />

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Buscar nota fiscal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 max-w-sm text-sm rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38A169]/40"
            />
          </div>
          <div className="w-full sm:w-56">
            <SearchableSelectGroup
              placeholder="Todos os status"
              className="max-w-96"
              classNameChildren="h-11 bg-white dark:bg-[#1E293B]"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as typeof statusFilter)}
            />
          </div>
        </div>

        {/* Resultado de busca */}
        {search && !isLoading && (
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B] -mt-3">
            {pagination?.total ?? 0} resultado
            {(pagination?.total ?? 0) !== 1 ? "s" : ""} para &ldquo;{search}
            &rdquo;
          </p>
        )}

        {/* Tabela */}
        <NotasFiscaisTable
          notas={notas}
          isLoading={isLoading}
          patientMap={patientMap}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          confirmDeleteId={confirmDeleteId}
          onRequestDelete={requestDelete}
          onCancelDelete={cancelDelete}
          onConfirmDelete={confirmDelete}
          isDeleting={isDeleting}
          confirmEmitirId={confirmEmitirId}
          onRequestEmitir={requestEmitir}
          onCancelEmitir={cancelEmitir}
          onConfirmEmitir={confirmEmitir}
          isEmitindo={isEmitindo}
          confirmCancelarId={confirmCancelarId}
          onRequestCancelar={requestCancelar}
          onCancelCancelar={cancelCancelar}
          onConfirmCancelar={confirmCancelar}
          isCancelando={isCancelando}
          onViewNF={openViewer}
        />

        {/* Paginação */}
        <Pagination
          currentPage={page}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>

      {/* Modal nova NF */}
      <NovaNotaFiscalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Viewer NFS-e */}
      {viewerNF && (
        <NotaFiscalViewer
          nf={viewerNF}
          patient={
            patientDetailsMap[viewerNF.patientId] ?? { name: "—", cpf: null }
          }
          onClose={closeViewer}
        />
      )}
    </main>
  );
}
