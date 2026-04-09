import { useParams, useNavigate } from "react-router-dom";
import { Save, ClipboardList } from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import ErrorAlert from "../../components/ui/ErrorAlert";
import DividerForm from "../../components/ui/DividerForms";
import { FieldSkeleton } from "../../components/ui/FieldSkeleton";
import { useEditPacienteForm } from "../../hooks/useEditPacienteForm";
import { FormHeader } from "../../components/Form/FormHeader";
import { FormContent } from "../../components/Form/FormContent";
import { DadosPessoaisSection } from "../../components/NewPacient/DadosPessoaisSection";
import { ContatoSection } from "../../components/NewPacient/ContatoSection";
import { EnderecoSection } from "../../components/NewPacient/EnderecoSection";
import { InformacoesAdicionais } from "../../components/NewPacient/InformacoesAdicionais";
import { FormCard } from "../../components/Form/FormCard";

function EditPacienteContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    onSubmit,
    getValues,
    isLoadingPatient,
    isSaving,
    generalError,
  } = useEditPacienteForm(id ?? "");


  console.log(getValues())

  return (
    <FormContent>
      <Header isSearchAvaliable={false} />

      <FormHeader
        title="Pacientes"
        link="/pacientes"
        subTitle="Editar Paciente"
        description="Preencha os dados do paciente abaixo"
      />

      <FormCard>
        {generalError && (
          <div className="mb-5">
            <ErrorAlert message={generalError} />
          </div>
        )}

        {isLoadingPatient ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
            <DividerForm />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
            <DadosPessoaisSection
              register={register}
              errors={errors}
              control={control}
            />

            <DividerForm />

            <ContatoSection register={register} control={control} errors={errors} />

            <DividerForm />

            <EnderecoSection register={register} errors={errors} />

            <DividerForm />

            <InformacoesAdicionais register={register} errors={errors} watch={watch} setValue={setValue} />

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
                className="h-11 px-5 rounded-lg text-sm font-medium border border-[#38A169] bg-white text-[#38A169] hover:bg-[#F0FDF4] transition-all cursor-pointer flex items-center gap-2"
                onClick={() => navigate(`/pacientes/${id}/historico`)}
              >
                <ClipboardList size={16} />
                Ver Histórico
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 rounded-lg text-sm font-medium border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 disabled:opacity-50 transition-all cursor-pointer"
                onClick={() => navigate("/pacientes")}
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

export default function EditPacientePage() {
  return <EditPacienteContent />;
}
