import type { Transaction, TransactionFilters } from "../entities/Transaction";
import type { PaginatedResult } from "../shared/pagination";

export interface ITransactionRepository {
  create(data: Omit<Transaction, "id" | "account" | "category" | "patient" | "createdAt" | "updatedAt">): Promise<Transaction>;
  findAll(filters?: TransactionFilters): Promise<PaginatedResult<Transaction>>;
  findById(id: string): Promise<Transaction | null>;
  update(id: string, data: Partial<Omit<Transaction, "id" | "account" | "category" | "patient" | "createdAt" | "updatedAt">>): Promise<Transaction>;
  softDelete(id: string): Promise<void>;
}
