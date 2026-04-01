export function useCalendar() {
  const DIAS_SEMANA_CURTOS = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const DIAS_GRID = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  function getWeekDays(baseDate: Date) {
    const day = baseDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + diff);

    return DIAS_SEMANA_CURTOS.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { label, date: d };
    });
  }

  function getMonthGrid(baseDate: Date) {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Mon-based week start (Mon=0 … Sun=6)
    const startDow = (firstDay.getDay() + 6) % 7;

    const cells: { date: Date; isCurrentMonth: boolean }[] = [];

    // Pad with prev-month days
    for (let i = startDow - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      cells.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    // Pad to complete last row
    const tail = cells.length % 7;
    if (tail !== 0) {
      for (let i = 1; i <= 7 - tail; i++) {
        cells.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        });
      }
    }

    return cells;
  }

  function formatMonthYear(date: Date) {
    const s = date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  return {
    DIAS_SEMANA_CURTOS,
    DIAS_GRID,
    getWeekDays,
    getMonthGrid,
    formatMonthYear,
    isSameDay,
  };
}
