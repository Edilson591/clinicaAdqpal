import { Palette, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Toggle } from "./Toggle";

export function PreferenciasSection() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Palette size={18} className="text-[#38A169]" />
        <h2 className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          Preferências
        </h2>
      </div>

      {/* Tema */}
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">Tema da interface</p>
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B] mt-0.5">
            {isDark ? "Modo escuro ativado" : "Modo claro ativado"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Sun size={16} className={!isDark ? "text-[#38A169]" : "text-[#94A3B8]"} />
          <Toggle checked={isDark} onChange={toggleTheme} ariaLabel="Alternar tema" />
          <Moon size={16} className={isDark ? "text-[#38A169]" : "text-[#94A3B8]"} />
        </div>
      </div>
    </section>
  );
}
