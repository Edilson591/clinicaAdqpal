import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { ClipboardList } from "lucide-react";
import { InputGroup } from "../ui/Input";
import { SelectGroup } from "../ui/Select";
import { DatePickerInput } from "../ui/DatePickerInput";
import { usePatients } from "../../hooks/usePatients";
import { useAppointmentsByPatient } from "../../hooks/useAppointments";
import type { NovoProntuarioInput } from "../../validate/novoProntuario.schema";
import { FormSection } from "../Form/FormSection";

interface Props {
  register: UseFormRegister<NovoProntuarioInput>;
  errors: FieldErrors<NovoProntuarioInput>;
  control: Control<NovoProntuarioInput>;
  medicoNome: string;
}

const TIPOS_CONSULTA = [
  { value: "primeira_consulta", label: "Primeira consulta" },
  { value: "retorno", label: "Retorno" },
  { value: "urgencia", label: "Urgência" },
  { value: "exame", label: "Exame / Resultado" },
  { value: "procedimento", label: "Procedimento" },
];

export function IdentificacaoSection({ register, errors, control, medicoNome }: Props) {
  const { data: patients } = usePatients();

  const pacienteId = useWatch({ control, name: "pacienteId" });
  const { data: appointments = [] } = useAppointmentsByPatient(pacienteId);

  const patientOptions = patients?.map((p) => ({ value: p.id, label: p.name })) ?? [];

  const appointmentOptions = appointments.map((a) => {
    const date = new Date(a.scheduledAt);
    const label = date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return { value: a.id, label };
  });

  return (
    <FormSection icon={ClipboardList} title="Identificação da Consulta">
      {/* Row 1: Paciente + Consulta */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SelectGroup
            label="Paciente"
            required
            error={errors.pacienteId?.message}
            selectProps={{
              placeholder: "Selecione o paciente",
              options: patientOptions,
              className: "bg-[#F8FAFC]",
              ...register("pacienteId"),
            }}
          />
        </div>
        <div className="flex-1">
          <SelectGroup
            label="Consulta vinculada"
            required
            error={errors.appointmentId?.message}
            selectProps={{
              placeholder: pacienteId ? "Selecione a consulta" : "Selecione o paciente primeiro",
              options: appointmentOptions,
              className: "bg-[#F8FAFC]",
              ...register("appointmentId"),
            }}
          />
        </div>
      </div>

      {/* Row 2: Data + Tipo */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-52">
          <Controller
            name="dataConsulta"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                label="Data da consulta"
                required
                error={errors.dataConsulta?.message}
                selected={field.value ? new Date(field.value + "T00:00:00") : null}
                onChange={(date) =>
                  field.onChange(date ? date.toISOString().split("T")[0] : "")
                }
              />
            )}
          />
        </div>
        <div className="flex-1">
          <SelectGroup
            label="Tipo de consulta"
            required
            error={errors.tipoConsulta?.message}
            selectProps={{
              placeholder: "Selecione o tipo",
              className: "bg-[#F8FAFC]",
              options: TIPOS_CONSULTA,
              ...register("tipoConsulta"),
            }}
          />
        </div>
        <div className="flex-1">
          <InputGroup
            label="Médico responsável"
            inputProps={{
              value: medicoNome,
              readOnly: true,
              className:
                "bg-[#F8FAFC] border-[#BBF7D0] text-[#166534] cursor-default focus:ring-0",
              ...register("medicoResponsavel"),
            }}
          />
        </div>
      </div>
    </FormSection>
  );
}
