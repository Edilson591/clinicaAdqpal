import { z } from "zod";

// ─── Register ─────────────────────────────────────────────────────────────────

export const RegisterUserSchema = z.object({
  username: z
    .string({ required_error: "Username é obrigatório" })
    .min(3, "Username deve ter pelo menos 3 caracteres")
    .max(50, "Username deve ter no máximo 50 caracteres")
    .trim(),
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email("Digite um e-mail válido")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(72, "Senha deve ter no máximo 72 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  roleId: z
    .number({ required_error: "roleId é obrigatório" })
    .int()
    .positive("roleId deve ser um número positivo"),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve ter 11 dígitos numéricos")
    .nullable()
    .optional(),
  cnpj: z
    .string()
    .regex(/^\d{14}$/, "CNPJ deve ter 14 dígitos numéricos")
    .nullable()
    .optional(),
  specialtyIds: z.array(z.string().uuid()).optional(),
});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;

// ─── Login ────────────────────────────────────────────────────────────────────

export const LoginUserSchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email("Digite um e-mail válido")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(1, "Senha é obrigatória"),
});

export type LoginUserDTO = z.infer<typeof LoginUserSchema>;

// ─── auth 2FA ────────────────────────────────────────────────────────────────────

export const Verify2FACodeSchema = z.object({
  code: z
    .string({ required_error: "Código de verificação é obrigatório" })
    .length(6, "O código deve ter exatamente 6 dígitos")
    .regex(/^\d+$/, "O código deve conter apenas números"),
});

export type Verify2FACodeDTO = z.infer<typeof Verify2FACodeSchema>;

// ─── resend code ───────────────────────────────────────────────────────────────────

export const PreLoginResendSchema = z.object({
  userId: z
    .string({ required_error: "ID do usuário é obrigatório" })
    .uuid("ID do usuário inválido"),

  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email("E-mail inválido")
    .toLowerCase()
    .trim(),
});

export type PreLoginResendDTO = z.infer<typeof PreLoginResendSchema>;

// ─── Update ───────────────────────────────────────────────────────────────────

export const Verify2FASchema = z.object({
  userId: z
    .string({ required_error: "ID do usuário é obrigatório" })
    .uuid("ID do usuário inválido"), // Se usar UUID no banco do ADQPAL, mantém assim. Caso contrário, remova o .uuid()

  code: z
    .string({ required_error: "Código de verificação é obrigatório" })
    .length(6, "O código deve ter exatamente 6 dígitos")
    .regex(/^\d+$/, "O código deve conter apenas números"), // Garante que não enviem letras

  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email("E-mail inválido")
    .toLowerCase()
    .trim(),

  roleId: z
    .number({ required_error: "ID do cargo é obrigatório" })
    .int("ID do cargo inválido")
    .positive(),
});

export type Verify2FADTO = z.infer<typeof Verify2FASchema>;

export const UpdateUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username deve ter pelo menos 3 caracteres")
      .max(50)
      .trim()
      .optional(),
    email: z
      .string()
      .email("Digite um e-mail válido")
      .toLowerCase()
      .trim()
      .optional(),
    currentPassword: z.string().optional(),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(72)
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número")
      .optional(),
    roleId: z.number().int().positive().optional(),
    cpf: z
      .string()
      .regex(/^\d{11}$/, "CPF deve ter 11 dígitos")
      .nullable()
      .optional(),
    cnpj: z
      .string()
      .regex(/^\d{14}$/, "CNPJ deve ter 14 dígitos")
      .nullable()
      .optional(),
    specialtyIds: z.array(z.string().uuid()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Ao menos um campo deve ser fornecido para atualização",
  })
  .refine((data) => !data.password || !!data.currentPassword, {
    message: "Senha atual é obrigatória para alterar a senha",
    path: ["currentPassword"],
  });

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

// ─── Response ─────────────────────────────────────────────────────────────────

export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  roleId: number;
  cpf: string | null;
  cnpj: string | null;
  specialties?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponseDTO {
  token: string;
  user: UserResponseDTO;
}

export interface PreLoginResponseDTO {
  preAuthToken: string;
  user: UserResponseDTO; // Seu DTO de retorno de usuário padrão
}

export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}
