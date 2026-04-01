import { Info } from "lucide-react";
import { FormSection } from "../Form/FormSection";
import { InputGroup } from "../ui/Input";
import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const InformacoesAdicionais = <T extends FieldValues>({ register, errors }: Props<T>) => {
  return (
    <FormSection icon={Info} title="Informações Adicionais">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_280px] gap-4">
        <InputGroup
          label="Observações"
          textareaProps={{
            placeholder: "Observações gerais, alergias, medicamentos em uso...",
            ...register("additionalInfo" as Path<T>),
            className: "bg-[#F8FAFC] resize-none",
            rows: 4,
          }}
          textarea={true}
          helperText={errors["additionalInfo"]?.message as string}
          error={errors["additionalInfo"]?.message as string}
        />

        <InputGroup
          label="Convênio"
          inputProps={{
            type: "text",
            placeholder: "Ex: Unimed, SulAmérica",
            ...register("agreement" as Path<T>),
            className: "bg-[#F8FAFC]",
          }}
          helperText={errors["agreement"]?.message as string}
          error={errors["agreement"]?.message as string}
        />
      </div>
    </FormSection>
  );
};
