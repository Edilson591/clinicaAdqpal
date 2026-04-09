import { Info } from "lucide-react";
import { FormSection } from "../Form/FormSection";
import { InputGroup } from "../ui/Input";
import { VoiceTextarea } from "../ui/VoiceTextarea";
import type { FieldErrors, FieldValues, Path, UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
}

export const InformacoesAdicionais = <T extends FieldValues>({ register, errors, watch, setValue }: Props<T>) => {
  return (
    <FormSection icon={Info} title="Informações Adicionais">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_280px] gap-4">
        <VoiceTextarea
          label="Observações"
          error={errors["additionalInfo"]?.message as string}
          placeholder="Observações gerais, alergias, medicamentos em uso..."
          className="bg-[#F8FAFC] resize-none"
          rows={4}
          currentValue={String(watch("additionalInfo" as Path<T>) ?? "")}
          onTranscriptAppend={(val) => setValue("additionalInfo" as Path<T>, val as any)}
          {...register("additionalInfo" as Path<T>)}
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
