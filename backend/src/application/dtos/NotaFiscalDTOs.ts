import { z } from "zod";

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreateNotaFiscalSchema = z.object({
  patientId: z
    .string({ required_error: "Paciente é obrigatório" })
    .uuid("ID do paciente inválido"),
  appointmentId: z.string().uuid("ID da consulta inválido").nullable().optional(),
  transactionId: z.string().uuid("ID da transação inválido").nullable().optional(),
  servico: z
    .string({ required_error: "Serviço é obrigatório" })
    .min(2, "Serviço deve ter pelo menos 2 caracteres")
    .max(255)
    .trim(),
  valor: z
    .number({ required_error: "Valor é obrigatório" })
    .positive("Valor deve ser positivo"),
  observacoes: z.string().max(2000).trim().nullable().optional(),
});

export type CreateNotaFiscalDTO = z.infer<typeof CreateNotaFiscalSchema>;

// ─── Update ───────────────────────────────────────────────────────────────────

export const UpdateNotaFiscalSchema = z
  .object({
    servico: z.string().min(2).max(255).trim().optional(),
    valor: z.number().positive().optional(),
    observacoes: z.string().max(2000).trim().nullable().optional(),
    pdfUrl: z.string().url("URL do PDF inválida").nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Ao menos um campo deve ser fornecido para atualização",
  });

export type UpdateNotaFiscalDTO = z.infer<typeof UpdateNotaFiscalSchema>;

// ─── Response ─────────────────────────────────────────────────────────────────

export interface NotaFiscalResponseDTO {
  id: string;
  numero: string;
  patientId: string;
  appointmentId: string | null;
  transactionId: string | null;
  createdBy: string;
  servico: string;
  valor: number;
  status: string;
  dataEmissao: string | null;
  pdfUrl: string | null;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
}
