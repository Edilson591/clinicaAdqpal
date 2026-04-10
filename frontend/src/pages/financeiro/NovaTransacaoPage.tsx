import { useState } from "react";
import { Save, ArrowLeft, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import { InputGroup } from "../../components/ui/Input";
import { VoiceTextarea } from "../../components/ui/VoiceTextarea";
import { SelectGroup } from "../../components/ui/Select";
import ErrorAlert from "../../components/ui/ErrorAlert";
import DividerForm from "../../components/ui/DividerForms";
import { FormHeader } from "../../components/Form/FormHeader";
import { FormContent } from "../../components/Form/FormContent";
import { FormCard } from "../../components/Form/FormCard";
import { FormSection } from "../../components/Form/FormSection";
import { DatePickerInput } from "../../components/ui/DatePickerInput";
import { useZodForm } from "../../hooks/useZodForm";
import { novaTransacaoSchema, type NovaTransacaoInput } from "../../validate/novaTransacao.schema";
import {
  useFinancialAccounts,
  useFinancialCategories,
  useCreateTransaction,
} from "../../hooks/useFinancial";

const PAYMENT_OPTIONS = [
  { value: "PIX", label: "PIX" },
  { value: "CASH", label: "Dinheiro" },
  { value: "CREDIT_CARD", label: "Cartão de Crédito" },
  { value: "DEBIT_CARD", label: "Cartão de Débito" },
  { value: "BANK_TRANSFER", label: "Transferência Bancária" },
  { value: "INSURANCE", label: "Convênio" },
  { value: "OTHER", label: "Outro" },
];

const STATUS_OPTIONS = [
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "PENDING", label: "Pendente" },
  { value: "CANCELLED", label: "Cancelado" },
];

function NovaTransacaoContent() {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { data: accounts = [] } = useFinancialAccounts(true);
  const createTransaction = useCreateTransaction();

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useZodForm(novaTransacaoSchema, {
    defaultValues: {
      type: "INCOME",
      accountId: "",
      categoryId: "",
      description: "",
      amount: "",
      status: "CONFIRMED",
      paymentMethod: "PIX",
      dueDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const type = watch("type");
  const { data: categories = [] } = useFinancialCategories(undefined, true);

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: a.bank ? `${a.name} — ${a.bank}` : a.name,
  }));

  const categoryOptions = categories
    .filter((c) => {
      if (type === "INCOME") return c.type === "INCOME" || c.type === "BOTH";
      if (type === "EXPENSE") return c.type === "EXPENSE" || c.type === "BOTH";
      return true;
    })
    .map((c) => ({ value: c.id, label: c.name }));

  const onSubmit = handleSubmit(async (data: NovaTransacaoInput) => {
    try {
      setGeneralError(null);
      await createTransaction.mutateAsync({
        type: data.type,
        accountId: data.accountId,
        categoryId: data.categoryId,
        description: data.description,
        amount: parseFloat(data.amount.replace(",", ".")),
        status: data.status,
        paymentMethod: data.paymentMethod,
        dueDate: new Date(data.dueDate + "T00:00:00").toISOString(),
        ...(data.notes ? { reference: data.notes } : {}),
      });
      navigate("/financeiro");
    } catch {
      setGeneralError("Erro ao salvar a transação. Verifique os dados e tente novamente.");
    }
  });

  return (
    <FormContent>
      <Header isSearchAvaliable={false} />

      <FormHeader
        title="Financeiro"
        link="/financeiro"
        subTitle="Nova Transação"
        description="Registre uma nova entrada, saída ou transferência financeira"
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
                onClick={() => { setValue("type", "INCOME"); setValue("categoryId", ""); }}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                  type === "INCOME"
                    ? "border-[#38A169] bg-[#DCFCE7] text-[#166534]"
                    : "border-[#E2E8F0] text-[#64748B] hover:border-[#38A169]/40"
                }`}
              >
                <ArrowDownLeft size={17} />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => { setValue("type", "EXPENSE"); setValue("categoryId", ""); }}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                  type === "EXPENSE"
                    ? "border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]"
                    : "border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444]/40"
                }`}
              >
                <ArrowUpRight size={17} />
                Saída
              </button>
              <button
                type="button"
                onClick={() => { setValue("type", "TRANSFER"); setValue("categoryId", ""); }}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                  type === "TRANSFER"
                    ? "border-[#3B82F6] bg-[#DBEAFE] text-[#1E40AF]"
                    : "border-[#E2E8F0] text-[#64748B] hover:border-[#3B82F6]/40"
                }`}
              >
                <ArrowLeftRight size={17} />
                Transferência
              </button>
            </div>
          </FormSection>

          <DividerForm />

          {/* Dados da transação */}
          <FormSection icon={Save} title="Dados da Transação">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <InputGroup
                  label="Descrição"
                  required
                  error={errors.description?.message}
                  inputProps={{
                    placeholder: "Ex: Consulta Dr. João, Aluguel consultório...",
                    ...register("description"),
                  }}
                />
              </div>
              <div className="w-full sm:w-44">
                <InputGroup
                  label="Valor (R$)"
                  required
                  error={errors.amount?.message}
                  inputProps={{
                    placeholder: "0,00",
                    inputMode: "decimal",
                    ...register("amount"),
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SelectGroup
                  label="Conta"
                  required
                  error={errors.accountId?.message}
                  selectProps={{
                    placeholder: "Selecione a conta",
                    options: accountOptions,
                    ...register("accountId"),
                  }}
                />
              </div>
              <div className="flex-1">
                <SelectGroup
                  label="Categoria"
                  required
                  error={errors.categoryId?.message}
                  selectProps={{
                    placeholder: "Selecione a categoria",
                    options: categoryOptions,
                    ...register("categoryId"),
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48">
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <DatePickerInput
                      label="Data"
                      required
                      error={errors.dueDate?.message}
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
                  label="Forma de Pagamento"
                  required
                  error={errors.paymentMethod?.message}
                  selectProps={{
                    placeholder: "Selecione",
                    options: PAYMENT_OPTIONS,
                    ...register("paymentMethod"),
                  }}
                />
              </div>
              <div className="w-full sm:w-44">
                <SelectGroup
                  label="Status"
                  required
                  error={errors.status?.message}
                  selectProps={{
                    placeholder: "Status",
                    options: STATUS_OPTIONS,
                    ...register("status"),
                  }}
                />
              </div>
            </div>

            <VoiceTextarea
              label="Observações"
              placeholder="Informações adicionais sobre a transação..."
              className="min-h-[80px]"
              currentValue={watch("notes") ?? ""}
              onTranscriptAppend={(val) => setValue("notes", val)}
              {...register("notes")}
            />
          </FormSection>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || createTransaction.isPending}
              className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
            >
              <Save size={16} />
              {isSubmitting || createTransaction.isPending ? "Salvando..." : "Salvar Transação"}
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
