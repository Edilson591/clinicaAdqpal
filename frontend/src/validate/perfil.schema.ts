import { z } from "zod";

export const perfilSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("Digite um e-mail válido"),
  especialidade: z.string().min(1, "Especialidade é obrigatória"),
});

export type PerfilInput = z.infer<typeof perfilSchema>;
