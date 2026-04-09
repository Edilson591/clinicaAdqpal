import { z } from "zod";

export const novaConsultaSchema = z
  .object({
    doctorId: z.string().min(1, "Médico é obrigatório"),
    patientId: z.string().min(1, "Paciente é obrigatório"),
    data: z.date({ message: "Data é obrigatória" }),
    hora: z
      .date({ message: "Hora é obrigatória" })
      .refine((date) => date === null || date instanceof Date, {
        message: "Hora inválida",
      }),
    type: z
      .enum(["IN_PERSON", "ONLINE", "HOME_CARE"])
      .refine((val) => val !== undefined, {
        message: "Tipo de consulta é obrigatório",
      }),
    // type: z.string().min(1, "Tipo de consulta é obrigatório"),
    specialtyId: z.string().min(1, "Especialidade é obrigatória"),
    roomId: z.string().optional(),
    meetingLink: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().min(3, "Observações são obrigatórias"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "IN_PERSON" && !data.roomId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sala/Consultório é obrigatório para consultas presenciais",
        path: ["roomId"],
      });
    }
    if (data.type === "ONLINE" && !data.meetingLink) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Link da reunião é obrigatório para consultas online",
        path: ["meetingLink"],
      });
    }
    if (data.type === "HOME_CARE" && !data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Endereço é obrigatório para consultas domiciliares",
        path: ["address"],
      });
    }
  });

export type NovaConsultaInput = z.infer<typeof novaConsultaSchema>;
