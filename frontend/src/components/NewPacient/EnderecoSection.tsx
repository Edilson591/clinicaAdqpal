import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { InputGroup } from "../ui/Input";
import { FormSection } from "../Form/FormSection";
import { MapPin } from "lucide-react";
import { SelectGroup } from "../ui/Select";
import { formatCep } from "../../utils/formatCep";
import { ESTADOS } from "../../data/state";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const EnderecoSection = <T extends FieldValues>({
  register,
  errors,
}: Props<T>) => {
  return (
    <FormSection icon={MapPin} title="Endereço">
      {/* Rua + Número */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-4">
        <InputGroup
          label="Rua"
          inputProps={{
            type: "text",
            placeholder: "Ex: Rua das Flores",
            ...register("street" as Path<T>),
            className: "bg-[#F8FAFC]",
          }}
          helperText={errors["street"]?.message as string}
          error={errors["street"]?.message as string}
        />
        <InputGroup
          label="Número"
          inputProps={{
            type: "text",
            placeholder: "123",
            ...register("streetNumber" as Path<T>),
            className: "bg-[#F8FAFC]",
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            },
          }}
          helperText={errors["streetNumber"]?.message as string}
          error={errors["streetNumber"]?.message as string}
        />
      </div>

      {/* Cidade + Estado + CEP */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px] gap-4">
        <InputGroup
          label="Cidade"
          inputProps={{
            type: "text",
            placeholder: "Ex: São Paulo",
            ...register("city" as Path<T>),
            className: "bg-[#F8FAFC]",
          }}
          helperText={errors["city"]?.message as string}
          error={errors["city"]?.message as string}
        />

        <SelectGroup
          label="Estado"
          selectProps={{
            ...register("state" as Path<T>),
            className: "bg-[#F8FAFC]",
            options: ESTADOS.map((uf) => ({ value: uf, label: uf })),
          }}
          helperText={errors["state"]?.message as string}
          error={errors["state"]?.message as string}
        />

        <InputGroup
          label="CEP"
          inputProps={{
            type: "text",
            placeholder: "00000-000",
            ...register("zipCode" as Path<T>),
            onChange: (e) => {
              const formated = formatCep(e.target.value);
              e.target.value = formated;
            },
            maxLength: 9,
            className: "bg-[#F8FAFC]",
          }}
          helperText={errors["zipCode"]?.message as string}
          error={errors["zipCode"]?.message as string}
        />
      </div>
    </FormSection>
  );
};
