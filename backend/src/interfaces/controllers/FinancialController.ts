import type { Request, Response, NextFunction } from "express";
import { PrismaFinancialAccountRepository } from "../../infrastructure/repositories/PrismaFinancialAccountRepository";
import { PrismaFinancialCategoryRepository } from "../../infrastructure/repositories/PrismaFinancialCategoryRepository";
import { PrismaTransactionRepository } from "../../infrastructure/repositories/PrismaTransactionRepository";
import prisma from "../../infrastructure/database/prismaClient";
import { CreateFinancialAccount } from "../../application/use-cases/CreateFinancialAccount";
import { ListFinancialAccounts } from "../../application/use-cases/ListFinancialAccounts";
import { UpdateFinancialAccount } from "../../application/use-cases/UpdateFinancialAccount";
import { DeleteFinancialAccount } from "../../application/use-cases/DeleteFinancialAccount";
import { CreateFinancialCategory } from "../../application/use-cases/CreateFinancialCategory";
import { ListFinancialCategories } from "../../application/use-cases/ListFinancialCategories";
import { UpdateFinancialCategory } from "../../application/use-cases/UpdateFinancialCategory";
import { DeleteFinancialCategory } from "../../application/use-cases/DeleteFinancialCategory";
import { CreateTransaction } from "../../application/use-cases/CreateTransaction";
import { ListTransactions } from "../../application/use-cases/ListTransactions";
import { UpdateTransaction } from "../../application/use-cases/UpdateTransaction";
import { DeleteTransaction } from "../../application/use-cases/DeleteTransaction";
import { NotFoundError } from "../../domain/errors/DomainError";
import { ListTransactionsQuerySchema } from "../../application/dtos/FinancialDTOs";

const accountRepo = new PrismaFinancialAccountRepository();
const categoryRepo = new PrismaFinancialCategoryRepository();
const transactionRepo = new PrismaTransactionRepository();

// ─── Accounts ─────────────────────────────────────────────────────────────────

export class FinancialAccountController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new CreateFinancialAccount(accountRepo).execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
      const type = req.query.type as string | undefined;
      const result = await new ListFinancialAccounts(accountRepo).execute({ isActive, type: type as never });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const account = await accountRepo.findById(req.params.id as string);
      if (!account) throw new NotFoundError("Conta financeira não encontrada");
      const balance = await accountRepo.getBalance(account.id);
      res.json({ success: true, data: { ...account, currentBalance: balance } });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new UpdateFinancialAccount(accountRepo).execute(req.params.id as string, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteFinancialAccount(accountRepo).execute(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export class FinancialCategoryController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new CreateFinancialCategory(categoryRepo).execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type as string | undefined;
      const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
      const result = await new ListFinancialCategories(categoryRepo).execute({ type: type as never, isActive });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryRepo.findById(req.params.id as string);
      if (!category) throw new NotFoundError("Categoria não encontrada");
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new UpdateFinancialCategory(categoryRepo).execute(req.params.id as string, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteFinancialCategory(categoryRepo).execute(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export class TransactionController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new CreateTransaction(transactionRepo).execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = ListTransactionsQuerySchema.parse(req.query);
      const result = await new ListTransactions(transactionRepo).execute(parsed);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tx = await transactionRepo.findById(req.params.id as string);
      if (!tx || tx.deletedAt) throw new NotFoundError("Transação não encontrada");
      res.json({ success: true, data: tx });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new UpdateTransaction(transactionRepo).execute(req.params.id as string, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteTransaction(transactionRepo).execute(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const PT_MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function subMonths(d: Date, n: number): Date {
  const result = new Date(d);
  result.setMonth(result.getMonth() - n);
  return result;
}
function toYearMonth(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export class FinancialDashboardController {
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const monthParam = req.query.month as string | undefined; // "YYYY-MM"

      // Mês de referência (último mês da janela)
      const refDate = monthParam ? new Date(`${monthParam}-15`) : new Date();
      const rangeStart = startOfMonth(subMonths(refDate, 5));
      const rangeEnd = endOfMonth(refDate);

      // Monta os 6 buckets na ordem correta
      const buckets: Record<string, { label: string; income: number; expense: number }> = {};
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(refDate, i);
        const key = toYearMonth(d);
        buckets[key] = {
          label: PT_MONTHS[d.getMonth()],
          income: 0,
          expense: 0,
        };
      }

      // Busca transações confirmadas no intervalo (INCOME e EXPENSE)
      const transactions = await prisma.transaction.findMany({
        where: {
          status: "CONFIRMED",
          deletedAt: null,
          type: { in: ["INCOME", "EXPENSE"] },
          dueDate: { gte: rangeStart, lte: rangeEnd },
        },
        select: { type: true, amount: true, dueDate: true },
      });

      for (const tx of transactions) {
        const key = toYearMonth(tx.dueDate);
        if (!buckets[key]) continue;
        const val = Number(tx.amount);
        if (tx.type === "INCOME") buckets[key].income += val;
        else buckets[key].expense += val;
      }

      const data = Object.entries(buckets).map(([month, v]) => ({
        month,
        label: v.label,
        income: Math.round(v.income * 100) / 100,
        expense: Math.round(v.expense * 100) / 100,
      }));

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}
