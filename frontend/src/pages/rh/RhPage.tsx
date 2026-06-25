import { Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import { SearchableSelectGroup } from "../../components/ui/SearchableSelect";
import { useRhPage } from "../../hooks/useRhPage";
import { RhStats } from "./RhStats";
import { RhTable } from "./RhTable";

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "ACTIVE", label: "Ativo" },
  { value: "ON_LEAVE", label: "Em Licença" },
  { value: "INACTIVE", label: "Inativo" },
  { value: "TERMINATED", label: "Desligado" },
];

export default function RhPage() {
  const navigate = useNavigate();
  const {
    rows,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    total,
    totalAtivos,
    totalLicenca,
    totalDesligados,
    novosEsteMes,
    confirmDeleteId,
    requestDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,
    error,
  } = useRhPage();

  return (
    <main className="flex-1 min-w-0 relative dark:bg-[#0F172A] overflow-y-auto">
      <div className="absolute inset-0 bg-[url('/bg-fundo.jpeg')] bg-no-repeat bg-cover bg-center opacity-10 z-[-1] dark:bg-none" />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <Header />

        {/* Título */}
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Recursos Humanos
            </h1>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
              Gerencie os funcionários da clínica
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/rh/novo")}
            className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-10 px-4 flex items-center justify-center gap-2 shrink-0"
          >
            <UserPlus size={16} />
            Novo Funcionário
          </Button>
        </div>

        {/* Stats */}
        <RhStats
          total={total}
          totalAtivos={totalAtivos}
          totalLicenca={totalLicenca}
          totalDesligados={totalDesligados}
          novosEsteMes={novosEsteMes}
        />

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Buscar funcionário..."
              id="searchRh"
              name="rhInput"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 sm:max-w-sm py-2.5 text-sm rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38A169]/40"
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

        {/* Tabela com filtros internos */}
        <RhTable
          rows={rows}
          isLoading={isLoading}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          confirmDeleteId={confirmDeleteId}
          onRequestDelete={requestDelete}
          onCancelDelete={cancelDelete}
          onConfirmDelete={confirmDelete}
          isDeleting={isDeleting}
        />
        {error && (
          <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 transition-colors">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error?.message}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
