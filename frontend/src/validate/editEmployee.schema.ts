import { z } from "zod";

export const editEmployeeSchema = z
  .object({
    // ── Identificação ─────────────────────────────────────────────────────────
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    cpf: z.string().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),

    // ── Dados profissionais ───────────────────────────────────────────────────
    position: z.string().min(1, "Cargo é obrigatório"),
    department: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]),
    hireDate: z.string().optional(),
    salary: z.string().optional(),

    // ── Endereço ──────────────────────────────────────────────────────────────
    street: z.string().optional(),
    streetNumber: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),

    // ── Observações ───────────────────────────────────────────────────────────
    notes: z.string().optional(),

    // ── Acesso ao sistema (opcional) ──────────────────────────────────────────
    hasSystemAccess: z.boolean().default(false),
    username: z.string().optional(),
    roleId: z.string().optional(),
    // Senha opcional — só valida se preenchida
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
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

    if (!data.roleId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione um perfil de acesso",
        path: ["roleId"],
      });
    }

    // Senha só é obrigatória na criação (sem userId). Validada se preenchida.
    if (data.password) {
      if (data.password.length < 8) {
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
    }
  });

export type EditEmployeeInput = z.infer<typeof editEmployeeSchema>;
