import { useDeferredValue, useState, type ReactNode } from "react";
import { IMaskInput } from "react-imask";
import {
  CalendarClock,
  CheckCircle2,
  FilePlus2,
  Layers3,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { BoletoList } from "../../components/Filiacao/BoletoList";
import { BoletoLoadingOverlay } from "../../components/Filiacao/BoletoLoadingOverlay";
import { useBoletos, useCreateBoleto } from "../../hooks/useBoletos";
import { boletoErrorMessage } from "../../services/Boleto";
import type {
  BoletoKind,
  BoletoStatus,
  CreateBoletoRequest,
} from "../../types/boleto";
import {
  boletoFormSchema,
  type BoletoFormInput,
} from "../../validate/boleto.schema";
import { useZodForm } from "../../hooks/useZodForm";
import { formatCpfOrCpnj } from "../../utils/formatCpf";

const STATUS_OPTIONS: Array<{ value: BoletoStatus | ""; label: string }> = [
  { value: "", label: "Todos os status" },
  { value: "PENDING", label: "Pendente" },
  { value: "PROCESSING", label: "Processando" },
  { value: "REGISTERED", label: "Registrado" },
  { value: "PDF_GENERATED", label: "PDF disponível" },
  { value: "SENT", label: "Enviado" },
  { value: "PAID", label: "Pago" },
  { value: "EXPIRED", label: "Vencido" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "FAILED", label: "Falhou" },
];

const inputClass =
  "h-11 w-full rounded-lg border border-[#DDE3EA] bg-[#F8FAFC] px-3.5 text-sm text-[#1E293B] outline-none transition focus:border-[#38A169] focus:ring-2 focus:ring-[#38A169]/15 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]";

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">
      <span>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
      {error && <span className="text-[11px] font-medium text-red-500">{error}</span>}
    </label>
  );
}

function amountToCents(value: string) {
  return Math.round(Number(value.replace(/\./g, "").replace(",", ".")) * 100);
}

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  if (!digits) return "";
  return (Number(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function cleanOptional(value: string) {
  const cleaned = value.trim();
  return cleaned || undefined;
}

function localIsoDate() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function FiliacaoPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BoletoStatus | "">("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const [pendingOperation, setPendingOperation] = useState<{
    fingerprint: string;
    key: string;
  } | null>(null);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useZodForm(boletoFormSchema, {
    defaultValues: {
      kind: "SINGLE",
      payerName: "",
      payerDocument: "",
      payerEmail: "",
      payerPhone: "",
      amount: "",
      dueDate: "",
      description: "",
    },
  });

  const kind = watch("kind") as BoletoKind;
  const amount = watch("amount");
  const payerDocument = watch("payerDocument");
  const payerPhone = watch("payerPhone");
  const documentField = register("payerDocument");
  const phoneField = register("payerPhone");
  const amountField = register("amount");
  const amountCents = amount ? amountToCents(amount) : 0;
  const createBoleto = useCreateBoleto();
  const boletoQuery = useBoletos();

  const onSubmit = handleSubmit(async (form: BoletoFormInput) => {
    setCreateError(null);
    setSuccessMessage(null);

    const payer = {
      name: form.payerName.trim(),
      document: form.payerDocument.replace(/\D/g, ""),
      email: cleanOptional(form.payerEmail),
      phone: cleanOptional(form.payerPhone),
    };
    const common = {
      payer,
      amountCents: amountToCents(form.amount),
      description: cleanOptional(form.description),
    };
    const payload: CreateBoletoRequest =
      form.kind === "ANNUAL_CARNET"
        ? {
            ...common,
            kind: "ANNUAL_CARNET",
            firstDueDate: form.dueDate,
            installments: 12,
          }
        : { ...common, kind: "SINGLE", dueDate: form.dueDate };
    const fingerprint = JSON.stringify(payload);
    const operation =
      pendingOperation?.fingerprint === fingerprint
        ? pendingOperation
        : { fingerprint, key: crypto.randomUUID() };
    setPendingOperation(operation);

    try {
      await createBoleto.mutateAsync({
        payload,
        idempotencyKey: operation.key,
      });
      setPendingOperation(null);
      setSuccessMessage(
        form.kind === "ANNUAL_CARNET"
          ? "Carnê anual criado com 12 parcelas. Os PDFs já estão sendo atualizados na lista."
          : "Boleto individual criado. O PDF já está sendo atualizado na lista.",
      );
      reset({
        kind: form.kind,
        payerName: "",
        payerDocument: "",
        payerEmail: "",
        payerPhone: "",
        amount: "",
        dueDate: "",
        description: "",
      });
    } catch (error) {
      setCreateError(boletoErrorMessage(error));
    }
  });

  return (
    <main className="relative min-w-0 flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0F172A]">
      <div className="pointer-events-none absolute inset-0 bg-[url('/bg-fundo.jpeg')] bg-cover bg-center opacity-[0.06] dark:hidden" />
      {createBoleto.isPending && <BoletoLoadingOverlay kind={kind} />}

      <div className="relative flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <Header isSearchAvaliable={false} />

        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#1D4935] via-[#286B4A] to-[#38A169] p-5 text-white shadow-lg sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
                <ShieldCheck size={14} />
                Filiação ADQPAL
              </span>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Boletos e carnês de filiação</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/85">
                Emita uma cobrança individual ou gere as 12 mensalidades anuais em uma única operação segura com a Efí.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-100/70">Individual</p>
                <p className="mt-1 text-sm font-semibold">1 cobrança</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-100/70">Anual</p>
                <p className="mt-1 text-sm font-semibold">12 parcelas</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1E293B] sm:p-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F5ED] text-[#38A169] dark:bg-[#1A3A2A]">
                <FilePlus2 size={20} />
              </span>
              <div>
                <h2 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9]">Nova cobrança</h2>
                <p className="text-xs text-[#94A3B8]">Preencha os dados do filiado e escolha o formato.</p>
              </div>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setValue("kind", "SINGLE", { shouldValidate: true })}
                aria-pressed={kind === "SINGLE"}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                  kind === "SINGLE"
                    ? "border-[#38A169] bg-[#F0FFF4] shadow-sm dark:bg-[#1A3A2A]"
                    : "border-[#E2E8F0] hover:border-[#38A169]/40 dark:border-[#334155]"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#38A169] shadow-sm dark:bg-[#0F172A]">
                  <FilePlus2 size={18} />
                </span>
                <span>
                  <strong className="block text-sm text-[#1E293B] dark:text-[#F1F5F9]">Boleto individual</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#64748B] dark:text-[#94A3B8]">Uma cobrança com vencimento único.</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setValue("kind", "ANNUAL_CARNET", { shouldValidate: true })}
                aria-pressed={kind === "ANNUAL_CARNET"}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                  kind === "ANNUAL_CARNET"
                    ? "border-[#38A169] bg-[#F0FFF4] shadow-sm dark:bg-[#1A3A2A]"
                    : "border-[#E2E8F0] hover:border-[#38A169]/40 dark:border-[#334155]"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#38A169] shadow-sm dark:bg-[#0F172A]">
                  <Layers3 size={18} />
                </span>
                <span>
                  <strong className="block text-sm text-[#1E293B] dark:text-[#F1F5F9]">Carnê anual</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#64748B] dark:text-[#94A3B8]">12 parcelas mensais geradas juntas.</span>
                </span>
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 border-b border-[#E2E8F0] pb-3 dark:border-[#334155]">
              <UserRound size={16} className="text-[#38A169]" />
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#475569] dark:text-[#CBD5E1]">Dados do filiado</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Nome completo" required error={errors.payerName?.message}>
                  <input className={inputClass} maxLength={100} placeholder="Nome completo do filiado" aria-invalid={Boolean(errors.payerName)} {...register("payerName")} />
                </Field>
              </div>
              <Field label="CPF ou CNPJ" required error={errors.payerDocument?.message}>
                <input
                  {...documentField}
                  value={payerDocument}
                  onChange={(event) => setValue("payerDocument", formatCpfOrCpnj(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: Boolean(errors.payerDocument),
                  })}
                  className={inputClass}
                  inputMode="numeric"
                  maxLength={18}
                  placeholder="000.000.000-00"
                  aria-invalid={Boolean(errors.payerDocument)}
                />
              </Field>
              <Field label="E-mail" required error={errors.payerEmail?.message}>
                <input className={inputClass} type="email" placeholder="filiado@email.com" aria-invalid={Boolean(errors.payerEmail)} {...register("payerEmail")} />
              </Field>
              <Field label="Telefone" required error={errors.payerPhone?.message}>
                <IMaskInput
                  mask="+{55} (00) 00000-0000"
                  value={payerPhone}
                  onAccept={(value: string) => setValue("payerPhone", value, {
                    shouldDirty: true,
                    shouldValidate: Boolean(errors.payerPhone),
                  })}
                  onBlur={phoneField.onBlur}
                  inputRef={phoneField.ref}
                  name={phoneField.name}
                  className={inputClass}
                  inputMode="tel"
                  placeholder="+55 (82) 99999-9999"
                  aria-invalid={Boolean(errors.payerPhone)}
                />
              </Field>
            </div>

            <div className="mb-4 mt-6 flex items-center gap-2 border-b border-[#E2E8F0] pb-3 dark:border-[#334155]">
              <CalendarClock size={16} className="text-[#38A169]" />
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#475569] dark:text-[#CBD5E1]">Dados da cobrança</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={kind === "ANNUAL_CARNET" ? "Valor de cada parcela" : "Valor do boleto"} required error={errors.amount?.message}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B]">R$</span>
                  <input
                    {...amountField}
                    value={amount}
                    onChange={(event) => setValue("amount", formatCurrencyInput(event.target.value), {
                      shouldDirty: true,
                      shouldValidate: Boolean(errors.amount),
                    })}
                    className={`${inputClass} pl-10 text-right font-semibold tabular-nums`}
                    inputMode="numeric"
                    placeholder="0,00"
                    aria-invalid={Boolean(errors.amount)}
                  />
                </div>
              </Field>
              <Field label={kind === "ANNUAL_CARNET" ? "Primeiro vencimento" : "Vencimento"} required error={errors.dueDate?.message}>
                <input className={inputClass} type="date" min={localIsoDate()} aria-invalid={Boolean(errors.dueDate)} {...register("dueDate")} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Descrição" required error={errors.description?.message}>
                  <input className={inputClass} maxLength={200} placeholder="Ex: Mensalidade de filiação 2026" aria-invalid={Boolean(errors.description)} {...register("description")} />
                </Field>
              </div>
            </div>

            {createError && (
              <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {createError}
              </div>
            )}
            {successMessage && (
              <div role="status" className="mt-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={createBoleto.isPending}
              className="mt-6 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#38A169] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#2F855A] disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto sm:w-auto"
            >
              {kind === "ANNUAL_CARNET" ? <Layers3 size={17} /> : <FilePlus2 size={17} />}
              {kind === "ANNUAL_CARNET" ? "Gerar carnê com 12 parcelas" : "Gerar boleto individual"}
            </button>
          </form>

          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[#D8E9DF] bg-[#F0FFF4] p-5 dark:border-[#28543D] dark:bg-[#152D23]">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#2F855A] dark:text-[#68D391]">Resumo da emissão</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Formato</span>
                  <strong className="text-[#1E293B] dark:text-[#F1F5F9]">{kind === "ANNUAL_CARNET" ? "Carnê anual" : "Individual"}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Parcelas</span>
                  <strong className="text-[#1E293B] dark:text-[#F1F5F9]">{kind === "ANNUAL_CARNET" ? "12" : "1"}</strong>
                </div>
                <div className="h-px bg-[#CDE8D8] dark:bg-[#28543D]" />
                <div>
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Valor total previsto</span>
                  <p className="mt-1 text-2xl font-bold text-[#276749] dark:text-[#68D391]">
                    {(amountCents * (kind === "ANNUAL_CARNET" ? 12 : 1) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                  {kind === "ANNUAL_CARNET" && amountCents > 0 && (
                    <p className="mt-1 text-xs text-[#4A7C61] dark:text-[#94A3B8]">12x de {(amountCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 dark:border-[#334155] dark:bg-[#1E293B]">
              <ShieldCheck size={20} className="text-[#38A169]" />
              <h3 className="mt-3 text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9]">Emissão segura</h3>
              <p className="mt-1 text-xs leading-5 text-[#64748B] dark:text-[#94A3B8]">
                Cada operação possui uma chave única. Mesmo em caso de demora, a cobrança não será duplicada.
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-2">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">Cobranças emitidas</h2>
                {boletoQuery.isFetching && !boletoQuery.isLoading && <RefreshCw size={14} className="animate-spin text-[#38A169]" />}
              </div>
              <p className="mt-1 text-xs text-[#94A3B8]">Boletos individuais e carnês organizados por filiado.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                  aria-label="Buscar cobranças"
                  placeholder="Buscar nome, descrição ou ID..."
                  className={`${inputClass} pl-9`}
                />
              </div>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as BoletoStatus | "");
                }}
                aria-label="Filtrar cobranças por status"
                className={`${inputClass} sm:w-48`}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <BoletoList
            items={boletoQuery.data?.items ?? []}
            search={deferredSearch}
            status={status}
            isLoading={boletoQuery.isLoading}
            isError={boletoQuery.isError}
            onRetry={() => boletoQuery.refetch()}
          />

        </section>
      </div>
    </main>
  );
}
