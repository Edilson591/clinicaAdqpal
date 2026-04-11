import { CreateFinancialAccount } from "../../application/use-cases/CreateFinancialAccount";
import { CreateTransaction } from "../../application/use-cases/CreateTransaction";
import { DeleteTransaction } from "../../application/use-cases/DeleteTransaction";
import type { IFinancialAccountRepository } from "../../domain/repositories/IFinancialAccountRepository";
import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import type { FinancialAccount } from "../../domain/entities/FinancialAccount";
import type { Transaction } from "../../domain/entities/Transaction";
import { NotFoundError } from "../../domain/errors/DomainError";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const now = new Date("2026-04-10T12:00:00Z");

const mockAccount: FinancialAccount = {
  id: "acc-1",
  name: "Conta Corrente",
  type: "CHECKING",
  bank: "Bradesco",
  initialBalance: 1000,
  currency: "BRL",
  isActive: true,
  isDefault: true,
  color: null,
  createdAt: now,
  updatedAt: now,
};

const mockTransaction: Transaction = {
  id: "tx-1",
  accountId: "acc-1",
  categoryId: "cat-1",
  patientId: null,
  appointmentId: null,
  createdBy: "user-1",
  type: "INCOME",
  amount: 200,
  description: "Consulta",
  status: "PENDING",
  paymentMethod: "PIX",
  dueDate: now,
  paidAt: null,
  reference: null,
  isRecurring: false,
  recurringGroupId: null,
  installmentNumber: null,
  totalInstallments: null,
  transferToAccountId: null,
  tags: [],
  attachmentUrl: null,
  deletedAt: null,
  createdAt: now,
  updatedAt: now,
};

function makeAccountRepo(): jest.Mocked<IFinancialAccountRepository> {
  return {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getBalance: jest.fn(),
  } as jest.Mocked<IFinancialAccountRepository>;
}

function makeTransactionRepo(): jest.Mocked<ITransactionRepository> {
  return {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  } as jest.Mocked<ITransactionRepository>;
}

// ── CreateFinancialAccount ────────────────────────────────────────────────────

describe("CreateFinancialAccount", () => {
  it("creates an account and returns a DTO with currentBalance", async () => {
    const repo = makeAccountRepo();
    repo.create.mockResolvedValue(mockAccount);
    repo.getBalance.mockResolvedValue(1200);

    const useCase = new CreateFinancialAccount(repo);
    const result = await useCase.execute({
      name: "Conta Corrente",
      type: "CHECKING",
      initialBalance: 0,
      currency: "BRL",
      isDefault: false,
    });

    expect(result.id).toBe("acc-1");
    expect(result.name).toBe("Conta Corrente");
    expect(result.currentBalance).toBe(1200);
    expect(repo.getBalance).toHaveBeenCalledWith("acc-1");
  });

  it("passes isActive=true to repository", async () => {
    const repo = makeAccountRepo();
    repo.create.mockResolvedValue(mockAccount);
    repo.getBalance.mockResolvedValue(0);

    const useCase = new CreateFinancialAccount(repo);
    await useCase.execute({ name: "Caixa", type: "CASH", initialBalance: 0, currency: "BRL", isDefault: false });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: true }),
    );
  });

  it("applies defaults: initialBalance=0, currency=BRL, isDefault=false", async () => {
    const repo = makeAccountRepo();
    repo.create.mockResolvedValue(mockAccount);
    repo.getBalance.mockResolvedValue(0);

    const useCase = new CreateFinancialAccount(repo);
    await useCase.execute({ name: "Poupança", type: "SAVINGS", initialBalance: 0, currency: "BRL", isDefault: false });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ initialBalance: 0, currency: "BRL", isDefault: false }),
    );
  });
});

// ── CreateTransaction ─────────────────────────────────────────────────────────

describe("CreateTransaction", () => {
  it("creates a transaction and returns a DTO", async () => {
    const repo = makeTransactionRepo();
    repo.create.mockResolvedValue(mockTransaction);

    const useCase = new CreateTransaction(repo);
    const result = await useCase.execute({
      accountId: "acc-1",
      categoryId: "cat-1",
      createdBy: "user-1",
      type: "INCOME",
      amount: 200,
      description: "Consulta",
      dueDate: now,
      status: "PENDING",
      paymentMethod: "PIX",
      patientId: null,
      appointmentId: null,
      paidAt: null,
      reference: null,
      isRecurring: false,
      tags: [],
      attachmentUrl: null,
    });

    expect(result.id).toBe("tx-1");
    expect(result.amount).toBe(200);
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it("defaults optional fields to null/false/[]", async () => {
    const repo = makeTransactionRepo();
    repo.create.mockResolvedValue(mockTransaction);

    const useCase = new CreateTransaction(repo);
    await useCase.execute({
      accountId: "acc-1",
      categoryId: "cat-1",
      createdBy: "user-1",
      type: "INCOME",
      amount: 100,
      description: "Test",
      dueDate: now,
      status: "PENDING",
      paymentMethod: "OTHER",
      patientId: null,
      appointmentId: null,
      paidAt: null,
      reference: null,
      isRecurring: false,
      tags: [],
      attachmentUrl: null,
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: null,
        appointmentId: null,
        paidAt: null,
        reference: null,
        isRecurring: false,
        tags: [],
        attachmentUrl: null,
        deletedAt: null,
      }),
    );
  });
});

// ── DeleteTransaction ─────────────────────────────────────────────────────────

describe("DeleteTransaction", () => {
  it("soft-deletes the transaction when found and not already deleted", async () => {
    const repo = makeTransactionRepo();
    repo.findById.mockResolvedValue(mockTransaction); // deletedAt: null
    repo.softDelete.mockResolvedValue();

    const useCase = new DeleteTransaction(repo);
    await useCase.execute("tx-1");

    expect(repo.softDelete).toHaveBeenCalledWith("tx-1");
  });

  it("throws NotFoundError when transaction does not exist", async () => {
    const repo = makeTransactionRepo();
    repo.findById.mockResolvedValue(null);

    const useCase = new DeleteTransaction(repo);
    await expect(useCase.execute("unknown")).rejects.toBeInstanceOf(NotFoundError);
    expect(repo.softDelete).not.toHaveBeenCalled();
  });

  it("throws NotFoundError when transaction is already soft-deleted", async () => {
    const repo = makeTransactionRepo();
    repo.findById.mockResolvedValue({ ...mockTransaction, deletedAt: new Date() });

    const useCase = new DeleteTransaction(repo);
    await expect(useCase.execute("tx-1")).rejects.toBeInstanceOf(NotFoundError);
    expect(repo.softDelete).not.toHaveBeenCalled();
  });
});
