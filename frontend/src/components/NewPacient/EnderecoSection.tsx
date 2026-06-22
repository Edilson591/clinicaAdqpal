import { useState } from "react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormRegister,
} from "react-hook-form";
import { InputGroup } from "../ui/Input";
import { FormSection } from "../Form/FormSection";
import { Loader2, MapPin } from "lucide-react";
import { SelectGroup } from "../ui/Select";
import { formatCep } from "../../utils/formatCep";
import { ESTADOS } from "../../data/state";
import { fetchAddressByCep } from "../../services/Cep";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
}

export const EnderecoSection = <T extends FieldValues>({
  register,
  setValue,
  errors,
}: Props<T>) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const fillAddressByCep = async (cep: string) => {
    if (cep.replace(/\D/g, "").length !== 8) return;

    setIsLoadingCep(true);
    const address = await fetchAddressByCep(cep).finally(() => setIsLoadingCep(false));

    if (!address) return;

    setValue("street" as Path<T>, address.street as PathValue<T, Path<T>>);
    setValue("city" as Path<T>, address.city as PathValue<T, Path<T>>);
    setValue("state" as Path<T>, address.state as PathValue<T, Path<T>>);
  };

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
            onBlur: (e) => void fillAddressByCep(e.target.value),
            maxLength: 9,
            className: "bg-[#F8FAFC]",
          }}
          helperText={errors["zipCode"]?.message as string}
          error={errors["zipCode"]?.message as string}
        />
      </div>
      {isLoadingCep && (
        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#38A169]">
          <Loader2 className="size-4 animate-spin" />
          Buscando endereço pelo CEP...
        </div>
      )}
    </FormSection>
  );
};
