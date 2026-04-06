import { z } from "zod";
import type { PatientHistory } from "../../domain/entities/PatientHistory";

export const HISTORY_TYPES = [
  "CONSULTA",
  "EXAME",
  "PRESCRICAO",
  "OBSERVACAO",
  "SOLICITACAO",
] as const;

export const CreatePatientHistorySchema = z.object({
  appointmentId: z.string().uuid().optional().nullable(),
  type: z.enum(HISTORY_TYPES),
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres").max(200),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  attachments: z.array(z.string().url("URL de anexo inválida")).optional().default([]),
});

export type CreatePatientHistoryDTO = z.infer<typeof CreatePatientHistorySchema>;

export interface PatientHistoryResponseDTO {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string | null;
  type: string;
  title: string;
  description: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export function toPatientHistoryResponseDTO(h: PatientHistory): PatientHistoryResponseDTO {
  return {
    id: h.id,
    patientId: h.patientId,
    doctorId: h.doctorId,
    appointmentId: h.appointmentId,
    type: h.type,
    title: h.title,
    description: h.description,
    attachments: h.attachments,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  };
}
