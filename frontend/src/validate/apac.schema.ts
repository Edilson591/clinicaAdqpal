import { z } from "zod";

export const apacPrintSchema = z.object({
  f3_nome_paciente: z.string().min(1, "Informe o nome do paciente."),
  f1_nome_estab: z.string().min(1, "Informe o nome do estabelecimento."),
  f41_prof_sol: z.string().min(1, "Informe o nome do profissional solicitante."),
  f18_proc: z.array(z.string()).refine(
    (arr) => arr.some((c) => c.trim() !== ""),
    { message: "Informe o código do procedimento principal." }
  ),
});
