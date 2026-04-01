import { useAuth } from "../../context/AuthContext";
import { useSidebarContext } from "../../context/useSidebarContext";
import { cn } from "../../lib/utils";
import SidebarContent from "./SidebarContent";

export function Sidebar() {
  const { isOpen, isHovered, isMobileOpen, hoverSidebar, closeMobile } =
    useSidebarContext();
  const { user, logout } = useAuth();

  const expanded = isOpen || isHovered;

  return (
    <>
      {/* Backdrop mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-300",
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={closeMobile}
      />

      {/* Desktop sidebar — pen: D308G · bg #FFFFFF light · #1C2B3A dark */}
      <aside
        style={{ width: expanded ? 260 : 74 }}
        className="hidden lg:flex h-screen flex-col bg-white dark:bg-[#1C2B3A] border-r border-[#E5E7EB] dark:border-[#334155] transition-[width,background-color] duration-300 ease-in-out shrink-0 overflow-visible relative"
        onMouseEnter={() => !isOpen && hoverSidebar(true)}
        onMouseLeave={() => hoverSidebar(false)}
      >
        <SidebarContent expanded={expanded} user={user} logout={logout} />
      </aside>

      {/* Mobile drawer — fixed overlay */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-65 flex flex-col bg-white dark:bg-[#1C2B3A] border-r border-[#E5E7EB] dark:border-[#334155] z-40",
          "transition-transform duration-300 lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent expanded={true} user={user} logout={logout} />
      </aside>
    </>
  );
}
