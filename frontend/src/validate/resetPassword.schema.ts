import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Senha é obrigatória" })
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(72, "Senha deve ter no máximo 72 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string({ required_error: "Confirme a senha" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
