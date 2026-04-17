import { X } from "lucide-react";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useZodForm } from "../../hooks/useZodForm";
import { notaFiscalSchema, type NotaFiscalInput } from "../../validate/notaFiscal.schema";
import { useCreateNotaFiscal } from "../../hooks/useNotasFiscais";
import { usePatients } from "../../hooks/usePatients";
import { SearchableSelectGroup } from "../../components/ui/SearchableSelect";
import { Button } from "../../components/ui/Button";

interface NovaNotaFiscalModalProps {
  open: boolean;
  onClose: () => void;
}

export function NovaNotaFiscalModal({ open, onClose }: NovaNotaFiscalModalProps) {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { data: patients = [] } = usePatients();
  const createNF = useCreateNotaFiscal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useZodForm(notaFiscalSchema, {
    defaultValues: { patientId: "", servico: "", valor: "", observacoes: "" },
  });

  const patientId = watch("patientId");

  const patientOptions = patients.map((p) => ({ value: p.id, label: p.name }));

  const onSubmit = handleSubmit((data: NotaFiscalInput) => {
    setGeneralError(null);
    createNF.mutate(
      {
        patientId: data.patientId,
        servico: data.servico,
        valor: Number(data.valor.replace(",", ".")),
        observacoes: data.observacoes || null,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (err) => {
          setGeneralError(
            isAxiosError(err)
              ? (err.response?.data?.message ?? "Erro ao criar nota fiscal.")
              : "Erro ao conectar com o servidor.",
          );
        },
      },
    );
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => { reset(); onClose(); }}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#1E293B] rounded-xl shadow-xl w-full max-w-lg border border-[#E2E8F0] dark:border-[#334155]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#334155]">
          <h2 className="text-base font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
            Emitir Nota Fiscal
          </h2>
          <button
            onClick={() => { reset(); onClose(); }}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] dark:hover:bg-[#263548] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} noValidate className="p-6 flex flex-col gap-5">
          {/* Paciente */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#2D3748] dark:text-[#CBD5E1]">
              Paciente <span className="text-red-500">*</span>
            </label>
            <SearchableSelectGroup
              placeholder="Selecione o paciente"
              options={patientOptions}
              value={patientId}
              onChange={(v) => setValue("patientId", v, { shouldValidate: true })}
              classNameChildren="h-11 bg-white dark:bg-[#1E293B]"
            />
            {errors.patientId && (
              <p className="text-xs text-red-500">{errors.patientId.message}</p>
            )}
          </div>

          {/* Serviço */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#2D3748] dark:text-[#CBD5E1]">
              Serviço <span className="text-red-500">*</span>
            </label>
            <input
              {...register("servico")}
              placeholder="Ex: Consulta Psicológica"
              className="h-11 px-3 text-sm rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#263548] text-[#1E293B] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38A169]/40"
            />
            {errors.servico && (
              <p className="text-xs text-red-500">{errors.servico.message}</p>
            )}
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#2D3748] dark:text-[#CBD5E1]">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              {...register("valor")}
              placeholder="0,00"
              inputMode="decimal"
              className="h-11 px-3 text-sm rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#263548] text-[#1E293B] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38A169]/40"
            />
            {errors.valor && (
              <p className="text-xs text-red-500">{errors.valor.message}</p>
            )}
          </div>

          {/* Observações */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#2D3748] dark:text-[#CBD5E1]">
              Observações
            </label>
            <textarea
              {...register("observacoes")}
              placeholder="Informações adicionais (opcional)"
              rows={3}
              className="px-3 py-2.5 text-sm rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#263548] text-[#1E293B] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38A169]/40 resize-none"
            />
            {errors.observacoes && (
              <p className="text-xs text-red-500">{errors.observacoes.message}</p>
            )}
          </div>

          {/* Erro geral */}
          {generalError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {generalError}
            </p>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { reset(); onClose(); }}
              className="px-4 py-2 text-sm rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#263548]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createNF.isPending}
              className="px-5 py-2 text-sm rounded-lg bg-[#38A169] text-white hover:bg-[#2F9259] disabled:opacity-60"
            >
              {createNF.isPending ? "Salvando..." : "Criar Nota"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
