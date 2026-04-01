import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Activity } from "lucide-react";
import { InputGroup } from "../ui/Input";
import type { NovoProntuarioInput } from "../../validate/novoProntuario.schema";
import { FormSection } from "../Form/FormSection";

interface Props {
  register: UseFormRegister<NovoProntuarioInput>;
  errors: FieldErrors<NovoProntuarioInput>;
}

const VITAIS = [
  { name: "pa", label: "PA (mmHg)", placeholder: "120/80" },
  { name: "fc", label: "FC (bpm)", placeholder: "80" },
  { name: "temperatura", label: "Temp (°C)", placeholder: "36.5" },
  { name: "spo2", label: "SpO₂ (%)", placeholder: "98" },
  { name: "peso", label: "Peso (kg)", placeholder: "70" },
  { name: "altura", label: "Altura (cm)", placeholder: "170" },
] as const;

export function ExameFisicoSection({ register, errors }: Props) {
  return (
    <FormSection icon={Activity} title="Exame Físico">
      {/* Vitais — pen: oxD1L · 6 colunas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {VITAIS.map(({ name, label, placeholder }) => (
          <InputGroup
            key={name}
            label={label}
            error={errors[name]?.message}
            inputProps={{
              placeholder,
              size: "sm",
              className:"bg-[#F8FAFC]",
              ...register(name),
            }}
          />
        ))}
      </div>

      <InputGroup
        label="Descrição do exame físico geral"
        textarea
        textareaProps={{
          placeholder: "Paciente em bom estado geral, consciente, orientado...",
          className: "min-h-[72px] bg-[#F8FAFC]",
          ...register("exameFisicoGeral"),
        }}
      />
    </FormSection>
  );
}
