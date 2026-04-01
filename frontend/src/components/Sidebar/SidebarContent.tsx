import { NavLink } from "react-router-dom";
import type { UserResponse } from "../../types/api";
import { navItems } from "../Dashboard/Sidebar";
import UserSection from "./UserSection";
import { cn } from "../../lib/utils";
import logo from "../../../public/logo-adqpal.png";

interface SidebarContentProps {
  expanded: boolean;
  user: UserResponse | null;
  logout: () => void;
}

function SidebarContent({ expanded, user, logout }: SidebarContentProps) {
  return (
    <>
      {/* Logo */}
      <div
        className={`flex items-center px-6 shrink-0 ${!expanded && "justify-center"}`}
      >
        <div className="flex items-center justify-center  rounded-lg px-3 py-2 min-w-10 transition-all duration-300">
          <span className="text-white font-bold text-sm tracking-wide whitespace-nowrap">
            {/* {expanded ? "ADQPAL" : "A"} */}
            <img src={logo} className="m-auto bg-white rounded-[7px] transition-all duration-300 hover:scale-105" alt="logo adqpal" />
          </span>
        </div>
      </div>

      {/* Divider — pen: vMMpr · #E5E7EB light · #334155 dark */}
      <div className="mx-4 h-px bg-[#E5E7EB] dark:bg-[#334155] shrink-0" />

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-hidden">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.75 rounded-lg transition-colors",
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
        ))}
      </nav>

      {/* Divider acima do user — pen: vMMpr */}
      <div className="mx-4 h-px bg-[#E5E7EB] dark:bg-[#334155] shrink-0 mb-3" />

      {user && <UserSection user={user} expanded={expanded} logout={logout} />}
    </>
  );
}

export default SidebarContent;
export { SidebarContent };
