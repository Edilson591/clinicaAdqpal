import { z, ZodObject, type ZodRawShape } from "zod";
import { useForm, type Resolver, type UseFormProps, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Hook base para formulários do projeto.
 * Integra react-hook-form + Zod via zodResolver.
 *
 * @param schema  - Schema Zod que define os campos e validações
 * @param options - Opções opcionais do useForm (ex: defaultValues, mode)
 *
 * @example
 * const { register, handleSubmit, formState: { errors } } = useZodForm(loginSchema, {
 *   defaultValues: { email: "", password: "" },
 * });
 */
export const useZodForm = <TSchema extends ZodObject<ZodRawShape>>(
  schema: TSchema,
  options?: UseFormProps<z.infer<TSchema>>,
): UseFormReturn<z.infer<TSchema>> => {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema) as Resolver<z.infer<TSchema>>,
    ...options,
  });
};
