import { z } from "zod";

export const novoProntuarioSchema = z.object({
  // Identificação
  pacienteId: z.string().min(1, "Paciente é obrigatório"),
  appointmentId: z.string().min(1, "Consulta é obrigatória"),
  dataConsulta: z.string().min(1, "Data da consulta é obrigatória"),
  tipoConsulta: z.string().min(1, "Tipo de consulta é obrigatório"),
  medicoResponsavel: z.string().min(1, "Médico responsável é obrigatório"),
  // Anamnese
  queixaPrincipal: z.string().min(1, "Queixa principal é obrigatória"),
  hda: z.string().min(1, "História da doença atual é obrigatória"),
  antecedentes: z.string().optional(),
  // Exame físico — vitais opcionais
  pa: z.string().optional(),
  fc: z.string().optional(),
  temperatura: z.string().optional(),
  spo2: z.string().optional(),
  peso: z.string().optional(),
  altura: z.string().optional(),
  exameFisicoGeral: z.string().optional(),
  // Diagnóstico
  cid10: z.string().optional(),
  hipoteseDiagnostica: z.string().min(1, "Hipótese diagnóstica é obrigatória"),
  conduta: z.string().min(1, "Conduta é obrigatória"),
});

export type NovoProntuarioInput = z.infer<typeof novoProntuarioSchema>;
