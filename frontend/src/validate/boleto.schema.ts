import { z } from "zod";

function localIsoDate() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export const boletoFormSchema = z.object({
  kind: z.enum(["SINGLE", "ANNUAL_CARNET"]),
  payerName: z.string().trim().min(4, "O nome completo deve ter mais de 3 caracteres"),
  payerDocument: z
    .string()
    .trim()
    .regex(
      /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/,
      "Informe um CPF ou CNPJ válido",
    ),
  payerEmail: z
    .string()
    .trim()
    .min(1, "Informe o e-mail")
    .refine((value) => z.email().safeParse(value).success, "Informe um e-mail válido"),
  payerPhone: z
    .string()
    .trim()
    .regex(/^\+55 \(\d{2}\) 9\d{4}-\d{4}$/, "Use o formato +55 (82) 99999-9999"),
  amount: z
    .string()
    .trim()
    .refine((value) => {
      const amount = Number(value.replace(/\./g, "").replace(",", "."));
      return Number.isFinite(amount) && amount > 0;
    }, "Informe um valor maior que zero"),
  dueDate: z
    .string()
    .min(1, "Informe a data de vencimento")
    .refine((value) => !value || value >= localIsoDate(), "O vencimento deve ser hoje ou uma data futura"),
  description: z
    .string()
    .trim()
    .min(1, "Informe a descrição")
    .max(200, "Use no máximo 200 caracteres"),
});

export type BoletoFormInput = z.infer<typeof boletoFormSchema>;
