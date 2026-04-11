import {
  CreateFinancialAccountSchema,
  UpdateFinancialAccountSchema,
  CreateFinancialCategorySchema,
  UpdateFinancialCategorySchema,
  CreateTransactionSchema,
  UpdateTransactionSchema,
  ListTransactionsQuerySchema,
} from "../../application/dtos/FinancialDTOs";

const validUUID = "550e8400-e29b-41d4-a716-446655440000";

// ── FinancialAccount ──────────────────────────────────────────────────────────

describe("CreateFinancialAccountSchema", () => {
  const base = { name: "Conta Principal", type: "CHECKING" as const };

  it("accepts valid minimal payload", () => {
    expect(CreateFinancialAccountSchema.safeParse(base).success).toBe(true);
  });

  it("applies defaults: initialBalance=0, currency=BRL, isDefault=false", () => {
    const result = CreateFinancialAccountSchema.safeParse(base);
    if (result.success) {
      expect(result.data.initialBalance).toBe(0);
      expect(result.data.currency).toBe("BRL");
      expect(result.data.isDefault).toBe(false);
    }
  });

  it("accepts all account types", () => {
    const types = ["CHECKING", "SAVINGS", "CASH", "CREDIT_CARD", "INVESTMENT"] as const;
    types.forEach((type) => {
      expect(CreateFinancialAccountSchema.safeParse({ ...base, type }).success).toBe(true);
    });
  });

  it("rejects invalid account type", () => {
    expect(CreateFinancialAccountSchema.safeParse({ ...base, type: "CRYPTO" }).success).toBe(false);
  });

  it("rejects name shorter than 2 chars", () => {
    expect(CreateFinancialAccountSchema.safeParse({ ...base, name: "A" }).success).toBe(false);
  });

  it("rejects currency not 3 chars", () => {
    expect(CreateFinancialAccountSchema.safeParse({ ...base, currency: "US" }).success).toBe(false);
  });
});

describe("UpdateFinancialAccountSchema", () => {
  it("accepts partial update", () => {
    expect(UpdateFinancialAccountSchema.safeParse({ name: "Nova Conta" }).success).toBe(true);
  });

  it("rejects empty object", () => {
    expect(UpdateFinancialAccountSchema.safeParse({}).success).toBe(false);
  });
});

// ── FinancialCategory ─────────────────────────────────────────────────────────

describe("CreateFinancialCategorySchema", () => {
  const base = { name: "Consultas", type: "INCOME" as const };

  it("accepts valid payload", () => {
    expect(CreateFinancialCategorySchema.safeParse(base).success).toBe(true);
  });

  it("accepts all category types", () => {
    (["INCOME", "EXPENSE", "BOTH"] as const).forEach((type) => {
      expect(CreateFinancialCategorySchema.safeParse({ ...base, type }).success).toBe(true);
    });
  });

  it("accepts optional parentId as UUID", () => {
    const result = CreateFinancialCategorySchema.safeParse({ ...base, parentId: validUUID });
    expect(result.success).toBe(true);
  });

  it("rejects invalid parentId (non-UUID)", () => {
    expect(CreateFinancialCategorySchema.safeParse({ ...base, parentId: "not-uuid" }).success).toBe(false);
  });

  it("rejects invalid category type", () => {
    expect(CreateFinancialCategorySchema.safeParse({ ...base, type: "OTHER" }).success).toBe(false);
  });
});

describe("UpdateFinancialCategorySchema", () => {
  it("accepts partial update", () => {
    expect(UpdateFinancialCategorySchema.safeParse({ name: "Exames" }).success).toBe(true);
  });

  it("rejects empty object", () => {
    expect(UpdateFinancialCategorySchema.safeParse({}).success).toBe(false);
  });
});

// ── Transaction ───────────────────────────────────────────────────────────────

const validTransaction = {
  accountId: validUUID,
  categoryId: validUUID,
  createdBy: validUUID,
  type: "INCOME" as const,
  amount: 150,
  description: "Consulta particular",
  dueDate: "2026-04-10",
};

describe("CreateTransactionSchema", () => {
  it("accepts valid minimal transaction", () => {
    expect(CreateTransactionSchema.safeParse(validTransaction).success).toBe(true);
  });

  it("applies defaults: status=PENDING, paymentMethod=OTHER, isRecurring=false, tags=[]", () => {
    const result = CreateTransactionSchema.safeParse(validTransaction);
    if (result.success) {
      expect(result.data.status).toBe("PENDING");
      expect(result.data.paymentMethod).toBe("OTHER");
      expect(result.data.isRecurring).toBe(false);
      expect(result.data.tags).toEqual([]);
    }
  });

  it("rejects non-positive amount", () => {
    expect(CreateTransactionSchema.safeParse({ ...validTransaction, amount: 0 }).success).toBe(false);
    expect(CreateTransactionSchema.safeParse({ ...validTransaction, amount: -10 }).success).toBe(false);
  });

  it("rejects invalid transaction type", () => {
    expect(CreateTransactionSchema.safeParse({ ...validTransaction, type: "GIFT" }).success).toBe(false);
  });

  it("rejects invalid status", () => {
    expect(CreateTransactionSchema.safeParse({ ...validTransaction, status: "PAID" }).success).toBe(false);
  });

  it("accepts all payment methods", () => {
    const methods = ["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "BANK_TRANSFER", "INSURANCE", "OTHER"] as const;
    methods.forEach((paymentMethod) => {
      expect(CreateTransactionSchema.safeParse({ ...validTransaction, paymentMethod }).success).toBe(true);
    });
  });

  it("rejects invalid accountId UUID", () => {
    expect(CreateTransactionSchema.safeParse({ ...validTransaction, accountId: "bad" }).success).toBe(false);
  });

  it("rejects description longer than 500 chars", () => {
    expect(
      CreateTransactionSchema.safeParse({ ...validTransaction, description: "x".repeat(501) }).success,
    ).toBe(false);
  });

  it("rejects invalid attachmentUrl", () => {
    expect(
      CreateTransactionSchema.safeParse({ ...validTransaction, attachmentUrl: "not-a-url" }).success,
    ).toBe(false);
  });
});

describe("UpdateTransactionSchema", () => {
  it("accepts partial update with amount", () => {
    expect(UpdateTransactionSchema.safeParse({ amount: 200 }).success).toBe(true);
  });

  it("accepts status update to CONFIRMED", () => {
    expect(UpdateTransactionSchema.safeParse({ status: "CONFIRMED" }).success).toBe(true);
  });

  it("rejects empty object", () => {
    expect(UpdateTransactionSchema.safeParse({}).success).toBe(false);
  });

  it("rejects non-positive amount", () => {
    expect(UpdateTransactionSchema.safeParse({ amount: -5 }).success).toBe(false);
  });
});

describe("ListTransactionsQuerySchema", () => {
  it("applies defaults: page=1, limit=20", () => {
    const result = ListTransactionsQuerySchema.safeParse({});
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it("coerces page and limit from string", () => {
    const result = ListTransactionsQuerySchema.safeParse({ page: "2", limit: "10" });
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(10);
    }
  });

  it("rejects limit greater than 100", () => {
    expect(ListTransactionsQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
  });

  it("rejects invalid type filter", () => {
    expect(ListTransactionsQuerySchema.safeParse({ type: "UNKNOWN" }).success).toBe(false);
  });

  it("coerces dateStart from string", () => {
    const result = ListTransactionsQuerySchema.safeParse({ dateStart: "2026-01-01" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.dateStart).toBeInstanceOf(Date);
  });
});
