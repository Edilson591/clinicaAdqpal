import type { Request, Response, NextFunction } from "express";
import { PrismaFinancialAccountRepository } from "../../infrastructure/repositories/PrismaFinancialAccountRepository";
import { PrismaFinancialCategoryRepository } from "../../infrastructure/repositories/PrismaFinancialCategoryRepository";
import { PrismaTransactionRepository } from "../../infrastructure/repositories/PrismaTransactionRepository";
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
      const account = await accountRepo.findById(req.params.id);
      if (!account) throw new NotFoundError("Conta financeira não encontrada");
      const balance = await accountRepo.getBalance(account.id);
      res.json({ success: true, data: { ...account, currentBalance: balance } });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new UpdateFinancialAccount(accountRepo).execute(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteFinancialAccount(accountRepo).execute(req.params.id);
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
      const category = await categoryRepo.findById(req.params.id);
      if (!category) throw new NotFoundError("Categoria não encontrada");
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new UpdateFinancialCategory(categoryRepo).execute(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteFinancialCategory(categoryRepo).execute(req.params.id);
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
      const tx = await transactionRepo.findById(req.params.id);
      if (!tx || tx.deletedAt) throw new NotFoundError("Transação não encontrada");
      res.json({ success: true, data: tx });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new UpdateTransaction(transactionRepo).execute(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteTransaction(transactionRepo).execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
