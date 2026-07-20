import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import type { UserResponse } from "../../types/api";
import { navItems } from "../Dashboard/Sidebar";
import { usePermissions } from "../../context/PermissionsContext";
import UserSection from "./UserSection";
import { cn } from "../../lib/utils";
import logo from "../../../public/logo-adqpal.png";
import { ContentLogo } from "../ui/ContentLogo";

interface SidebarContentProps {
  expanded: boolean;
  user: UserResponse | null;
  logout: () => void;
}

function SidebarContent({ expanded, user, logout }: SidebarContentProps) {
  const { pathname } = useLocation();
  const { canAccessDocumentos, canAccessFinanceiro, canAccessRh } = usePermissions();

  // Inicializa aberto se algum filho estiver ativo
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.children?.some((c) => pathname.startsWith(c.path))) {
        initial[item.path] = true;
      }
    });
    return initial;
  });

  const toggleMenu = (path: string) => {
    setOpenMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <>
      {/* Logo */}
      <div
        className={`flex items-center px-6 shrink-0 ${!expanded && "justify-center"}`}
      >
        <ContentLogo logo={logo} />
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[#E5E7EB] dark:bg-[#334155] shrink-0" />

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-hidden">
        {navItems
          .filter((item) => !item.adminOnly || canAccessDocumentos)
          .filter((item) => !item.financialOnly || canAccessFinanceiro)
          .filter((item) => !item.rhOnly || canAccessRh)
          .map(({ label, icon: Icon, path, children }) => {
          const hasChildren = !!children?.length;
          const isOpen = openMenus[path] ?? false;
          const isChildActive = children?.some((c) => pathname.startsWith(c.path)) ?? false;

          if (hasChildren) {
            return (
              <div key={path}>
                {/* Item pai com submenu */}
                <button
                  onClick={() => expanded && toggleMenu(path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer",
                    !expanded && "justify-center",
                    isChildActive
                      ? "bg-[#E6F5ED] text-[#38A169] dark:bg-[#1E3A2F] dark:text-[#38A169]"
                      : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] dark:text-[#94A3B8] dark:hover:bg-[#263548] dark:hover:text-[#F1F5F9]",
                  )}
                >
                  <Icon size={20} className="shrink-0" />
                  {expanded && (
                    <>
                      <span className="flex-1 text-sm font-medium whitespace-nowrap overflow-hidden text-left">
                        {label}
                      </span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </>
                  )}
                </button>

                {/* Sub-itens */}
                {expanded && isOpen && (
                  <div className="mt-0.5 flex flex-col gap-0.5">
                    {children.map(({ label: cLabel, icon: CIcon, path: cPath }) => (
                      <NavLink
                        key={cPath}
                        to={cPath}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 pl-10 pr-4 py-2 rounded-lg transition-colors text-sm",
                            isActive
                              ? "bg-[#E6F5ED] text-[#38A169] font-semibold dark:bg-[#1E3A2F] dark:text-[#38A169]"
                              : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] dark:text-[#94A3B8] dark:hover:bg-[#263548] dark:hover:text-[#F1F5F9]",
                          )
                        }
                      >
                        <CIcon size={15} className="shrink-0" />
                        <span className="whitespace-nowrap overflow-hidden">{cLabel}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Item simples sem filhos
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.75 rounded-lg transition-colors",
                  !expanded && "justify-center",
                  isActive
                    ? "bg-[#E6F5ED] text-[#38A169] dark:bg-[#1E3A2F] dark:text-[#38A169]"
                    : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] dark:text-[#94A3B8] dark:hover:bg-[#263548] dark:hover:text-[#F1F5F9]",
                )
              }
            >
              <Icon size={20} className="shrink-0" />
              {expanded && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  {label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider acima do user */}
      <div className="mx-4 h-px bg-[#E5E7EB] dark:bg-[#334155] shrink-0 mb-3" />

      {user && <UserSection user={user} expanded={expanded} logout={logout} />}
    </>
  );
}

export default SidebarContent;
export { SidebarContent };
