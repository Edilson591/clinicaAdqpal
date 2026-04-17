import { Outlet } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext";
import { AcessoNegado } from "./AcessoNegado";

/**
 * Guard para a rota de gerenciamento de usuários.
 * Apenas Administrador e Suporte de TI têm acesso.
 */
export function UsersGuard() {
  const { canAccessUsers } = usePermissions();

  if (!canAccessUsers) {
    return <AcessoNegado />;
  }

  return <Outlet />;
}
