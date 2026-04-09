import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Microscope } from "lucide-react";
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

export function DiagnosticoSection({ register, errors, watch, setValue }: Props) {
  return (
    <FormSection icon={Microscope} title="Diagnóstico e Conduta">
      {/* Row: CID-10 (w:160) + Hipótese (fill) — pen: z8QZa */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-40">
          <InputGroup
            label="CID-10"
            error={errors.cid10?.message}
            inputProps={{
              placeholder: "Ex: J11",
              className:"bg-[#F8FAFC]",
              ...register("cid10"),
            }}
          />
        </div>
        <div className="flex-1">
          <InputGroup
            label="Hipótese diagnóstica"
            required
            error={errors.hipoteseDiagnostica?.message}
            inputProps={{
              placeholder: "Diagnóstico provável",
              className:"bg-[#F8FAFC]",
              ...register("hipoteseDiagnostica"),
            }}
          />
        </div>
      </div>

      <VoiceTextarea
        label="Conduta / Prescrição"
        required
        error={errors.conduta?.message}
        placeholder="Medicamentos prescritos, dosagem, orientações ao paciente, retorno em..."
        className="min-h-[88px] bg-[#F8FAFC]"
        currentValue={watch("conduta") ?? ""}
        onTranscriptAppend={(val) => setValue("conduta", val)}
        {...register("conduta")}
      />
    </FormSection>
  );
}
