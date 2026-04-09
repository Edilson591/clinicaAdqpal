import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Stethoscope } from "lucide-react";
import { InputGroup } from "../ui/Input";
import type { NovoProntuarioInput } from "../../validate/novoProntuario.schema";
import { FormSection } from "../Form/FormSection";
import { VoiceTextarea } from "../ui/VoiceTextarea";

interface Props {
  register: UseFormRegister<NovoProntuarioInput>;
  errors: FieldErrors<NovoProntuarioInput>;
  watch: UseFormWatch<NovoProntuarioInput>;
  setValue: UseFormSetValue<NovoProntuarioInput>;
}

export function AnamneseSection({ register, errors, watch, setValue }: Props) {
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

      <VoiceTextarea
        label="História da doença atual (HDA)"
        required
        error={errors.hda?.message}
        placeholder="Evolução dos sintomas, início, características, fatores de melhora e piora..."
        className="min-h-[88px] bg-[#F8FAFC]"
        currentValue={watch("hda") ?? ""}
        onTranscriptAppend={(val) => setValue("hda", val)}
        {...register("hda")}
      />

      <VoiceTextarea
        label="Antecedentes pessoais e familiares"
        placeholder="Doenças preexistentes, cirurgias, alergias, histórico familiar relevante..."
        className="min-h-[64px] bg-[#F8FAFC]"
        currentValue={watch("antecedentes") ?? ""}
        onTranscriptAppend={(val) => setValue("antecedentes", val)}
        {...register("antecedentes")}
      />
    </FormSection>
  );
}
