import { Outlet } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext";
import { AcessoNegado } from "./AcessoNegado";
import { useCheckAdmin } from "../../hooks/useUsers";

export function DocumentosGuard() {
  const { canAccessDocumentos } = usePermissions();
  const { data, isLoading } = useCheckAdmin();

  if (isLoading) return null; // ou loading spinner

  const hasAccess = canAccessDocumentos && data?.isAdmin;

  if (!hasAccess) {
    return <AcessoNegado />;
  }

  return <Outlet />;
}
