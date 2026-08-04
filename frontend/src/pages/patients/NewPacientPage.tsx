import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { Save } from "lucide-react";
import { useZodForm } from "../../hooks/useZodForm";
import {
  newPacientSchema,
  type NewPacientInput,
} from "../../validate/newPacient";

import { Header } from "../../components/Dashboard/Header";
import DividerForm from "../../components/ui/DividerForms";

import { useCreatePatient } from "../../hooks/usePatients";

import { DadosPessoaisSection } from "../../components/NewPacient/DadosPessoaisSection";
import { ContatoSection } from "../../components/NewPacient/ContatoSection";
import { EnderecoSection } from "../../components/NewPacient/EnderecoSection";
import { InformacoesAdicionais } from "../../components/NewPacient/InformacoesAdicionais";
import { FormHeader } from "../../components/Form/FormHeader";
import { FormContent } from "../../components/Form/FormContent";
import { Button } from "../../components/ui/Button";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { ESTADOS } from "../../data/state";

function NovoPacienteContent() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { mutate: createPatient, isPending: saving } = useCreatePatient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useZodForm(newPacientSchema, {
    defaultValues: {
      name: "",
      dateOfBirth: new Date(),
      cpf: "",
      gender: "",
      phone: "",
      email: "",
      state: ESTADOS[1],
      streetNumber: "",
      city: "",
      street: "",
      zipCode: "",
      additionalInfo: "",
      agreement: "",
    },
  });

  function onSubmit(_data: NewPacientInput) {
    setGeneralError(null);
    setSaved(false);

    const prevData = {
      ..._data,
      email: _data.email || null,
      cpf: _data.cpf.replace(/\D/g, ""),
      phone: _data.phone.replace(/\D/g, ""),
      gender: _data.gender || "feminino",
      dateOfBirth: _data.dateOfBirth
        ? new Date(_data.dateOfBirth).toISOString()
        : null,
    };

    createPatient(prevData, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => navigate("/pacientes"), 1200);
      },
      onError: (error) => {
        setGeneralError(
          isAxiosError(error)
            ? (error.response?.data?.message ?? "Erro ao cadastrar paciente.")
            : "Erro ao conectar com o servidor.",
        );
      },
    });
  }

  function handleCancel() {
    navigate("/pacientes");
  }

  return (
    <FormContent>
      <form onSubmit={handleSubmit(onSubmit)} >
        <Header isSearchAvaliable={false} />
        {/* ── Header ── */}
        <FormHeader
          title="Pacientes"
          link="/paciente"
          subTitle="Novo Paciente"
          description="Preencha os dados do paciente abaixo"
        />

        <div className="mb-6"></div>

        {generalError && <ErrorAlert message={generalError} />}

        {/* ── Form card ── */}
        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-6 flex flex-col gap-6 transition-colors duration-200">
          {/* ── Dados Pessoais ── */}
          <DadosPessoaisSection
            register={register}
            errors={errors}
            control={control}
          />

          <DividerForm />

          {/* ── Contato ── */}
          <ContatoSection register={register} control={control} errors={errors} />

          <DividerForm />

          {/* ── Endereço ── */}
          <EnderecoSection register={register} setValue={setValue} errors={errors} />

          <DividerForm />

          {/* ── Informações Adicionais ── */}
          <InformacoesAdicionais register={register} errors={errors} watch={watch} setValue={setValue} />

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={saving || saved}
              className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
            >
              <Save size={16} />
              {saved ? "Salvo!" : saving ? "Salvando..." : "Salvar Paciente"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="h-11 px-6 rounded-lg text-sm font-medium border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 disabled:opacity-50 transition-all cursor-pointer"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </FormContent>
  );
}

export default function NovoPacientePage() {
  return <NovoPacienteContent />;
}
