import { Outlet } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext";
import { AcessoNegado } from "./AcessoNegado";

/**
 * Guard para rotas financeiras.
 * Renderiza as rotas filhas se o usuário tiver permissão,
 * caso contrário exibe a tela de acesso negado.
 */
export function FinanceiroGuard() {
  const { canAccessFinanceiro } = usePermissions();

  if (!canAccessFinanceiro) {
    return <AcessoNegado allowedRoles="Administrador" />;
  }

  return <Outlet />;
}
