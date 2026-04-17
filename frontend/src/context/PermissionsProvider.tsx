import { type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { USER_ROLES } from "../types/roles";
import { PermissionsContext } from "./PermissionsContext";

// Roles com acesso à área financeira
const FINANCIAL_ROLES = [
  USER_ROLES.ADMIN,
  USER_ROLES.RECEPTIONIST,
  USER_ROLES.IT_SUPPORT,
] as const;

// Roles com acesso ao gerenciamento de usuários
const USERS_ROLES = [
  USER_ROLES.ADMIN,
  USER_ROLES.IT_SUPPORT,
] as const;

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const canAccessFinanceiro =
    !!user &&
    FINANCIAL_ROLES.includes(user.roleId as (typeof FINANCIAL_ROLES)[number]);

  const canAccessUsers =
    !!user &&
    USERS_ROLES.includes(user.roleId as (typeof USERS_ROLES)[number]);

  return (
    <PermissionsContext.Provider value={{ canAccessFinanceiro, canAccessUsers }}>
      {children}
    </PermissionsContext.Provider>
  );
}
