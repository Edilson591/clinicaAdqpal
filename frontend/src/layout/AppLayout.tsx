import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../context/useSidebarContext";
import { Sidebar } from "../components/Sidebar";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar — segue o tema global */}
        <Sidebar />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
