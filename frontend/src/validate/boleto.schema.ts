import { z } from "zod";

export const boletoFormSchema = z.object({
  kind: z.enum(["SINGLE", "ANNUAL_CARNET"]),
  payerName: z.string().trim().min(3, "Informe o nome completo"),
  payerDocument: z
    .string()
    .trim()
    .refine((value) => [11, 14].includes(value.replace(/\D/g, "").length), {
      message: "Informe um CPF ou CNPJ válido",
    }),
  payerEmail: z
    .string()
    .trim()
    .refine((value) => !value || z.email().safeParse(value).success, "E-mail inválido"),
  payerPhone: z
    .string()
    .trim()
    .refine((value) => !value || value.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  amount: z
    .string()
    .trim()
    .refine((value) => {
      const amount = Number(value.replace(/\./g, "").replace(",", "."));
      return Number.isFinite(amount) && amount > 0;
    }, "Informe um valor maior que zero"),
  dueDate: z.string().min(1, "Informe a data de vencimento"),
  description: z.string().trim().max(200, "Use no máximo 200 caracteres"),
});

export type BoletoFormInput = z.infer<typeof boletoFormSchema>;
