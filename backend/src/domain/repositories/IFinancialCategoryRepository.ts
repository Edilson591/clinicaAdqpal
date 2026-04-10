import type { FinancialCategory, FinancialCategoryFilters } from "../entities/FinancialCategory";

export interface IFinancialCategoryRepository {
  create(data: Omit<FinancialCategory, "id" | "parent" | "children" | "createdAt" | "updatedAt">): Promise<FinancialCategory>;
  findAll(filters?: FinancialCategoryFilters): Promise<FinancialCategory[]>;
  findById(id: string): Promise<FinancialCategory | null>;
  update(id: string, data: Partial<Omit<FinancialCategory, "id" | "parent" | "children" | "createdAt" | "updatedAt">>): Promise<FinancialCategory>;
  delete(id: string): Promise<void>;
}
