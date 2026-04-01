import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Save, FileText } from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { SearchableSelectGroup } from "../../components/ui/SearchableSelect";
import { VoiceTextarea } from "../../components/ui/VoiceTextarea";
import {
  DatePickerInput,
  InputPickerTime,
} from "../../components/ui/DatePickerInput";
import DividerForm from "../../components/ui/DividerForms";
import { useNovaConsultaForm } from "../../hooks/useNovaConsultaForm";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useUsers";
import { FormContent } from "../../components/Form/FormContent";
import { FormHeader } from "../../components/Form/FormHeader";
import { FormCard } from "../../components/Form/FormCard";
import { FormSection } from "../../components/Form/FormSection";
import { useEffect } from "react";

// ── Page content ──────────────────────────────────────────────────────────────

function NovaConsultaContent() {
  const navigate = useNavigate();

  const {
    control,
    formState: { errors },
    onSubmit,
    isLoading,
    generalError,
  } = useNovaConsultaForm();

  const { data: patients } = usePatients();
  const { data: users } = useDoctors();

  const patientOptions =
    patients?.map((p) => ({ value: p.id, label: p.name })) ?? [];

  const doctorOptions =
    users?.map((u) => ({ value: u.id, label: u.username })) ?? [];


    useEffect(() => {
      console.log(errors)
    },[errors])
  return (
    <FormContent>
      <Header isSearchAvaliable={false} />

      {/* Breadcrumb */}
      <FormHeader
        title="Agenda"
        link="/agenda"
        subTitle="Nova Consulta"
        description="Agende uma nova consulta para o paciente"
      />

      {/* Form card */}
      <FormCard>
        {generalError && (
          <div className="mb-5">
            <ErrorAlert message={generalError} />
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          {/* ── Identificação ── */}

          <FormSection icon={CalendarPlus} title="Identificação da Consulta">
            {/* Médico */}
            <Controller
              name="doctorId"
              control={control}
              render={({ field }) => (
                <SearchableSelectGroup
                  label="Médico"
                  required
                  error={errors.doctorId?.message}
                  placeholder="Buscar médico pelo nome..."
                  options={doctorOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Paciente */}
            <Controller
              name="patientId"
              control={control}
              render={({ field }) => (
                <SearchableSelectGroup
                  label="Paciente"
                  required
                  error={errors.patientId?.message}
                  placeholder="Buscar paciente pelo nome..."
                  options={patientOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Data + Hora */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Controller
                  name="data"
                  control={control}
                  render={({ field }) => (
                    <DatePickerInput
                      label="Data da consulta"
                      required
                      error={errors.data?.message}
                      selected={field.value ?? null}
                      onChange={(date) => field.onChange(date ?? new Date())}
                      minDate={new Date()}
                    />
                  )}
                />
              </div>

              <div className="w-full sm:w-44">
                <Controller
                  name="hora"
                  control={control}
                  render={({ field }) => (
                    <InputPickerTime
                      label="Horário"
                      required
                      error={errors.hora?.message}
                      selected={field.value ?? null} // garante null se não houver valor
                      onChange={(date) => field.onChange(date ?? null)} // mantém null se limpar
                      timeIntervals={15} // intervalo de minutos
                      timeCaption="Horário" // legenda do seletor
                      showTimeSelectOnly // mostra só horas e minutos
                    />
                  )}
                />
              </div>
            </div>
          </FormSection>

          <DividerForm />

          {/* ── Observações ── */}
          <FormSection icon={FileText} title="Observações">
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <VoiceTextarea
                  label="Anotações / Motivo da consulta"
                  required={false}
                  error={errors.notes?.message}
                  placeholder="Motivo da consulta, histórico relevante, orientações..."
                  currentValue={field.value ?? ""}
                  onTranscriptAppend={(text) => field.onChange(text)}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
          </FormSection>

          {/* ── Ações ── */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
            >
              <Save size={16} />
              {isLoading ? "Agendando..." : "Agendar Consulta"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 px-6 rounded-lg text-sm font-medium border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 disabled:opacity-50 transition-all cursor-pointer"
              onClick={() => navigate("/agenda")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </FormCard>
    </FormContent>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NovaConsultaPage() {
  return <NovaConsultaContent />;
}
