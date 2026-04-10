export type AccountType = "CHECKING" | "SAVINGS" | "CASH" | "CREDIT_CARD" | "INVESTMENT";

export interface FinancialAccount {
  id: string;
  name: string;
  type: AccountType;
  bank: string | null;
  initialBalance: number;
  currency: string;
  isActive: boolean;
  isDefault: boolean;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialAccountFilters {
  isActive?: boolean;
  type?: AccountType;
}
