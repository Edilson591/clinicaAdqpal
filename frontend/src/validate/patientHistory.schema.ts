import { z } from "zod";

export const HISTORY_TYPE_OPTIONS = [
  // { value: "CONSULTA", label: "Consulta" },
  { value: "EXAME", label: "Exame" },
  { value: "PRESCRICAO", label: "Prescrição" },
  { value: "OBSERVACAO", label: "Observação" },
  { value: "SOLICITACAO", label: "Solicitação" },
] as const;

export const patientHistorySchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

export type PatientHistoryInput = z.infer<typeof patientHistorySchema>;
