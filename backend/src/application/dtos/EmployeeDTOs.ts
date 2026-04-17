import { z } from "zod";

const employeeStatusValues = ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"] as const;

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreateEmployeeSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100)
    .trim(),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve ter 11 dígitos numéricos")
    .nullable()
    .optional(),
  email: z
    .string()
    .email("Digite um e-mail válido")
    .toLowerCase()
    .trim()
    .nullable()
    .optional(),
  phone: z.string().max(20).trim().nullable().optional(),
  position: z
    .string({ required_error: "Cargo é obrigatório" })
    .min(2, "Cargo deve ter pelo menos 2 caracteres")
    .max(100)
    .trim(),
  department: z.string().max(100).trim().nullable().optional(),
  hireDate: z.string().nullable().optional(),
  salary: z.number().nonnegative("Salário não pode ser negativo").nullable().optional(),
  status: z.enum(employeeStatusValues).default("ACTIVE"),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().max(50).trim().nullable().optional(),
  street: z.string().max(255).trim().nullable().optional(),
  streetNumber: z.string().max(20).trim().nullable().optional(),
  city: z.string().max(100).trim().nullable().optional(),
  state: z
    .string()
    .length(2, "UF deve ter 2 letras")
    .toUpperCase()
    .nullable()
    .optional(),
  zipCode: z
    .string()
    .transform((v) => v?.replace(/\D/g, ""))
    .refine((v) => !v || v.length === 8, { message: "CEP deve ter 8 dígitos" })
    .nullable()
    .optional(),
  notes: z.string().max(2000).trim().nullable().optional(),
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;

// ─── Update ───────────────────────────────────────────────────────────────────

export const UpdateEmployeeSchema = z
  .object({
    name: z.string().min(2).max(100).trim().optional(),
    cpf: z.string().regex(/^\d{11}$/).nullable().optional(),
    email: z.string().email().toLowerCase().trim().nullable().optional(),
    phone: z.string().max(20).trim().nullable().optional(),
    position: z.string().min(2).max(100).trim().optional(),
    department: z.string().max(100).trim().nullable().optional(),
    hireDate: z.string().nullable().optional(),
    salary: z.number().nonnegative().nullable().optional(),
    status: z.enum(employeeStatusValues).optional(),
    dateOfBirth: z.string().nullable().optional(),
    gender: z.string().max(50).trim().nullable().optional(),
    street: z.string().max(255).trim().nullable().optional(),
    streetNumber: z.string().max(20).trim().nullable().optional(),
    city: z.string().max(100).trim().nullable().optional(),
    state: z.string().length(2).toUpperCase().nullable().optional(),
    zipCode: z
      .string()
      .regex(/^\d{5}-?\d{3}$/)
      .nullable()
      .optional(),
    notes: z.string().max(2000).trim().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Ao menos um campo deve ser fornecido para atualização",
  });

export type UpdateEmployeeDTO = z.infer<typeof UpdateEmployeeSchema>;

// ─── Response ─────────────────────────────────────────────────────────────────

export interface EmployeeResponseDTO {
  id: string;
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  position: string;
  department: string | null;
  hireDate: string | null;
  salary: number | null;
  status: string;
  dateOfBirth: string | null;
  gender: string | null;
  street: string | null;
  streetNumber: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
