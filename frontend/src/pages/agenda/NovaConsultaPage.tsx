import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Save, FileText, Settings2 } from "lucide-react";
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
import { usePatient } from "../../hooks/usePatients";
import { usePatientSearch } from "../../hooks/usePatientSearch";
import { useDoctors } from "../../hooks/useUsers";
import { useSpecialtiesByDoctor } from "../../hooks/useSpecialties";
import { FormContent } from "../../components/Form/FormContent";
import { FormHeader } from "../../components/Form/FormHeader";
import { FormCard } from "../../components/Form/FormCard";
import { FormSection } from "../../components/Form/FormSection";


// ── Page content ──────────────────────────────────────────────────────────────

const APPOINTMENT_TYPE_OPTIONS = [
  { value: "IN_PERSON", label: "Presencial" },
  { value: "ONLINE", label: "Online" },
  { value: "HOME_CARE", label: "Domiciliar" },
];

function NovaConsultaContent() {
  const navigate = useNavigate();

  const {
    control,
    watch,
    register,
    setValue,
    formState: { errors },
    onSubmit,
    isLoading,
    generalError,
  } = useNovaConsultaForm();

  const selectedDoctorId = watch("doctorId");
  const selectedType = watch("type");
  const selectedPacient = watch("patientId");

  const { options: patientOptions, setQuery: setPatientQuery } = usePatientSearch();
  const { data: patient } = usePatient(selectedPacient);
  const { data: users } = useDoctors();
  const { data: specialties } = useSpecialtiesByDoctor(selectedDoctorId);

  const doctorOptions =
    users?.map((u) => ({ value: u.id, label: u.username })) ?? [];

  const specialtyOptions =
    specialties?.map((s) => ({ value: s.id, label: s.name })) ?? [];

  // Preenche o endereço automaticamente quando o paciente é selecionado
  useEffect(() => {
    if (!patient) return;
    const parts = [
      [patient.street, patient.streetNumber].filter(Boolean).join(", "),
      [patient.city, patient.state].filter(Boolean).join(", "),
    ].filter(Boolean);
    const builtAddress = parts.join(" — ");
    if (builtAddress) setValue("address", builtAddress);
  }, [patient, setValue]);

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
                  onSearchChange={setPatientQuery}
                />
              )}
            />

            {/* Especialidade */}
            <Controller
              name="specialtyId"
              control={control}
              render={({ field }) => (
                <SearchableSelectGroup
                  label="Especialidade"
                  required
                  error={errors.specialtyId?.message}
                  placeholder={selectedDoctorId ? "Buscar especialidade..." : "Selecione um médico primeiro"}
                  options={specialtyOptions}
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

          {/* ── Tipo e Local ── */}
          <FormSection icon={Settings2} title="Tipo e Local da Consulta">
            {/* Tipo */}
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <SearchableSelectGroup
                  label="Tipo de Consulta"
                  required
                  error={errors.type?.message}
                  placeholder="Selecione o tipo..."
                  options={APPOINTMENT_TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Sala — IN_PERSON */}
            {selectedType === "IN_PERSON" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#2D3748] dark:text-[#F1F5F9]">
                  Sala / Consultório <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("roomId")}
                  placeholder="Ex: Consultório 01"
                  className="h-14 w-full rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 text-sm text-[#2D3748] dark:text-[#F1F5F9] placeholder:text-[#A0AEC0] dark:placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#38A169]"
                />
                {errors.roomId && (
                  <p className="text-xs text-red-500">{errors.roomId.message}</p>
                )}
              </div>
            )}

            {/* Link — ONLINE */}
            {selectedType === "ONLINE" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#2D3748] dark:text-[#F1F5F9]">
                  Link da Reunião <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("meetingLink")}
                  placeholder="Ex: https://meet.google.com/abc-def"
                  className="h-14 w-full rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 text-sm text-[#2D3748] dark:text-[#F1F5F9] placeholder:text-[#A0AEC0] dark:placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#38A169]"
                />
                {errors.meetingLink && (
                  <p className="text-xs text-red-500">{errors.meetingLink.message}</p>
                )}
              </div>
            )}

            {/* Endereço — HOME_CARE */}
            {selectedType === "HOME_CARE" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#2D3748] dark:text-[#F1F5F9]">
                  Endereço do Atendimento <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("address")}
                  placeholder="Ex: Rua das Flores, 123 — São Paulo, SP"
                  className="h-14 w-full rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 text-sm text-[#2D3748] dark:text-[#F1F5F9] placeholder:text-[#A0AEC0] dark:placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#38A169]"
                />
                {patient?.street && (
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Endereço preenchido automaticamente do cadastro do paciente. Você pode editar.
                  </p>
                )}
                {errors.address && (
                  <p className="text-xs text-red-500">{errors.address.message}</p>
                )}
              </div>
            )}
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
