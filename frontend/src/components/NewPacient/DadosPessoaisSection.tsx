import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { SelectGroup } from "../ui/Select";
import { InputGroup } from "../ui/Input";
import { formatCpf } from "../../utils/formatCpf";
import { FormSection } from "../Form/FormSection";
import { User2Icon } from "lucide-react";
import { BirthDatePickerInput } from "../ui/DatePickerInput";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
}

export const DadosPessoaisSection = <T extends FieldValues>({ register, errors, control }: Props<T>) => {
  const opcoesGender = [
    { value: "", label: "Selecione" },
    { value: "feminino", label: "Feminino" },
    { value: "masculino", label: "Masculino" },
    { value: "outro", label: "Outro" },
    { value: "prefiro_nao_informar", label: "Prefiro não informar" },
  ];
  return (
    <FormSection icon={User2Icon} title="Dados Pessoais">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup
          label="Nome completo"
          inputProps={{
            placeholder: "Ex: Maria Oliveira",
            ...register("name" as Path<T>),
            className: "bg-[#F8FAFC]",
          }}
          helperText={errors["name"]?.message as string}
          error={errors["name"]?.message as string}
        />

        <Controller
          name={"dateOfBirth" as Path<T>}
          control={control}
          render={({ field }) => (
            <BirthDatePickerInput
              label="Data de nascimento"
              required
              error={errors.dateOfBirth?.message as string}
              selected={field.value ? new Date(field.value) : new Date()}
              onChange={(date) =>
                field.onChange(date ? date.toISOString().split("T")[0] : "")
              }
            />
          )}
        />

        <InputGroup
          label="CPF"
          inputProps={{
            type: "text",
            placeholder: "000.000.000-00",
            ...register("cpf" as Path<T>),
            onChange: (e) => {
              const formatted = formatCpf(e.target.value);
              e.target.value = formatted;
            },
            maxLength: 14,
            className: "bg-[#F8FAFC]",
          }}
          helperText={errors["cpf"]?.message as string}
          error={errors["cpf"]?.message as string}
        />

        <SelectGroup
          label="Gênero"
          selectProps={{
            ...register("gender" as Path<T>),
            className: "bg-[#F8FAFC]",
            options: opcoesGender,
          }}
          helperText={errors["gender"]?.message as string}
          error={errors["gender"]?.message as string}
        />
      </div>
    </FormSection>
  );
};
