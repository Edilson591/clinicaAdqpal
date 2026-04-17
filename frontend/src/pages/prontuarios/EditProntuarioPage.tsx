import { useParams, useNavigate } from "react-router-dom";
import { FilePen, Save, User, Calendar, Hash } from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { VoiceTextarea } from "../../components/ui/VoiceTextarea";
import DividerForm from "../../components/ui/DividerForms";
import { FieldSkeleton } from "../../components/ui/FieldSkeleton";
import { useEditProntuarioForm } from "../../hooks/useEditProntuarioForm";
import { usePatient } from "../../hooks/usePatients";
import { FormHeader } from "../../components/Form/FormHeader";
import { FormContent } from "../../components/Form/FormContent";
import { FormCard } from "../../components/Form/FormCard";

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-[#38A169]" />
      <h3 className="text-sm font-semibold text-[#1E293B]">{title}</h3>
    </div>
  );
}

// ── Page content ──────────────────────────────────────────────────────────────

function EditProntuarioContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    onSubmit,
    isLoadingRecord,
    isSaving,
    generalError,
    record,
  } = useEditProntuarioForm(id ?? "");

  const { data: patient } = usePatient(record?.patientId ?? "");

  const createdAt = record?.createdAt
    ? new Date(record.createdAt).toLocaleDateString("pt-BR")
    : "—";

  return (
    <FormContent>
      <Header isSearchAvaliable={false} />

      {/* Breadcrumb */}
      <FormHeader
        title="Prontuários"
        link="/prontuarios"
        subTitle="Editar Prontuário"
        pacientName={patient}
      />

      {/* Form card */}
      <FormCard>
        {generalError && (
          <div className="mb-5">
            <ErrorAlert message={generalError} />
          </div>
        )}

        {isLoadingRecord ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
            <DividerForm />
            <FieldSkeleton tall />
            <FieldSkeleton tall />
            <DividerForm />
            <FieldSkeleton tall />
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
            {/* ── Informações do registro (read-only) ── */}
            <section className="flex flex-col gap-4">
              <SectionHeader icon={Hash} title="Informações do Registro" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Paciente */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1.5">
                    <User size={12} />
                    Paciente
                  </span>
                  <div className="h-14 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground px-4 flex items-center text-sm text-[#475569]">
                    {patient?.name ?? "—"}
                  </div>
                </div>

                {/* Data */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1.5">
                    <Calendar size={12} />
                    Data de criação
                  </span>
                  <div className="h-14 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground px-4 flex items-center text-sm text-[#475569]">
                    {createdAt}
                  </div>
                </div>

                {/* ID */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1.5">
                    <Hash size={12} />
                    ID do prontuário
                  </span>
                  <div className="h-14 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground px-4 flex items-center text-sm text-[#94A3B8] font-mono truncate">
                    {id}
                  </div>
                </div>
              </div>
            </section>

            <DividerForm />

            {/* ── Diagnóstico e Conduta ── */}
            <section className="flex flex-col gap-4">
              <SectionHeader icon={FilePen} title="Diagnóstico e Conduta" />

              <VoiceTextarea
                label="Diagnóstico"
                error={errors.diagnosis?.message}
                placeholder="Hipótese diagnóstica, CID-10..."
                className="min-h-[96px]"
                currentValue={watch("diagnosis") ?? ""}
                onTranscriptAppend={(val) => setValue("diagnosis", val)}
                {...register("diagnosis")}
              />

              <VoiceTextarea
                label="Conduta / Prescrição"
                error={errors.prescription?.message}
                placeholder="Medicamentos prescritos, dosagem, orientações ao paciente..."
                className="min-h-[96px]"
                currentValue={watch("prescription") ?? ""}
                onTranscriptAppend={(val) => setValue("prescription", val)}
                {...register("prescription")}
              />
            </section>

            <DividerForm />

            {/* ── Anotações ── */}
            <section className="flex flex-col gap-4">
              <SectionHeader icon={FilePen} title="Anotações Clínicas" />

              <VoiceTextarea
                label="Anotações"
                error={errors.notes?.message}
                placeholder="Anamnese, observações adicionais, evolução..."
                className="min-h-[112px]"
                currentValue={watch("notes") ?? ""}
                onTranscriptAppend={(val) => setValue("notes", val)}
                {...register("notes")}
              />
            </section>

            {/* ── Ações ── */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
              >
                <Save size={16} />
                {isSaving ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 rounded-lg text-sm font-medium border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 disabled:opacity-50 transition-all cursor-pointer"
                onClick={() => navigate("/prontuarios")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </FormCard>
    </FormContent>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditProntuarioPage() {
  return <EditProntuarioContent />;
}
