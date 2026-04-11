import { z } from "zod";

// ─── Create ───────────────────────────────────────────────────────────────────

export const CreateAppointmentSchema = z.object({
  userId: z.string({ required_error: "userId é obrigatório" }).uuid("userId deve ser um UUID"),
  patientId: z.string({ required_error: "patientId é obrigatório" }).uuid("patientId deve ser um UUID"),
  scheduledAt: z.coerce.date({ required_error: "scheduledAt é obrigatório" }),
  medico: z.string().max(200).nullable().optional(),
  type: z.enum(["IN_PERSON", "ONLINE", "HOME_CARE"]).optional(),
  specialtyId: z.string().uuid("specialtyId deve ser um UUID").nullable().optional(),
  roomId: z.string().max(100).nullable().optional(),
  meetingLink: z.string().max(500).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
}).superRefine((data, ctx) => {
  const type = data.type ?? "IN_PERSON";
  if (type === "IN_PERSON" && !data.roomId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Sala/Consultório é obrigatório para consultas presenciais", path: ["roomId"] });
  }
  if (type === "ONLINE" && !data.meetingLink) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Link da reunião é obrigatório para consultas online", path: ["meetingLink"] });
  }
  if (type === "HOME_CARE" && !data.address) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Endereço é obrigatório para consultas domiciliares", path: ["address"] });
  }
});

export type CreateAppointmentDTO = z.infer<typeof CreateAppointmentSchema>;

// ─── Update ───────────────────────────────────────────────────────────────────

export const UpdateAppointmentSchema = z.object({
  userId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  scheduledAt: z.coerce.date().optional(),
  medico: z.string().max(200).nullable().optional(),
  status: z.enum(["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELED", "NO_SHOW", "CANCELLED"]).optional(),
  type: z.enum(["IN_PERSON", "ONLINE", "HOME_CARE"]).optional(),
  specialtyId: z.string().uuid().nullable().optional(),
  roomId: z.string().max(100).nullable().optional(),
  meetingLink: z.string().max(500).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
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
  status: "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "NO_SHOW" | "CANCELLED";
  type: "IN_PERSON" | "ONLINE" | "HOME_CARE";
  pacient: { id: string; name: string; phone?: string | null; email?: string | null } | null;
  specialtyId: string | null;
  roomId: string | null;
  meetingLink: string | null;
  address: string | null;
  notes: string | null;
  medicalRecordId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Query filters ────────────────────────────────────────────────────────────

export const ListAppointmentsQuerySchema = z.object({
  userId:    z.string().uuid("userId deve ser UUID").optional(),
  patientId: z.string().uuid("patientId deve ser UUID").optional(),
  status:    z.enum(["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELED", "NO_SHOW", "CANCELLED"]).optional(),
  /** Dia exato — ex: 2026-04-06. O repositório converte para range 00:00–23:59 */
  date:      z.coerce.date().optional(),
  /** Hora de início HH:MM — exige date */
  timeStart: z.string().regex(/^\d{2}:\d{2}$/, "timeStart deve ser HH:MM").optional(),
  /** Hora de fim HH:MM — exige date */
  timeEnd:   z.string().regex(/^\d{2}:\d{2}$/, "timeEnd deve ser HH:MM").optional(),
  dateStart: z.coerce.date().optional(),
  dateEnd:   z.coerce.date().optional(),
  search:    z.string().max(100).optional(),
  order:     z.enum(["asc", "desc"]).optional(),
}).refine(
  (d) => !d.dateStart || !d.dateEnd || d.dateStart <= d.dateEnd,
  { message: "dateStart deve ser anterior a dateEnd", path: ["dateStart"] },
);

export type ListAppointmentsQuery = z.infer<typeof ListAppointmentsQuerySchema>;

export const ListByPartyQuerySchema = z.object({
  status:    z.enum(["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELED", "NO_SHOW", "CANCELLED"]).optional(),
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
