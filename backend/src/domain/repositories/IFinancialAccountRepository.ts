import type { FinancialAccount, FinancialAccountFilters } from "../entities/FinancialAccount";

export interface IFinancialAccountRepository {
  create(data: Omit<FinancialAccount, "id" | "createdAt" | "updatedAt">): Promise<FinancialAccount>;
  findAll(filters?: FinancialAccountFilters): Promise<FinancialAccount[]>;
  findById(id: string): Promise<FinancialAccount | null>;
  update(id: string, data: Partial<Omit<FinancialAccount, "id" | "createdAt" | "updatedAt">>): Promise<FinancialAccount>;
  delete(id: string): Promise<void>;
  /** Soma initialBalance + todas transações CONFIRMED para calcular saldo atual */
  getBalance(id: string): Promise<number>;
}
