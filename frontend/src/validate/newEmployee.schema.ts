import { z } from "zod";

export const newEmployeeSchema = z
  .object({
    // ── Identificação ─────────────────────────────────────────────────────────
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    cpf: z
      .string()
      .min(1, "CPF é obrigatório")
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (000.000.000-00)"),

    dateOfBirth: z.string().min(1, "Data de nascimento é obrigatória"),
    phone: z.string().min(1, "Telefone é obrigatório"),
    gender: z.string().min(1, "Gênero é obrigatório"),

    // ── Dados profissionais ───────────────────────────────────────────────────
    position: z.string().min(1, "Cargo é obrigatório"),
    department: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]),
    hireDate: z.string().min(1, "Data de adimissão é obrigatória"),
    salary: z.string().min(1, "Salário é obrigatório"),

    // ── Endereço ──────────────────────────────────────────────────────────────
    street: z.string().optional(),
    streetNumber: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z
      .string()
      .transform((v) => v?.replace(/\D/g, ""))
      .refine((v) => !v || v.length === 8, {
        message: "CEP deve ter 8 dígitos",
      })
      .nullable()
      .optional(),

    // ── Observações ───────────────────────────────────────────────────────────
    notes: z.string().optional(),

    // ── Acesso ao sistema (opcional) ──────────────────────────────────────────
    hasSystemAccess: z.boolean().default(false),
    username: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    roleId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasSystemAccess) return;

    if (!data.username || data.username.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nome de usuário deve ter pelo menos 2 caracteres",
        path: ["username"],
      });
    }

    if (!data.password || data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Senha deve ter mínimo 8 caracteres",
        path: ["password"],
      });
    } else if (!/[A-Z]/.test(data.password) || !/[0-9]/.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Senha deve conter pelo menos uma maiúscula e um número",
        path: ["password"],
      });
    }

    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
      });
    }

    if (!data.roleId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione um perfil de acesso",
        path: ["roleId"],
      });
    }
  });

export type NewEmployeeInput = z.infer<typeof newEmployeeSchema>;
