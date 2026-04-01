import { z } from "zod";

export const novaConsultaSchema = z.object({
  doctorId: z.string().min(1, "Médico é obrigatório"),
  patientId: z.string().min(1, "Paciente é obrigatório"),
  data: z.date({ message: "Data é obrigatória" }),
  hora: z
    .date({ message: "Hora é obrigatória" }) // mensagem se não informar
    .refine((date) => date === null || date instanceof Date, {
      message: "Hora inválida",
    }),
  notes: z.string().min(3, "Observações são obrigatórias"),
});

export type NovaConsultaInput = z.infer<typeof novaConsultaSchema>;
