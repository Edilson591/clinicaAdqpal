import { z } from "zod";

export const editPacientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),

  cpf: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val),
      "CPF inválido (000.000.000-00)",
    ),

  email: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "E-mail inválido",
    ),

  phone: z.string().nullable().optional(),
  gender: z.string().min(1, "Gênero é obrigatório"),
  agreement: z.string().min(1, "Convênio é obrigatório"),

  dateOfBirth: z.string().nullable().optional(),

  street: z.string().nullable().optional(),
  streetNumber: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  additionalInfo: z.string().nullable().optional(),
});

export type EditPacientInput = z.infer<typeof editPacientSchema>;
