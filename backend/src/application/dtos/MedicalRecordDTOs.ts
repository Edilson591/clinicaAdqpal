import { z } from "zod";

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreateMedicalRecordSchema = z.object({
  appointmentId: z.string().uuid().nullable().optional(),
  patientId: z.string({ required_error: "patientId é obrigatório" }).uuid(),
  diagnosis: z.string().max(2000).nullable().optional(),
  prescription: z.string().max(2000).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type CreateMedicalRecordDTO = z.infer<typeof CreateMedicalRecordSchema>;

// ─── Update ───────────────────────────────────────────────────────────────────

export const UpdateMedicalRecordSchema = z.object({
  diagnosis: z.string().max(2000).nullable().optional(),
  prescription: z.string().max(2000).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Ao menos um campo deve ser fornecido para atualização",
});

export type UpdateMedicalRecordDTO = z.infer<typeof UpdateMedicalRecordSchema>;

// ─── Response ─────────────────────────────────────────────────────────────────

export interface MedicalRecordResponseDTO {
  id: string;
  appointmentId: string | null;
  patientId: string;
  diagnosis: string | null;
  prescription: string | null;
  notes: string | null;
  patient: { id: string; name: string; phone?: string | null; email?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}
