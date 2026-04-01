import { Header } from "../../components/Dashboard/Header";
import { ConsultasHojeCard } from "../../components/Dashboard/Cards/ConsultasHojeCard";
import { NovosPacientesCard } from "../../components/Dashboard/Cards/NovosPacientesCard";
import { ProximoAtendimentoCard } from "../../components/Dashboard/Cards/ProximoAtendimentoCard";
import { AgendaTable } from "../../components/Dashboard/AgendaTable";

export default function DashboardPage() {
  return (
    // bg: #F5F6FA light · #0F172A dark (pen: Km2zu)
    <main className="flex-1 bg-[#F5F6FA] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8">
        <Header isSearchAvaliable={true} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
          <ConsultasHojeCard total={12} />
          <NovosPacientesCard total={4} />
          <ProximoAtendimentoCard paciente="João M." horario="14:30" />
        </div>

        <AgendaTable />
      </div>
    </main>
  );
}
