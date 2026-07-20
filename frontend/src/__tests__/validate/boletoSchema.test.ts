import { describe, expect, it } from "vitest";
import { boletoFormSchema } from "../../validate/boleto.schema";

function futureDate(days = 1) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

const validForm = {
  kind: "ANNUAL_CARNET" as const,
  payerName: "Cliente Teste dos Santos",
  payerDocument: "099.894.744-00",
  payerEmail: "cliente@example.com",
  payerPhone: "+55 (82) 99999-9999",
  amount: "25,00",
  dueDate: futureDate(),
  description: "Mensalidade anual",
};

describe("boletoFormSchema", () => {
  it("accepts an annual carnet form", () => {
    expect(boletoFormSchema.safeParse(validForm).success).toBe(true);
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

  it("requires complete contact and description fields", () => {
    const result = boletoFormSchema.safeParse({
      ...validForm,
      payerName: "Ana",
      payerEmail: "email-invalido",
      payerPhone: "(82) 99999-9999",
      description: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.payerName).toBeDefined();
      expect(errors.payerEmail).toBeDefined();
      expect(errors.payerPhone).toBeDefined();
      expect(errors.description).toBeDefined();
    }
  });

  it("rejects a due date before today", () => {
    expect(
      boletoFormSchema.safeParse({
        ...validForm,
        dueDate: futureDate(-1),
      }).success,
    ).toBe(false);
  });
});
