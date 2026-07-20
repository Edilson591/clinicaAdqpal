import { Outlet } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext";
import { AcessoNegado } from "./AcessoNegado";

export function RhGuard() {
  const { canAccessRh } = usePermissions();

  if (!canAccessRh) {
    return <AcessoNegado allowedRoles="Administrador" />;
  }

  return <Outlet />;
}
