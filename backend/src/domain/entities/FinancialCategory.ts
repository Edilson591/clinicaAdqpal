export type CategoryType = "INCOME" | "EXPENSE" | "BOTH";

export interface FinancialCategory {
  id: string;
  name: string;
  type: CategoryType;
  color: string | null;
  icon: string | null;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  children?: { id: string; name: string }[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialCategoryFilters {
  type?: CategoryType;
  isActive?: boolean;
  parentId?: string | null;
}
