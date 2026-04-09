import { useState } from "react";
import { Header } from "../../components/Dashboard/Header";
import { ConsultasHojeCard } from "../../components/Dashboard/Cards/ConsultasHojeCard";
import { NovosPacientesCard } from "../../components/Dashboard/Cards/NovosPacientesCard";
import { ProximoAtendimentoCard } from "../../components/Dashboard/Cards/ProximoAtendimentoCard";
import { AgendaTable } from "../../components/Dashboard/AgendaTable";
import { Pagination } from "../../components/ui/Pagination";
import { useDashboard } from "../../hooks/useDashboard";
import { usePatientsCountToday } from "../../hooks/usePatients";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const today = new Date();

  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const date = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  const { agendaDoDia, totalPages, total: consultasHoje, isLoading, search, setSearch, proximoAtendimento } =
    useDashboard(page, setPage, date);

  const { data: novosPacientes = 0 } = usePatientsCountToday();

  return (
    // bg: #F5F6FA light · #0F172A dark (pen: Km2zu)
    <main className="flex-1 bg-[#F5F6FA] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8">
        <Header
          isSearchAvaliable={true}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
          <ConsultasHojeCard total={consultasHoje} />
          <NovosPacientesCard total={novosPacientes} />
          <ProximoAtendimentoCard
            paciente={proximoAtendimento?.paciente ?? "—"}
            horario={proximoAtendimento?.horario ?? "—"}
          /> 
        </div>

        <AgendaTable
          appointments={agendaDoDia}
          isLoading={isLoading}
          search={search}
        />

        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </main>
  );
}
