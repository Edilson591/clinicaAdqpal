import prisma from "../database/prismaClient";
import type { IFinancialCategoryRepository } from "../../domain/repositories/IFinancialCategoryRepository";
import type {
  FinancialCategory,
  FinancialCategoryFilters,
} from "../../domain/entities/FinancialCategory";

type PrismaCategoryRow = {
  id: string;
  name: string;
  type: string;
  color: string | null;
  icon: string | null;
  parentId: string | null;
  parent?: { id: string; name: string } | null;
  children?: { id: string; name: string }[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class PrismaFinancialCategoryRepository implements IFinancialCategoryRepository {
  private readonly include = {
    parent: { select: { id: true, name: true } },
    children: { select: { id: true, name: true }, where: { isActive: true } },
  };

  async create(
    data: Omit<
      FinancialCategory,
      "id" | "parent" | "children" | "createdAt" | "updatedAt"
    >,
  ): Promise<FinancialCategory> {
    const row = await prisma.financialCategory.create({
      data,
      include: this.include,
    });
    return this.toDomain(row);
  }

  async findAll(
    filters?: FinancialCategoryFilters,
  ): Promise<FinancialCategory[]> {
    const where: Record<string, unknown> = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.parentId !== undefined) where.parentId = filters.parentId;

    const rows = await prisma.financialCategory.findMany({
      where,
      include: this.include,
      orderBy: [{ parentId: "asc" }, { name: "asc" }],
    });
    return rows.map(this.toDomain);
  }

  async findById(id: string): Promise<FinancialCategory | null> {
    const row = await prisma.financialCategory.findUnique({
      where: { id },
      include: this.include,
    });
    return row ? this.toDomain(row) : null;
  }

  async update(
    id: string,
    data: Partial<
      Omit<
        FinancialCategory,
        "id" | "parent" | "children" | "createdAt" | "updatedAt"
      >
    >,
  ): Promise<FinancialCategory> {
    const row = await prisma.financialCategory.update({
      where: { id },
      data,
      include: this.include,
    });
    return this.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.financialCategory.delete({ where: { id } });
  }

  private toDomain(row: PrismaCategoryRow): FinancialCategory {
    return {
      id: row.id,
      name: row.name,
      type: row.type as FinancialCategory["type"],
      color: row.color,
      icon: row.icon,
      parentId: row.parentId,
      parent: row.parent ?? null,
      children: row.children ?? [],
      isDefault: row.isDefault,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
