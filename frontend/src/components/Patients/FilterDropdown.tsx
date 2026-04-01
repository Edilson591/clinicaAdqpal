import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type FilterOption = { label: string; value: string };

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      {/* Trigger — pen: Vd0Tk · h:44, bg #FFFFFF/#1E293B, border #E2E8F0/#334155 */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 h-11 px-3 rounded-lg text-sm border bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] hover:opacity-80 transition-colors whitespace-nowrap cursor-pointer"
      >
        {/* Label — pen: 0X36j "Cadastro:" · #94A3B8 light · #64748B dark */}
        <span className="text-xs text-[#94A3B8] dark:text-[#64748B]">{label}:</span>

        {/* Valor selecionado — pen: qSw2Q · #475569 light · #CBD5E1 dark */}
        <span className="text-[#475569] dark:text-[#CBD5E1]">
          {selected ? selected.label : "Todos"}
        </span>

        {/* Chevron — pen: X9r3t · 16×16 */}
        <ChevronDown
          size={14}
          className={`text-[#94A3B8] dark:text-[#64748B] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 rounded-lg shadow-xl min-w-36 overflow-hidden border bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                option.value === value
                  ? "bg-[#E8F5E9] dark:bg-[#1E3A2F] text-[#38A169]"
                  : "text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-[#263548]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
