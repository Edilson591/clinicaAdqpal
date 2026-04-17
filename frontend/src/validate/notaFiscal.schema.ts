import { z } from "zod";

export const notaFiscalSchema = z.object({
  patientId: z
    .string({ required_error: "Paciente é obrigatório" })
    .min(1, "Paciente é obrigatório"),
  servico: z
    .string({ required_error: "Serviço é obrigatório" })
    .min(2, "Serviço deve ter pelo menos 2 caracteres")
    .max(255, "Serviço deve ter no máximo 255 caracteres"),
  valor: z
    .string({ required_error: "Valor é obrigatório" })
    .min(1, "Valor é obrigatório")
    .refine((v) => !isNaN(Number(v.replace(",", "."))) && Number(v.replace(",", ".")) > 0, {
      message: "Valor deve ser um número positivo",
    }),
  observacoes: z.string().max(2000, "Observações muito longas").optional().or(z.literal("")),
});

export type NotaFiscalInput = z.infer<typeof notaFiscalSchema>;
