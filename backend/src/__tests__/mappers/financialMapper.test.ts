import {
  toFinancialAccountResponseDTO,
  toFinancialCategoryResponseDTO,
  toTransactionResponseDTO,
} from "../../application/mappers/financialMapper";
import type { FinancialAccount } from "../../domain/entities/FinancialAccount";
import type { FinancialCategory } from "../../domain/entities/FinancialCategory";
import type { Transaction } from "../../domain/entities/Transaction";

const now = new Date("2026-04-10T12:00:00Z");

// ── FinancialAccount ──────────────────────────────────────────────────────────

const mockAccount: FinancialAccount & { currentBalance?: number } = {
  id: "acc-1",
  name: "Conta Corrente",
  type: "CHECKING",
  bank: "Bradesco",
  initialBalance: 1000,
  currency: "BRL",
  isActive: true,
  isDefault: true,
  color: "#38A169",
  createdAt: now,
  updatedAt: now,
};

describe("toFinancialAccountResponseDTO", () => {
  it("maps all fields correctly", () => {
    const dto = toFinancialAccountResponseDTO({ ...mockAccount, currentBalance: 1500 });
    expect(dto.id).toBe("acc-1");
    expect(dto.name).toBe("Conta Corrente");
    expect(dto.type).toBe("CHECKING");
    expect(dto.bank).toBe("Bradesco");
    expect(dto.initialBalance).toBe(1000);
    expect(dto.currentBalance).toBe(1500);
    expect(dto.currency).toBe("BRL");
    expect(dto.isActive).toBe(true);
    expect(dto.isDefault).toBe(true);
    expect(dto.color).toBe("#38A169");
  });

  it("falls back to initialBalance when currentBalance is undefined", () => {
    const dto = toFinancialAccountResponseDTO(mockAccount);
    expect(dto.currentBalance).toBe(1000);
  });

  it("converts dates to ISO strings", () => {
    const dto = toFinancialAccountResponseDTO(mockAccount);
    expect(dto.createdAt).toBe(now.toISOString());
    expect(dto.updatedAt).toBe(now.toISOString());
  });
});

// ── FinancialCategory ─────────────────────────────────────────────────────────

const mockCategory: FinancialCategory = {
  id: "cat-1",
  name: "Consultas",
  type: "INCOME",
  color: "#38A169",
  icon: "stethoscope",
  parentId: null,
  parent: null,
  children: [],
  isDefault: false,
  isActive: true,
  createdAt: now,
  updatedAt: now,
};

describe("toFinancialCategoryResponseDTO", () => {
  it("maps all fields correctly", () => {
    const dto = toFinancialCategoryResponseDTO(mockCategory);
    expect(dto.id).toBe("cat-1");
    expect(dto.name).toBe("Consultas");
    expect(dto.type).toBe("INCOME");
    expect(dto.color).toBe("#38A169");
    expect(dto.icon).toBe("stethoscope");
    expect(dto.parentId).toBeNull();
    expect(dto.parent).toBeNull();
    expect(dto.children).toEqual([]);
    expect(dto.isDefault).toBe(false);
    expect(dto.isActive).toBe(true);
  });

  it("maps category with parent and children", () => {
    const dto = toFinancialCategoryResponseDTO({
      ...mockCategory,
      parentId: "cat-0",
      parent: { id: "cat-0", name: "Receitas" },
      children: [{ id: "cat-2", name: "Particular" }],
    });
    expect(dto.parent).toEqual({ id: "cat-0", name: "Receitas" });
    expect(dto.children).toHaveLength(1);
  });

  it("defaults children to empty array when undefined", () => {
    const { children: _, ...noChildren } = mockCategory;
    const dto = toFinancialCategoryResponseDTO(noChildren as FinancialCategory);
    expect(dto.children).toEqual([]);
  });

  it("converts dates to ISO strings", () => {
    const dto = toFinancialCategoryResponseDTO(mockCategory);
    expect(dto.createdAt).toBe(now.toISOString());
  });
});

// ── Transaction ───────────────────────────────────────────────────────────────

const mockTransaction: Transaction = {
  id: "tx-1",
  accountId: "acc-1",
  categoryId: "cat-1",
  patientId: "pat-1",
  appointmentId: null,
  createdBy: "user-1",
  type: "INCOME",
  amount: 200,
  description: "Consulta particular",
  status: "CONFIRMED",
  paymentMethod: "PIX",
  dueDate: now,
  paidAt: now,
  reference: "REF-001",
  isRecurring: false,
  recurringGroupId: null,
  installmentNumber: null,
  totalInstallments: null,
  transferToAccountId: null,
  tags: ["consulta", "pix"],
  attachmentUrl: null,
  deletedAt: null,
  account: { id: "acc-1", name: "Conta Corrente", color: "#38A169" },
  category: { id: "cat-1", name: "Consultas", color: null },
  patient: { id: "pat-1", name: "Maria Silva" },
  createdAt: now,
  updatedAt: now,
};

describe("toTransactionResponseDTO", () => {
  it("maps all scalar fields correctly", () => {
    const dto = toTransactionResponseDTO(mockTransaction);
    expect(dto.id).toBe("tx-1");
    expect(dto.accountId).toBe("acc-1");
    expect(dto.type).toBe("INCOME");
    expect(dto.amount).toBe(200);
    expect(dto.description).toBe("Consulta particular");
    expect(dto.status).toBe("CONFIRMED");
    expect(dto.paymentMethod).toBe("PIX");
    expect(dto.isRecurring).toBe(false);
    expect(dto.tags).toEqual(["consulta", "pix"]);
  });

  it("converts dueDate and paidAt to ISO strings", () => {
    const dto = toTransactionResponseDTO(mockTransaction);
    expect(dto.dueDate).toBe(now.toISOString());
    expect(dto.paidAt).toBe(now.toISOString());
  });

  it("maps null paidAt to null", () => {
    const dto = toTransactionResponseDTO({ ...mockTransaction, paidAt: null });
    expect(dto.paidAt).toBeNull();
  });

  it("maps relations correctly", () => {
    const dto = toTransactionResponseDTO(mockTransaction);
    expect(dto.account).toEqual({ id: "acc-1", name: "Conta Corrente", color: "#38A169" });
    expect(dto.category).toEqual({ id: "cat-1", name: "Consultas", color: null });
    expect(dto.patient).toEqual({ id: "pat-1", name: "Maria Silva" });
  });

  it("maps null/undefined relations to null", () => {
    const dto = toTransactionResponseDTO({
      ...mockTransaction,
      account: undefined,
      category: undefined,
      patient: null,
    });
    expect(dto.account).toBeNull();
    expect(dto.category).toBeNull();
    expect(dto.patient).toBeNull();
  });
});
