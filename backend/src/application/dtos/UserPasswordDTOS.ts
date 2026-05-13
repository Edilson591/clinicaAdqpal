import { z } from "zod";

// ─── Forgot Password ─────────────────────────────────────────────────────────

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ message: "E-mail é obrigatório" })
    .email("Digite um e-mail válido")
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordSchema>;

// ─── Reset Password ───────────────────────────────────────────────────────────

export const ResetPasswordSchema = z.object({
  token: z
    .string({ required_error: "Token é obrigatório" })
    .min(1, "Token inválido"),

  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(72, "Senha deve ter no máximo 72 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ForgotPasswordResponseDTO {
  message: string;
}

export interface ResetPasswordResponseDTO {
  message: string;
}