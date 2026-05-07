import { z } from "zod";

export const editUserSchema = z
  .object({
    // ── Usuário ──────────────────────────────────────────────────────────────
    username: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100),
    email: z
      .string()
      .min(1, "E-mail é obrigatório")
      .email("Digite um e-mail válido"),
    roleId: z.number().min(1, "Selecione um perfil"),
    cpfOrCnpj: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val) ||
          /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val),
        "Informe um CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00) válido",
      ),
    newPassword: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)),
        "Senha deve ter mínimo 8 caracteres, uma maiúscula e um número",
      ),
    confirmPassword: z.string().optional(),

    especialidades: z.array(z.string()).optional(),

    // ── Funcionário ───────────────────────────────────────────────────────────
    isEmployee: z.boolean().default(false),
    position: z.string().optional(),
    department: z.string().optional(),
    phone: z.string().optional(),
    hireDate: z.string().optional(),
    salary: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    street: z.string().optional(),
    streetNumber: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && data.confirmPassword !== data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
      });
    }
    if (data.isEmployee && !data.position?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cargo é obrigatório para funcionários",
        path: ["position"],
      });
    }
  });

export type EditUserInput = z.infer<typeof editUserSchema>;
