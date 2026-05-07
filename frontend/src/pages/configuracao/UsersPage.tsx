import { Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import { SearchableSelectGroup } from "../../components/ui/SearchableSelect";
import { useUsersPage, ROLE_OPTIONS } from "../../hooks/useUsersPage";
import { UsersStats } from "./UsersStats";
import { UsersTable } from "./UsersTable";

export default function UsersPage() {
  const navigate = useNavigate();
  const {
    users,
    isLoading,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    total,
    totalAdmins,
    totalDoctors,
    totalReceptionists,
    confirmDeleteId,
    requestDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,
    error,
  } = useUsersPage();

  return (
    <main className="flex-1 relative dark:bg-[#0F172A] overflow-y-auto">
      <div className="absolute inset-0 bg-[url('/bg-fundo.jpeg')] bg-no-repeat bg-cover bg-center opacity-10 z-[-1] dark:bg-none" />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <Header />

        {/* Título */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Gerenciamento de Usuários
            </h1>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
              Visualize e gerencie os usuários do sistema
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/configuracoes/usuarios/novo")}
            className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-10 px-4 flex items-center gap-2 shrink-0"
          >
            <UserPlus size={16} />
            Novo Usuário
          </Button>
        </div>

        {/* Stats */}
        <UsersStats
          total={total}
          totalAdmins={totalAdmins}
          totalDoctors={totalDoctors}
          totalReceptionists={totalReceptionists}
        />

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Busca por nome / e-mail */}
          <div className="relative flex-1 min-w-0">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              id="searchUsers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 max-w-sm text-sm rounded-lg border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38A169]/40"
            />
          </div>

          {/* Filtro por perfil */}
          <div className="w-full sm:w-56">
            <SearchableSelectGroup
              // label="Médico"
              // error={errors.doctorId?.message}
              placeholder="Filtrar por perfil"
              className=" max-w-96"
              classNameChildren="h-11 bg-white dark:bg-[#1E293B]"
              options={ROLE_OPTIONS}
              value={roleFilter}
              onChange={setRoleFilter}
            />
          </div>
        </div>

        {/* Contagem de resultados */}
        {(search || roleFilter) && (
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B] -mt-3">
            {users.length} resultado{users.length !== 1 ? "s" : ""} encontrado
            {users.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Tabela */}
        <UsersTable
          users={users}
          isLoading={isLoading}
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
