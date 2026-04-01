// UserRole.ts

export const USER_ROLES = {
  ADMIN: 1,
  USER: 2,
  DOCTOR: 3,
  NURSE: 4,
  RECEPTIONIST: 5,
  LAB_TECHNICIAN: 6,
  ACCOUNTANT: 7,
  PHARMACIST: 8,
  IT_SUPPORT: 9,
} as const;

// Tipo seguro baseado nos valores
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Labels em PT-BR
export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: "Administrador",
  [USER_ROLES.USER]: "Usuário",
  [USER_ROLES.DOCTOR]: "Médico",
  [USER_ROLES.NURSE]: "Enfermeiro(a)",
  [USER_ROLES.RECEPTIONIST]: "Recepcionista",
  [USER_ROLES.LAB_TECHNICIAN]: "Técnico de Laboratório",
  [USER_ROLES.ACCOUNTANT]: "Contador(a)",
  [USER_ROLES.PHARMACIST]: "Farmacêutico(a)",
  [USER_ROLES.IT_SUPPORT]: "Suporte de TI",
};
/**
 * Retorna o label em PT-BR para um roleId numérico
 */
export function getRoleLabel(roleId: UserRole | number): string {
  return ROLE_LABELS[roleId as UserRole] ?? "Desconhecido";
}