import { X } from "lucide-react";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useZodForm } from "../../hooks/useZodForm";
import {
  patientHistorySchema,
  HISTORY_TYPE_OPTIONS,
  type PatientHistoryInput,
} from "../../validate/patientHistory.schema";
import { useCreatePatientHistory } from "../../hooks/usePatientHistory";
import { InputGroup } from "../ui/Input";
import { SelectGroup } from "../ui/Select";
import { VoiceTextarea } from "../ui/VoiceTextarea";
import { Button } from "../ui/Button";

interface NovoRegistroModalProps {
  patientId: string;
  onClose: () => void;
}

export function NovoRegistroModal({ patientId, onClose }: NovoRegistroModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { mutate: createHistory, isPending } = useCreatePatientHistory(patientId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useZodForm(patientHistorySchema, {
    defaultValues: { type: "CONSULTA", title: "", description: "" },
  });

  const descriptionValue = watch("description");

  const onSubmit = handleSubmit((data: PatientHistoryInput) => {
    setServerError(null);
    createHistory(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error) => {
        setServerError(
          isAxiosError(error)
            ? (error.response?.data?.message ?? "Erro ao salvar registro.")
            : "Erro ao conectar com o servidor.",
        );
      },
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1E293B] rounded-xl border border-[#334155] w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h2 className="text-[16px] font-semibold text-[#F1F5F9]">
            Novo Registro
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 text-[#94A3B8] hover:bg-[#263548]"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 p-6">
          {serverError && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <SelectGroup
            label="Tipo"
            error={errors.type?.message}
            selectProps={{
              ...register("type"),
              options: [...HISTORY_TYPE_OPTIONS],
            }}
          />

          <InputGroup
            label="Título"
            error={errors.title?.message}
            inputProps={{
              ...register("title"),
              placeholder: "Ex: Consulta de Rotina",
            }}
          />

          <VoiceTextarea
            label="Descrição"
            error={errors.description?.message}
            currentValue={descriptionValue}
            onTranscriptAppend={(val) => setValue("description", val)}
            placeholder="Descreva o registro com detalhes..."
            rows={4}
            {...register("description")}
          />

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <Button
              type="submit"
              disabled={isPending}
              className="flex flex-1 items-center gap-2 px-4 py-2.5 rounded-lg bg-[#38A169] text-white text-[13px] font-semibold hover:bg-[#2F9259] transition-colors "
            >
              {isPending ? "Salvando..." : "Salvar Registro"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-11 px-6 rounded-lg text-sm font-medium border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 disabled:opacity-50 transition-all cursor-pointer"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
