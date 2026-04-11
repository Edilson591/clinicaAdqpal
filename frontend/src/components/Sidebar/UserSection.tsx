import { ChevronUp, LogOut, UserCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserResponse } from "../../types/api";
import { useTheme } from "../../context/ThemeContext";

interface UserSectionProps {
  user: UserResponse;
  expanded: boolean;
  logout: () => void;
}

function UserSection({ user, expanded, logout }: UserSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { disabledTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative mx-3 mb-4 shrink-0">
      {/* Dropdown — aparece acima do user */}
      {expanded && menuOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-[#E5E7EB] dark:border-[#334155] overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[#F3F4F6] dark:border-[#334155]">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#F1F5F9] truncate">
              {user.username}
            </p>
            <p className="text-xs text-[#9CA3AF] dark:text-[#64748B] truncate">
              {user.email}
            </p>
          </div>

          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/perfil");
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#374151] dark:text-[#CBD5E1] hover:bg-[#F9FAFB] dark:hover:bg-[#263548] transition-colors cursor-pointer"
          >
            <UserCircle
              size={15}
              className="text-[#6B7280] dark:text-[#64748B]"
            />
            Perfil
          </button>

          <div className="h-px bg-[#F3F4F6] dark:bg-[#334155]" />

          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
              disabledTheme();
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>
      )}

      {/* Área do usuário */}
      <button
        onClick={() => expanded && setMenuOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150",
          "hover:bg-[#F3F4F6] dark:hover:bg-[#263548] group",
          menuOpen && "bg-[#F3F4F6] dark:bg-[#263548]",
          !expanded ? "justify-center cursor-default" : "cursor-pointer",
        )}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full bg-[#38A169] flex items-center justify-center shrink-0 transition-transform duration-150",
            expanded && "group-hover:scale-105",
          )}
        >
          <span className="text-white text-xs font-bold uppercase">
            {user.username.charAt(0)}
          </span>
        </div>

        {expanded && (
          <div className="overflow-hidden text-left flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#F1F5F9] truncate leading-tight">
              {user.username}
            </p>
            <p className="text-xs text-[#6B7280] dark:text-[#64748B] truncate leading-tight">
              Médico ·{" "}
              <span className="text-[#38A169] hover:underline">Sair</span>
            </p>
          </div>
        )}

        {expanded && (
          <ChevronUp
            size={14}
            className={cn(
              "text-[#9CA3AF] dark:text-[#64748B] shrink-0 transition-transform duration-200",
              menuOpen ? "rotate-0" : "rotate-180",
            )}
          />
        )}
      </button>
    </div>
  );
}

export default UserSection;
export { UserSection };
