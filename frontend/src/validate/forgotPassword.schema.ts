import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
