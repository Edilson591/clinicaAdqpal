import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Stethoscope } from "lucide-react";
import { InputGroup } from "../ui/Input";
import type { NovoProntuarioInput } from "../../validate/novoProntuario.schema";
import { FormSection } from "../Form/FormSection";

interface Props {
  register: UseFormRegister<NovoProntuarioInput>;
  errors: FieldErrors<NovoProntuarioInput>;
}

export function AnamneseSection({ register, errors }: Props) {
  return (
    <FormSection icon={Stethoscope} title="Anamnese">
      <InputGroup
        label="Queixa principal"
        required
        error={errors.queixaPrincipal?.message}
        inputProps={{
          placeholder: "Descreva o motivo principal da consulta",
          className: "bg-[#F8FAFC]",
          ...register("queixaPrincipal"),
        }}
      />

      <InputGroup
        label="História da doença atual (HDA)"
        required
        error={errors.hda?.message}
        textarea
        textareaProps={{
          placeholder:
            "Evolução dos sintomas, início, características, fatores de melhora e piora...",
          className: "min-h-[88px] bg-[#F8FAFC]",
          ...register("hda"),
        }}
      />

      <InputGroup
        label="Antecedentes pessoais e familiares"
        textarea
        textareaProps={{
          placeholder:
            "Doenças preexistentes, cirurgias, alergias, histórico familiar relevante...",
          className: "min-h-[64px] bg-[#F8FAFC]",
          ...register("antecedentes"),
        }}
      />
    </FormSection>
  );
}
