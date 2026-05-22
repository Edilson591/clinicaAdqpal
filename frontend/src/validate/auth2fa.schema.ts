import { z } from "zod";

export const auth2faSchema = z.object({
  code: z
    .string()
    .min(1, "O código é obrigatório")
    .regex(/^\d{6}$/, "O código deve conter exatamente 6 dígitos"),
});

export type Auth2faInput = z.infer<typeof auth2faSchema>;
