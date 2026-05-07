import { Outlet } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext";
import { AcessoNegado } from "./AcessoNegado";

export function NotaFiscalGuard() {
  const { canAccessNotas } = usePermissions();

  if (!canAccessNotas) {
    return <AcessoNegado />;
  }

  return <Outlet />;
}
