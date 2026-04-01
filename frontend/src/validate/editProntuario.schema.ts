import { z } from "zod";

export const editProntuarioSchema = z.object({
  diagnosis: z.string().nullable().optional(),
  prescription: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type EditProntuarioInput = z.infer<typeof editProntuarioSchema>;
