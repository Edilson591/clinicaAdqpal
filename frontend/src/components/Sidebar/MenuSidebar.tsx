import { Menu } from "lucide-react";
import { useSidebarContext } from "../../context/useSidebarContext";

export const MenuSidebar = () => {
  const { toggleSidebar, toggleMobile } = useSidebarContext();
  return (
    <>
      <button
        onClick={toggleMobile}
        className="p-1.5 rounded-lg text-[#6B7280] hover:bg-white dark:text-[#94A3B8] dark:hover:bg-[#263548] hover:shadow-sm transition-all lg:hidden cursor-pointer"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded-lg text-[#6B7280] hover:bg-white dark:text-[#94A3B8] dark:hover:bg-[#263548] hover:shadow-sm transition-all hidden lg:flex cursor-pointer"
        aria-label="Alternar sidebar"
      >
        <Menu size={20} />
      </button>
    </>
  );
};
