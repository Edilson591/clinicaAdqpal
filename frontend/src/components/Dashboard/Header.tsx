import { Search, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { MenuSidebar } from "../Sidebar/MenuSidebar";

// =============================================================================
// TYPES
// =============================================================================

type propsHeader = {
  isSearchAvaliable?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
};

export function Header({ isSearchAvaliable, search, onSearchChange }: propsHeader) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const greeting = user ? `Olá, Dr. ${user.username}` : "Olá!";

  return (
    <div className="flex items-center justify-between shrink-0 mb-6">
      {/* Left: toggle + greeting */}
      <div className="flex items-center gap-3 min-w-0">
        <MenuSidebar />

        <div className="flex items-center gap-1.5 min-w-0">
          <h1 className="text-lg font-semibold text-[#1C2B3A] dark:text-[#F1F5F9] truncate">
            {greeting}
          </h1>
          {/* <ChevronDown
            size={16}
            className="text-[#9CA3AF] dark:text-[#64748B] shrink-0"
          /> */}
        </div>
      </div>

      {/* Right: search + theme toggle */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search — oculto no mobile */}
        {isSearchAvaliable && (
          <div className="relative hidden sm:block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#64748B]"
            />
            <input
              type="text"
              placeholder="Buscar (PX, CPF, ...)"
              value={search ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-70 lg:w-[320px] h-10 pl-9 pr-4 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-lg text-sm text-[#374151] dark:text-[#F1F5F9] placeholder:text-[#9CA3AF] dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#38A169] focus:ring-1 focus:ring-[#38A169] transition-colors"
            />
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? "Modo claro" : "Modo escuro"}
          className="flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-medium border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#6B7280] dark:text-[#94A3B8] hover:opacity-80 transition-all cursor-pointer"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span className="hidden md:inline">
            {isDark ? "Claro" : "Escuro"}
          </span>
        </button>
      </div>
    </div>
  );
}
