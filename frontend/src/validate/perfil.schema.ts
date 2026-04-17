import { z } from "zod";

export const perfilSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
    email: z
      .string()
      .min(1, "E-mail é obrigatório")
      .email("Digite um e-mail válido"),
    cpfOrCnpj: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val) || // CPF
          /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val), // CNPJ
        "Informe um CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00) válido",
      ),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)),
        "Senha deve ter mínimo 8 caracteres, uma maiúscula e um número",
      ),
    confirmPassword: z.string().optional(),
    specialtyIds: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && !data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe a senha atual para alterá-la",
        path: ["currentPassword"],
      });
    }
    if (data.newPassword && data.confirmPassword !== data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
      });
    }
  });

export type PerfilInput = z.infer<typeof perfilSchema>;
