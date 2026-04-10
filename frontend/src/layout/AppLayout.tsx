import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../context/useSidebarContext";
import { PermissionsProvider } from "../context/PermissionsProvider";
import { Sidebar } from "../components/Sidebar";

export default function AppLayout() {
  return (
    <PermissionsProvider>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar — segue o tema global */}
          <Sidebar />
          <Outlet />
        </div>
      </SidebarProvider>
    </PermissionsProvider>
  );
}
