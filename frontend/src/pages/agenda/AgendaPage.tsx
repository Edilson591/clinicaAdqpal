import { useState } from "react";
import { AgendaHeader } from "../../components/Agenda/AgendaHeader";
import { CalendarWeek } from "../../components/Agenda/CalendarWeek";
import { ScheduleList } from "../../components/Agenda/ScheduleList";
import { Pagination } from "../../components/ui/Pagination";
import { useAgendaPage } from "../../hooks/useAgendaPage";


// =============================================================================
// AGENDA PAGE
// =============================================================================

function AgendaContent() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [page, setPage] = useState(1);

  const {
    appointments,
    totalPages,
    isLoading,
    search,
    setSearch,
    total,
    doctorOptions,
    selectDoctor,
    setSelectDoctor,
  } = useAgendaPage(page, setPage, date);

  // const { data: todayAll = [] } = useAppointmentsToday();
  // const totalHoje =
  //   user?.roleId === USER_ROLES.DOCTOR
  //     ? todayAll.filter((a) => a.userId === user?.id).length
  //     : todayAll.length;

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setPage(1);
  };

  return (
    // pen: EEQUK · bg #F8FAFC light · #0F172A dark · padding 32 · gap 24
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header — pen: qw4ZJ */}
        <AgendaHeader
          totalHoje={total}
          search={search}
          onSearchChange={setSearch}
          doctorOptions={doctorOptions}
          selectDoctor={selectDoctor}
          setSelectDoctor={setSelectDoctor}
        />


        {/* <FilterDropdown
          label="Medico"
          options={filterOptions}
          // value={filter}
          // onChange={(v) => onFilterChange(v as PatientFilter)}
        /> */}

        {/* Calendário semanal — oculto durante busca ativa */}
        {!search && <CalendarWeek onDateChange={handleDateChange} />}

        {/* Resultado da busca */}
        {search && (
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B] -mt-4">
            {appointments.length} resultado
            {appointments.length !== 1 ? "s" : ""} para &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Lista de consultas — pen: ysozS */}
        <ScheduleList
          date={date ?? new Date()}
          appointments={appointments}
          isLoading={isLoading}
          search={search}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </main>
  );
}

export default function AgendaPage() {
  return <AgendaContent />;
}
