import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar paciente...",
}: SearchBarProps) {
  return (
    // pen: AqIc8 · h:44, bg #FFFFFF light · #1E293B dark · border #E2E8F0 / #334155
    <div className="relative w-full flex-1 sm:max-w-sm">
      <Search
        size={15}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8] dark:text-[#64748B]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-8 rounded-lg text-sm border bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#38A169] focus:border-[#38A169] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-[#64748B] hover:opacity-70 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
