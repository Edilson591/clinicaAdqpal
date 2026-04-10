import { createContext, useContext } from "react";


interface PermissionsContextValue {
  /** Usuário pode visualizar e operar a área financeira */
  canAccessFinanceiro: boolean;
}

export const PermissionsContext = createContext<PermissionsContextValue>({
  canAccessFinanceiro: false,
});



/** Hook para consumir permissões em qualquer componente dentro do AppLayout */
export function usePermissions() {
  return useContext(PermissionsContext);
}
