import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../context/useSidebarContext";
import { PermissionsProvider } from "../context/PermissionsProvider";
import { Sidebar } from "../components/Sidebar";

export default function AppLayout() {
  return (
    <PermissionsProvider>
      <SidebarProvider>
        <div className="flex h-[100dvh] overflow-hidden">
          {/* Sidebar — segue o tema global */}
          <Sidebar />
          <div className="flex min-w-0 flex-1 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </PermissionsProvider>
  );
}
