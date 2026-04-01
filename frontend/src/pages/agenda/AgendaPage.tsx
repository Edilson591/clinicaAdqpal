import { useState } from "react";
import { AgendaHeader } from "../../components/Agenda/AgendaHeader";
import { CalendarWeek } from "../../components/Agenda/CalendarWeek";
import { ScheduleList } from "../../components/Agenda/ScheduleList";
import { useAppointments } from "../../hooks/useAppointments";
import { useCalendar } from "../../hooks/useCalendar";

function AgendaContent() {
  const [newDate, setNewDate] = useState<Date | null>(new Date());
  const { data: appointments = [], isLoading } = useAppointments();
  const {isSameDay} = useCalendar();
  
  // filtra pra consultas de hoje 

  const appontmentToday = appointments.filter((appt) => {
    return isSameDay(new Date(appt.scheduledAt), new Date())
  })


  return (
    // pen: EEQUK · bg #F8FAFC light · #0F172A dark · padding 32 · gap 24
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header — pen: qw4ZJ */}
        <AgendaHeader totalHoje={appontmentToday.length} />

        {/* Calendário semanal — pen: 7DMyy */}
        <CalendarWeek onDateChange={(date) => setNewDate(date)} />

        {/* Lista de consultas — pen: ysozS */}
        {newDate && (
          <ScheduleList
            date={newDate}
            appointments={appointments}
            isLoading={isLoading}
          />
        )}
      </div>
    </main>
  );
}

export default function AgendaPage() {
  return <AgendaContent />;
}
