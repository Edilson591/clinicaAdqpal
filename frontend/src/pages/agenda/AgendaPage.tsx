import { useState } from "react";
import { AgendaHeader } from "../../components/Agenda/AgendaHeader";
import { CalendarWeek } from "../../components/Agenda/CalendarWeek";
import { ScheduleList } from "../../components/Agenda/ScheduleList";
import { Pagination } from "../../components/ui/Pagination";
import { useAppointmentsToday } from "../../hooks/useAppointments";
import { useAgendaPage } from "../../hooks/useAgendaPage";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../types/roles";

// =============================================================================
// AGENDA PAGE
// =============================================================================

function AgendaContent() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const userId = user?.roleId === USER_ROLES.DOCTOR ? user?.id : undefined;

  const { appointments, totalPages, isLoading, search, setSearch } = useAgendaPage(
    page,
    setPage,
    date,
    userId,
  );

  const { data: todayAll = [] } = useAppointmentsToday();
  const totalHoje = user?.roleId === USER_ROLES.DOCTOR
    ? todayAll.filter((a) => a.userId === user?.id).length
    : todayAll.length;

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setPage(1);
  };

  return (
    // pen: EEQUK · bg #F8FAFC light · #0F172A dark · padding 32 · gap 24
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header — pen: qw4ZJ */}
        <AgendaHeader totalHoje={totalHoje} search={search} onSearchChange={setSearch} />

        {/* Calendário semanal — oculto durante busca ativa */}
        {!search && <CalendarWeek onDateChange={handleDateChange} />}

        {/* Resultado da busca */}
        {search && (
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B] -mt-4">
            {appointments.length} resultado{appointments.length !== 1 ? "s" : ""} para
            &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Lista de consultas — pen: ysozS */}
        <ScheduleList
          date={date ?? new Date()}
          appointments={appointments}
          isLoading={isLoading}
          search={search}
        />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </main>
  );
}

export default function AgendaPage() {
  return <AgendaContent />;
}
