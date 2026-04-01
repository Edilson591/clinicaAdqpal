import { z } from "zod";

export const newPacientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),

  email: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "E-mail inválido",
    ),

  phone: z.string().min(1, "Telefone é obrigatório"),
  gender: z.string().min(1, "Gênero é obrigatório"),
  agreement: z.string().min(1, "Convênio é obrigatório"),

  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (000.000.000-00)"),

  dateOfBirth: z.coerce.date().optional().nullable(),

  street: z.string().nullable().optional(),
  streetNumber: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  additionalInfo: z.string().nullable().optional(),
});

export type NewPacientInput = z.infer<typeof newPacientSchema>;
