import { prisma } from "../database/prismaClient";
import type { IFinancialAccountRepository } from "../../domain/repositories/IFinancialAccountRepository";
import type { FinancialAccount, FinancialAccountFilters } from "../../domain/entities/FinancialAccount";

export class PrismaFinancialAccountRepository implements IFinancialAccountRepository {
  async create(data: Omit<FinancialAccount, "id" | "createdAt" | "updatedAt">): Promise<FinancialAccount> {
    const row = await prisma.financialAccount.create({ data });
    return this.toDomain(row);
  }

  async findAll(filters?: FinancialAccountFilters): Promise<FinancialAccount[]> {
    const where: Record<string, unknown> = {};
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.type) where.type = filters.type;

    const rows = await prisma.financialAccount.findMany({ where, orderBy: { name: "asc" } });
    return rows.map(this.toDomain);
  }

  async findById(id: string): Promise<FinancialAccount | null> {
    const row = await prisma.financialAccount.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async update(
    id: string,
    data: Partial<Omit<FinancialAccount, "id" | "createdAt" | "updatedAt">>
  ): Promise<FinancialAccount> {
    const row = await prisma.financialAccount.update({ where: { id }, data });
    return this.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.financialAccount.delete({ where: { id } });
  }

  async getBalance(id: string): Promise<number> {
    const account = await prisma.financialAccount.findUnique({ where: { id } });
    if (!account) return 0;

    const income = await prisma.transaction.aggregate({
      where: { accountId: id, status: "CONFIRMED", deletedAt: null, type: "INCOME" },
      _sum: { amount: true },
    });
    const expense = await prisma.transaction.aggregate({
      where: { accountId: id, status: "CONFIRMED", deletedAt: null, type: "EXPENSE" },
      _sum: { amount: true },
    });
    const transferOut = await prisma.transaction.aggregate({
      where: { accountId: id, status: "CONFIRMED", deletedAt: null, type: "TRANSFER" },
      _sum: { amount: true },
    });
    const transferIn = await prisma.transaction.aggregate({
      where: { transferToAccountId: id, status: "CONFIRMED", deletedAt: null, type: "TRANSFER" },
      _sum: { amount: true },
    });

    const initial = Number(account.initialBalance);
    const incomeTotal = Number(income._sum.amount ?? 0);
    const expenseTotal = Number(expense._sum.amount ?? 0);
    const transferOutTotal = Number(transferOut._sum.amount ?? 0);
    const transferInTotal = Number(transferIn._sum.amount ?? 0);

    return initial + incomeTotal - expenseTotal - transferOutTotal + transferInTotal;
  }

  private toDomain(row: {
    id: string;
    name: string;
    type: string;
    bank: string | null;
    initialBalance: { toNumber(): number };
    currency: string;
    isActive: boolean;
    isDefault: boolean;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): FinancialAccount {
    return {
      id: row.id,
      name: row.name,
      type: row.type as FinancialAccount["type"],
      bank: row.bank,
      initialBalance: row.initialBalance.toNumber(),
      currency: row.currency,
      isActive: row.isActive,
      isDefault: row.isDefault,
      color: row.color,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
