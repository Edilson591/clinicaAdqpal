import { z } from "zod";

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreatePatientSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100)
    .trim(),
  email: z
    .string()
    .email("Digite um e-mail válido")
    .toLowerCase()
    .trim()
    .nullable()
    .optional(),
  phone: z.string().max(20).trim().nullable().optional(),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve ter 11 dígitos numéricos")
    .nullable()
    .optional(),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().min(1, "Gênero é obrigatório"),
  agreement: z.string().min(1, "Convênio é obrigatório"),
  street: z.string().max(255).trim().nullable().optional(),
  streetNumber: z.string().max(20).trim().nullable().optional(),
  city: z.string().max(100).trim().nullable().optional(),
  state: z
    .string()
    .length(2, "State must be a 2-letter abbreviation")
    .toUpperCase()
    .nullable()
    .optional(),
  zipCode: z
    .string()
    .transform((v) => v?.replace(/\D/g, ""))
    .refine((v) => !v || v.length === 8, {
      message: "CEP deve ter 8 dígitos",
    })
    .nullable()
    .optional(),
  additionalInfo: z.string().max(1000).trim().nullable().optional(),
});

export type CreatePatientDTO = z.infer<typeof CreatePatientSchema>;

// ─── Update ───────────────────────────────────────────────────────────────────

export const UpdatePatientSchema = z
  .object({
    name: z.string().min(2).max(100).trim().optional(),
    email: z.string().email().toLowerCase().trim().nullable().optional(),
    phone: z.string().max(20).trim().nullable().optional(),
    cpf: z
      .string()
      .regex(/^\d{11}$/)
      .nullable()
      .optional(),
    dateOfBirth: z.string().nullable().optional(),
    street: z.string().max(255).trim().nullable().optional(),
    streetNumber: z.string().max(20).trim().nullable().optional(),
    city: z.string().max(100).trim().nullable().optional(),
    state: z.string().length(2).toUpperCase().nullable().optional(),
    zipCode: z
      .string()
      .regex(/^\d{5}-?\d{3}$/)
      .nullable()
      .optional(),
    additionalInfo: z.string().max(1000).trim().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Ao menos um campo deve ser fornecido para atualização",
  });

export type UpdatePatientDTO = z.infer<typeof UpdatePatientSchema>;

// ─── Response ─────────────────────────────────────────────────────────────────

export interface PatientResponseDTO {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  agreement: string | null;
  street: string | null;
  streetNumber: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  additionalInfo: string | null;
  createdAt: string;
  updatedAt: string;
}
