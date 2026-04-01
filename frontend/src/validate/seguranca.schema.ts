import { z } from "zod";

export const segurancaSchema = z
  .object({
    atual: z.string().min(1, "Informe a senha atual"),
    nova: z.string().min(8, "Mínimo de 8 caracteres"),
    confirma: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.nova === data.confirma, {
    message: "As senhas não coincidem",
    path: ["confirma"],
  });

export type SegurancaInput = z.infer<typeof segurancaSchema>;
