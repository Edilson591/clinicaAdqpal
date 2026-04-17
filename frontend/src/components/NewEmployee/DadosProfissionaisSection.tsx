import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { InputGroup } from "../ui/Input";
import { FormSection } from "../Form/FormSection";
import { Briefcase } from "lucide-react";
// import type { Path } from "react-router-dom";
import { BirthDatePickerInput } from "../ui/DatePickerInput";
import { SearchableSelect } from "../ui/SearchableSelect";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  isEdition?: boolean;
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
  { value: "ON_LEAVE", label: "Em Licença" },
  { value: "TERMINATED", label: "Desligado" },
];

export const DadosProfissionaisSection = <T extends FieldValues>({
  register,
  control,
  errors,
  isEdition = false,
}: Props<T>) => {
  return (
    <FormSection icon={Briefcase} title="Dados Profissionais">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup
          label="Cargo"
          required
          error={errors.position?.message as Path<T>}
          inputProps={{
            placeholder: "Ex: Médico, Recepcionista",
            className: "bg-[#F8FAFC]",
            ...register("position" as Path<T>),
          }}
        />
        <InputGroup
          label="Departamento"
          inputProps={{
            placeholder: "Ex: Clínica Geral",
            className: "bg-[#F8FAFC]",
            ...register("department" as Path<T>),
          }}
        />
        <Controller
          name={"hireDate" as Path<T>}
          control={control}
          render={({ field }) => (
            <BirthDatePickerInput
              label="Data de admissão"
              required
              error={errors.hireDate?.message as string}
              selected={field.value ? new Date(field.value) : new Date()}
              onChange={(date) =>
                field.onChange(date ? date.toISOString().split("T")[0] : "")
              }
            />
          )}
        />

        <Controller
          name={"salary" as Path<T>}
          control={control}
          rules={{
            pattern: {
              value: /^(\d{1,3}(\.\d{3})*|\d+)(,\d{1,2})?$/,
              message: "Formato de salário inválido",
            },
          }}
          render={({ field }) => (
            <InputGroup
              label="Salário (R$)"
              error={errors.salary?.message as string}
              inputProps={{
                type: "text",
                placeholder: "0,00",
                className: "bg-[#F8FAFC]",
                value: field.value || "",
                onChange: (e) => {
                  let value = e.target.value;

                  // remove tudo que não for número, . ou ,
                  value = value.replace(/[^0-9.,]/g, "");

                  // impede começar com . ou ,
                  value = value.replace(/^[.,]+/, "");

                  const parts = value.split(/[.,]/);

                  if (parts.length > 2) {
                    value = parts.slice(0, 2).join(".");
                  }

                  field.onChange(value);
                },
              }}
            />
          )}
        />
        {isEdition && (
          <Controller
            name={"status" as Path<T>}
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#374151] dark:text-[#CBD5E1]">
                  Status
                </label>
                <SearchableSelect
                  options={STATUS_OPTIONS}
                  value={field.value}
                  onChange={(v) =>
                    field.onChange(
                      v as "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED",
                    )
                  }
                  className="h-14 text-sm"
                />
              </div>
            )}
          />
        )}
      </div>
    </FormSection>
  );
};
