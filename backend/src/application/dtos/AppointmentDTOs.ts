import { z } from "zod";

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreateAppointmentSchema = z.object({
  userId: z.string({ required_error: "userId é obrigatório" }).uuid("userId deve ser um UUID"),
  patientId: z.string({ required_error: "patientId é obrigatório" }).uuid("patientId deve ser um UUID"),
  scheduledAt: z.coerce.date({ required_error: "scheduledAt é obrigatório" }),
  medico: z.string().max(200).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export type CreateAppointmentDTO = z.infer<typeof CreateAppointmentSchema>;

// ─── Update ───────────────────────────────────────────────────────────────────

export const UpdateAppointmentSchema = z.object({
  userId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  scheduledAt: z.coerce.date().optional(),
  medico: z.string().max(200).nullable().optional(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  notes: z.string().max(1000).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Ao menos um campo deve ser fornecido para atualização",
});

export type UpdateAppointmentDTO = z.infer<typeof UpdateAppointmentSchema>;

// ─── Response ─────────────────────────────────────────────────────────────────

export interface AppointmentResponseDTO {
  id: string;
  userId: string;
  patientId: string;
  scheduledAt: string;
  medico: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Query filters ────────────────────────────────────────────────────────────

export const ListAppointmentsQuerySchema = z.object({
  userId:    z.string().uuid("userId deve ser UUID").optional(),
  patientId: z.string().uuid("patientId deve ser UUID").optional(),
  status:    z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  /** Dia exato — ex: 2026-04-06. O repositório converte para range 00:00–23:59 */
  date:      z.coerce.date().optional(),
  /** Hora de início HH:MM — exige date */
  timeStart: z.string().regex(/^\d{2}:\d{2}$/, "timeStart deve ser HH:MM").optional(),
  /** Hora de fim HH:MM — exige date */
  timeEnd:   z.string().regex(/^\d{2}:\d{2}$/, "timeEnd deve ser HH:MM").optional(),
  dateStart: z.coerce.date().optional(),
  dateEnd:   z.coerce.date().optional(),
  search:    z.string().max(100).optional(),
}).refine(
  (d) => !d.dateStart || !d.dateEnd || d.dateStart <= d.dateEnd,
  { message: "dateStart deve ser anterior a dateEnd", path: ["dateStart"] },
);

export type ListAppointmentsQuery = z.infer<typeof ListAppointmentsQuerySchema>;

export const ListByPartyQuerySchema = z.object({
  status:    z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  /** Dia exato — ex: 2026-04-06. O repositório converte para range 00:00–23:59 */
  date:      z.coerce.date().optional(),
  /** Hora de início HH:MM */
  timeStart: z.string().regex(/^\d{2}:\d{2}$/, "timeStart deve ser HH:MM").optional(),
  /** Hora de fim HH:MM */
  timeEnd:   z.string().regex(/^\d{2}:\d{2}$/, "timeEnd deve ser HH:MM").optional(),
  dateStart: z.coerce.date().optional(),
  dateEnd:   z.coerce.date().optional(),
}).refine(
  (d) => !d.dateStart || !d.dateEnd || d.dateStart <= d.dateEnd,
  { message: "dateStart deve ser anterior a dateEnd", path: ["dateStart"] },
);

export type ListByPartyQuery = z.infer<typeof ListByPartyQuerySchema>;

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

export const SendWhatsAppSchema = z.object({
  telefone: z
    .string({ required_error: "telefone é obrigatório" })
    .regex(/^\+?[1-9]\d{7,14}$/, "Telefone inválido. Use formato internacional: +5511999999999"),
});

export type SendWhatsAppDTO = z.infer<typeof SendWhatsAppSchema>;
