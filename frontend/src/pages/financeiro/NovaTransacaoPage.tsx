import { useState } from "react";
import { Save, ArrowLeft, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import { InputGroup } from "../../components/ui/Input";
import { SelectGroup } from "../../components/ui/Select";
import ErrorAlert from "../../components/ui/ErrorAlert";
import DividerForm from "../../components/ui/DividerForms";
import { FormHeader } from "../../components/Form/FormHeader";
import { FormContent } from "../../components/Form/FormContent";
import { FormCard } from "../../components/Form/FormCard";
import { FormSection } from "../../components/Form/FormSection";
import { useZodForm } from "../../hooks/useZodForm";
import { novaTransacaoSchema, type NovaTransacaoInput } from "../../validate/novaTransacao.schema";
import { Controller } from "react-hook-form";
import { DatePickerInput } from "../../components/ui/DatePickerInput";

const CATEGORIAS_ENTRADA = [
  { value: "consulta", label: "Consulta" },
  { value: "exame", label: "Exame / Procedimento" },
  { value: "convenio", label: "Convênio" },
  { value: "outro_entrada", label: "Outro" },
];

const CATEGORIAS_SAIDA = [
  { value: "aluguel", label: "Aluguel / Infraestrutura" },
  { value: "material", label: "Material Clínico" },
  { value: "salario", label: "Salário / RH" },
  { value: "equipamento", label: "Equipamento" },
  { value: "marketing", label: "Marketing" },
  { value: "outro_saida", label: "Outro" },
];

function NovaTransacaoContent() {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useZodForm(novaTransacaoSchema, {
    defaultValues: {
      tipo: "entrada",
      descricao: "",
      valor: "",
      data: new Date().toISOString().split("T")[0],
      categoria: "",
      observacoes: "",
    },
  });

  const tipo = watch("tipo");
  const categorias = tipo === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA;

  const onSubmit = handleSubmit((_data: NovaTransacaoInput) => {
    try {
      setGeneralError(null);
      // TODO: conectar ao backend quando a API de transações for criada
      // await transacaoService.create({ ...data, valor: parseFloat(data.valor.replace(",", ".")) });
      navigate("/financeiro");
    } catch {
      setGeneralError("Erro ao salvar a transação.");
    }
  });

  return (
    <FormContent>
      <Header isSearchAvaliable={false} />

      <FormHeader
        title="Financeiro"
        link="/financeiro"
        subTitle="Nova Transação"
        description="Registre uma nova entrada ou saída financeira"
      />

      <FormCard>
        {generalError && (
          <div className="mb-4">
            <ErrorAlert message={generalError} />
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          {/* Tipo de transação */}
          <FormSection icon={ArrowDownLeft} title="Tipo de Transação">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setValue("tipo", "entrada"); setValue("categoria", ""); }}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                  tipo === "entrada"
                    ? "border-[#38A169] bg-[#DCFCE7] text-[#166534]"
                    : "border-[#E2E8F0] text-[#64748B] hover:border-[#38A169]/40"
                }`}
              >
                <ArrowDownLeft size={17} />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => { setValue("tipo", "saida"); setValue("categoria", ""); }}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                  tipo === "saida"
                    ? "border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]"
                    : "border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444]/40"
                }`}
              >
                <ArrowUpRight size={17} />
                Saída
              </button>
            </div>
          </FormSection>

          <DividerForm />

          {/* Dados principais */}
          <FormSection icon={Save} title="Dados da Transação">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <InputGroup
                  label="Descrição"
                  required
                  error={errors.descricao?.message}
                  inputProps={{
                    placeholder: "Ex: Consulta Dr. João, Aluguel consultório...",
                    ...register("descricao"),
                  }}
                />
              </div>
              <div className="w-full sm:w-48">
                <InputGroup
                  label="Valor (R$)"
                  required
                  error={errors.valor?.message}
                  inputProps={{
                    placeholder: "0,00",
                    inputMode: "decimal",
                    ...register("valor"),
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-52">
                <Controller
                  name="data"
                  control={control}
                  render={({ field }) => (
                    <DatePickerInput
                      label="Data"
                      required
                      error={errors.data?.message}
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
                  label="Categoria"
                  required
                  error={errors.categoria?.message}
                  selectProps={{
                    placeholder: "Selecione a categoria",
                    options: categorias,
                    ...register("categoria"),
                  }}
                />
              </div>
            </div>

            <InputGroup
              label="Observações"
              textarea
              textareaProps={{
                placeholder: "Informações adicionais sobre a transação...",
                className: "min-h-[80px]",
                ...register("observacoes"),
              }}
            />
          </FormSection>

          {/* Ações */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
            >
              <Save size={16} />
              {isSubmitting ? "Salvando..." : "Salvar Transação"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 px-6 rounded-lg text-sm font-medium border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 transition-all cursor-pointer"
              onClick={() => navigate("/financeiro")}
            >
              <ArrowLeft size={15} />
              Cancelar
            </Button>
          </div>
        </form>
      </FormCard>
    </FormContent>
  );
}

export default function NovaTransacaoPage() {
  return <NovaTransacaoContent />;
}
