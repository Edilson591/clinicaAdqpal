import { z } from "zod";

export const novaTransacaoSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"], { message: "Tipo é obrigatório" }),
  accountId: z.string().min(1, "Conta é obrigatória"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória").max(200, "Máximo 200 caracteres"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (v) => !isNaN(parseFloat(v.replace(",", "."))) && parseFloat(v.replace(",", ".")) > 0,
      { message: "Valor deve ser maior que zero" }
    ),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  paymentMethod: z.enum(
    ["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "BANK_TRANSFER", "INSURANCE", "OTHER"],
    { message: "Forma de pagamento é obrigatória" }
  ),
  dueDate: z.string().min(1, "Data é obrigatória"),
  notes: z.string().optional(),
});

export type NovaTransacaoInput = z.infer<typeof novaTransacaoSchema>;
