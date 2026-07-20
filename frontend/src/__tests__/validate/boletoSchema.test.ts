import { describe, expect, it } from "vitest";
import { boletoFormSchema } from "../../validate/boleto.schema";

const validForm = {
  kind: "ANNUAL_CARNET" as const,
  payerName: "Cliente Teste dos Santos",
  payerDocument: "09989474400",
  payerEmail: "cliente@example.com",
  payerPhone: "+5582999999999",
  amount: "25,00",
  dueDate: "2026-07-21",
  description: "Mensalidade anual",
};

describe("boletoFormSchema", () => {
  it("accepts an annual carnet form", () => {
    expect(boletoFormSchema.safeParse(validForm).success).toBe(true);
  });

  it("accepts optional contact fields as empty strings", () => {
    expect(
      boletoFormSchema.safeParse({
        ...validForm,
        kind: "SINGLE",
        payerEmail: "",
        payerPhone: "",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid document and amount", () => {
    const result = boletoFormSchema.safeParse({
      ...validForm,
      payerDocument: "123",
      amount: "0,00",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.payerDocument).toBeDefined();
      expect(result.error.flatten().fieldErrors.amount).toBeDefined();
    }
  });
});
