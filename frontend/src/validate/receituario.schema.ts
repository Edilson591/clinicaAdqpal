import { z } from "zod";

const requiredString = (msg: string) => z.string().min(1, msg);

export const receituarioExamesSchema = z.object({
  examPatient: requiredString("Informe o nome do paciente."),
  examJustificativa: requiredString("Informe a justificativa."),
  examSelected: z.array(z.string()),
  examOther: z.string().optional(),
}).refine(
  (data) => data.examSelected.length > 0 || !!data.examOther?.trim(),
  { message: "Selecione pelo menos um exame ou informe um exame não listado." },
);

export const receituarioReceitaSchema = z.object({
  patient: requiredString("Informe o nome do paciente."),
  medicamentos: requiredString("Informe os medicamentos prescritos."),
});

export const receituarioControleSchema = z.object({
  cePacNome: requiredString("Informe o nome do paciente."),
  cePrescricao: requiredString("Informe a prescrição."),
});

export const receituarioEncaminhamentoSchema = z.object({
  encPatient: requiredString("Informe o nome do paciente."),
  encEspec: z.string().optional(),
  encDest: z.string().optional(),
  encJust: requiredString("Informe a justificativa."),
}).refine(
  (data) => data.encEspec || data.encDest,
  { message: "Informe a especialidade ou o destino do encaminhamento." }
);

export const receituarioAutorizacaoSchema = z.object({
  autNome: requiredString("Informe o nome do paciente."),
  autDn: requiredString("Informe a data de nascimento."),
  autCpf: requiredString("Informe o CPF do paciente."),
  autRg: requiredString("Informe o RG do paciente."),
  autSus: requiredString("Informe o número do Cartão SUS."),
  autTipo: requiredString("Informe o tipo de exame."),
});
