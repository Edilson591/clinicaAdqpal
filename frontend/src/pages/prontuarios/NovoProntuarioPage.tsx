import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { useNovoProntuarioForm } from "../../hooks/useNovoProntuarioForm";
import { IdentificacaoSection } from "../../components/NovoProntuario/IdentificacaoSection";
import { AnamneseSection } from "../../components/NovoProntuario/AnamneseSection";
import { ExameFisicoSection } from "../../components/NovoProntuario/ExameFisicoSection";
import { DiagnosticoSection } from "../../components/NovoProntuario/DiagnosticoSection";
import DividerForm from "../../components/ui/DividerForms";
import { FormHeader } from "../../components/Form/FormHeader";
import { FormContent } from "../../components/Form/FormContent";
import { FormCard } from "../../components/Form/FormCard";

function NovoProntuarioContent() {
  const navigate = useNavigate();
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    onSubmit,
    isLoading,
    generalError,
    medicoNome,
  } = useNovoProntuarioForm();

  return (
    <FormContent>
      <Header isSearchAvaliable={false} />

      {/* Header — pen: K8hmy */}
      <FormHeader
        title="Prontuários"
        link="/protuario"
        subTitle="Novo Prontuário"
        description="Preencha os dados do prontuário abaixo"
      />
      {/* <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/prontuarios"
              className="flex items-center gap-1 px-1.5 py-1 rounded text-[#64748B] text-sm hover:bg-[#F1F5F9] transition-colors"
            >
              <ArrowLeft size={15} />
              Prontuários
            </Link>
            <span className="text-[#CBD5E1] text-sm">/</span>
            <FilePlus size={20} className="text-[#38A169]" />
            <h1 className="text-[22px] font-semibold text-[#1E293B]">
              Novo Prontuário
            </h1>
          </div>
          <p className="text-[13px] text-[#94A3B8]">
            Registre as informações clínicas da consulta
          </p>
        </div> */}

      {/* Form card — pen: R139Z · bg white · border #E2E8F0 · cornerRadius 12 · padding 24 */}
      <FormCard>
        {generalError && (
          <div className="mb-4">
            <ErrorAlert message={generalError} />
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <IdentificacaoSection
            register={register}
            control={control}
            errors={errors}
            medicoNome={medicoNome}
          />

          <DividerForm />

          <AnamneseSection register={register} errors={errors} watch={watch} setValue={setValue} />

          <DividerForm />

          <ExameFisicoSection register={register} errors={errors} watch={watch} setValue={setValue} />

          <DividerForm />

          <DiagnosticoSection register={register} errors={errors} watch={watch} setValue={setValue} />

          {/* Actions — pen: DcwgB */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
            >
              <Save size={16} />
              {isLoading ? "Salvando..." : "Salvar Prontuário"}
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
      </FormCard>
    </FormContent>
  );
}

export default function NovoProntuarioPage() {
  return <NovoProntuarioContent />;
}
