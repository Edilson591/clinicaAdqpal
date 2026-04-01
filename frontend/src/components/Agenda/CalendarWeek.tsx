import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useCalendar } from "../../hooks/useCalendar";

type ViewMode = "semana" | "mes";

type CalendarWeekProps = {
  onDateChange?: (date: Date) => void;
};

export function CalendarWeek({ onDateChange }: CalendarWeekProps) {
  const { DIAS_GRID, formatMonthYear, getMonthGrid, isSameDay, getWeekDays } =
    useCalendar();

  const today = new Date();
  const [anchor, setAnchor] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState<ViewMode>("semana");

  function prevPeriod() {
    const d = new Date(anchor);
    if (view === "semana") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setAnchor(d);
  }

  function nextPeriod() {
    const d = new Date(anchor);
    if (view === "semana") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setAnchor(d);
  }

  function handleSelect(date: Date) {
    setSelectedDate(date);
    onDateChange?.(date);
  }

  const weekDays = getWeekDays(anchor);
  const monthCells = getMonthGrid(anchor);
  const monthRows = Array.from({ length: monthCells.length / 7 }, (_, i) =>
    monthCells.slice(i * 7, i * 7 + 7),
  );

  function dayBtnClass(date: Date, isCurrentMonth = true) {
    const sel = isSameDay(date, selectedDate);
    const tod = isSameDay(date, today);
    if (sel) return "bg-[#38A169] text-white rounded-xl";
    if (tod)
      return "bg-[#E8F5E9] dark:bg-[#1E3A2F] text-[#38A169] ring-2 ring-[#38A169] rounded-xl";
    if (!isCurrentMonth)
      return "opacity-30 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#263548]";
    return "hover:bg-[#F1F5F9] dark:hover:bg-[#263548] rounded-xl";
  }

  function numClass(date: Date, isCurrentMonth = true) {
    const sel = isSameDay(date, selectedDate);
    const tod = isSameDay(date, today);
    if (sel) return "text-white";
    if (tod) return "text-[#38A169]";
    if (!isCurrentMonth) return "text-[#94A3B8] dark:text-[#475569]";
    return "text-[#1E293B] dark:text-[#F1F5F9]";
  }

  return (
    <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-6 transition-colors duration-200">
      {/* Nav bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-0 md:gap-2">
          <button
            onClick={prevPeriod}
            className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#263548] transition-colors cursor-pointer"
            aria-label="Período anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9] min-w-40 text-center">
            {formatMonthYear(anchor)}
          </span>
          <button
            onClick={nextPeriod}
            className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#263548] transition-colors cursor-pointer"
            aria-label="Próximo período"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Toggle Semana / Mês */}
        <div className="flex gap-1 p-1 rounded-lg bg-[#F1F5F9] dark:bg-[#263548]">
          {(["semana", "mes"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`h-7 px-4 rounded-md text-xs font-medium transition-all cursor-pointer ${
                view === v
                  ? "bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F1F5F9] shadow-sm"
                  : "text-[#64748B] dark:text-[#94A3B8]"
              }`}
            >
              {v === "semana" ? "Semana" : "Mês"}
            </button>
          ))}
        </div>
      </div>

      {/* ── WEEK VIEW ── */}
      {view === "semana" && (
        <div className="grid grid-cols-5 gap-3">
          {weekDays.map(({ label, date }) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            return (
              <button
                key={label}
                onClick={() => handleSelect(date)}
                className={`flex flex-col items-center justify-center gap-1 h-20 transition-all cursor-pointer ${dayBtnClass(date)}`}
              >
                <span
                  className={`text-sm ${
                    isSelected
                      ? "text-white"
                      : isToday
                        ? "text-[#38A169]"
                        : "text-[#64748B] dark:text-[#94A3B8]"
                  }`}
                >
                  {label}
                </span>
                <span className={`text-2xl font-semibold ${numClass(date)}`}>
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── MONTH VIEW ── */}
      {view === "mes" && (
        <div>
          {/* Day-of-week header */}
          <div className="grid grid-cols-7 mb-2">
            {DIAS_GRID.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold text-[#94A3B8] dark:text-[#64748B] py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex flex-col gap-1">
            {monthRows.map((week, ri) => (
              <div key={ri} className="grid grid-cols-7 gap-1">
                {week.map(({ date, isCurrentMonth }, di) => (
                  <button
                    key={di}
                    onClick={() => handleSelect(date)}
                    className={`flex items-center justify-center h-10 text-sm font-medium transition-all cursor-pointer ${dayBtnClass(date, isCurrentMonth)}`}
                  >
                    <span className={numClass(date, isCurrentMonth)}>
                      {date.getDate()}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
