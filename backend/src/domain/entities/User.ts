// =============================================================================
// DOMAIN ENTITY: User
// =============================================================================

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  roleId: number;
  cpf: string | null;
  cnpj: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<User, "passwordHash">;

export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  roleId: number;
  cpf?: string | null;
  cnpj?: string | null;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  passwordHash?: string;
  roleId?: number;
  cpf?: string | null;
  cnpj?: string | null;
}
