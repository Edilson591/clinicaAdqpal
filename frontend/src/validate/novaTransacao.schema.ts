import { z } from "zod";

export const novaTransacaoSchema = z.object({
  tipo: z.enum(["entrada", "saida"], { required_error: "Tipo é obrigatório" }),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((v) => !isNaN(parseFloat(v.replace(",", "."))) && parseFloat(v.replace(",", ".")) > 0, {
      message: "Valor deve ser maior que zero",
    }),
  data: z.string().min(1, "Data é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  observacoes: z.string().optional(),
});

export type NovaTransacaoInput = z.infer<typeof novaTransacaoSchema>;
