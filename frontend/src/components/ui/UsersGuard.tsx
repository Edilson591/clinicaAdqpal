import { Outlet } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext";
import { AcessoNegado } from "./AcessoNegado";

/**
 * Guard para a rota de gerenciamento de usuários.
 * Apenas Administrador tem acesso.
 */
export function UsersGuard() {
  const { canAccessUsers } = usePermissions();

  if (!canAccessUsers) {
    return <AcessoNegado allowedRoles="Administrador" />;
  }

  return <Outlet />;
}
