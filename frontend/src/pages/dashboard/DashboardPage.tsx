import { useState } from "react";
import { Header } from "../../components/Dashboard/Header";
import { ConsultasHojeCard } from "../../components/Dashboard/Cards/ConsultasHojeCard";
import { NovosPacientesCard } from "../../components/Dashboard/Cards/NovosPacientesCard";
import { ProximoAtendimentoCard } from "../../components/Dashboard/Cards/ProximoAtendimentoCard";
import { AgendaTable } from "../../components/Dashboard/AgendaTable";
import { useDashboard } from "../../hooks/useDashboard";

export default function DashboardPage() {
  const { consultasHoje, agendaDoDia, proximoAtendimento, isLoading } = useDashboard();
  const [search, setSearch] = useState("");

  const filteredAgenda = search.trim()
    ? agendaDoDia.filter((item) =>
        item.paciente.toLowerCase().includes(search.toLowerCase()),
      )
    : agendaDoDia;

  return (
    // bg: #F5F6FA light · #0F172A dark (pen: Km2zu)
    <main className="flex-1 bg-[#F5F6FA] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8">
        <Header isSearchAvaliable={true} search={search} onSearchChange={setSearch} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
          <ConsultasHojeCard total={consultasHoje} />
          <NovosPacientesCard total={0} />
          <ProximoAtendimentoCard
            paciente={proximoAtendimento?.paciente ?? "—"}
            horario={proximoAtendimento?.horario ?? "—"}
          />
        </div>

        <AgendaTable appointments={filteredAgenda} isLoading={isLoading} search={search} />
      </div>
    </main>
  );
}
