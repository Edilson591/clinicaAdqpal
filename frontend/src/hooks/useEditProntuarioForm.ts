import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useZodForm } from "./useZodForm";
import { useMedicalRecord, useUpdateMedicalRecord } from "./useMedicalRecords";
import {
  editProntuarioSchema,
  type EditProntuarioInput,
} from "../validate/editProntuario.schema";

export function useEditProntuarioForm(id: string) {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { data: record, isLoading: isLoadingRecord } = useMedicalRecord(id);
  const { mutate: updateRecord, isPending: isSaving } = useUpdateMedicalRecord();

  const form = useZodForm(editProntuarioSchema, {
    defaultValues: {
      diagnosis: "",
      prescription: "",
      notes: "",
    },
  });

  // Preenche o form quando os dados chegam
  useEffect(() => {
    if (record) {
      form.reset({
        diagnosis: record.diagnosis ?? "",
        prescription: record.prescription ?? "",
        notes: record.notes ?? "",
      });
    }
  }, [record, form]);

  const onSubmit = form.handleSubmit((data: EditProntuarioInput) => {
    setGeneralError(null);
    updateRecord(
      {
        id,
        data: {
          diagnosis: data.diagnosis ?? null,
          prescription: data.prescription ?? null,
          notes: data.notes ?? null,
        },
      },
      {
        onSuccess: () => navigate("/prontuarios"),
        onError: (error) => {
          setGeneralError(
            isAxiosError(error)
              ? (error.response?.data?.message ?? "Erro ao salvar prontuário.")
              : "Erro ao conectar com o servidor.",
          );
        },
      },
    );
  });

  return {
    ...form,
    onSubmit,
    isLoadingRecord,
    isSaving,
    generalError,
    record,
  };
}
