import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useZodForm } from "./useZodForm";
import {
  novoProntuarioSchema,
  type NovoProntuarioInput,
} from "../validate/novoProntuario.schema";
import { useAuth } from "../context/AuthContext";
import { useCreateMedicalRecord } from "./useMedicalRecords";

function buildNotes(data: NovoProntuarioInput): string {
  const parts: string[] = [];
  if (data.queixaPrincipal) parts.push(`Queixa principal: ${data.queixaPrincipal}`);
  if (data.hda) parts.push(`HDA: ${data.hda}`);
  if (data.antecedentes) parts.push(`Antecedentes: ${data.antecedentes}`);
  const vitals = [
    data.pa && `PA: ${data.pa}`,
    data.fc && `FC: ${data.fc}`,
    data.temperatura && `Temp: ${data.temperatura}°C`,
    data.spo2 && `SpO2: ${data.spo2}%`,
    data.peso && `Peso: ${data.peso}kg`,
    data.altura && `Altura: ${data.altura}cm`,
  ]
    .filter(Boolean)
    .join(" | ");
  if (vitals) parts.push(`Sinais vitais: ${vitals}`);
  if (data.exameFisicoGeral) parts.push(`Exame físico: ${data.exameFisicoGeral}`);
  return parts.join("\n");
}

function buildDiagnosis(data: NovoProntuarioInput): string {
  const parts: string[] = [];
  if (data.hipoteseDiagnostica) parts.push(data.hipoteseDiagnostica);
  if (data.cid10) parts.push(`CID-10: ${data.cid10}`);
  return parts.join(" — ");
}

export function useNovoProntuarioForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { mutate: createRecord, isPending: isLoading } = useCreateMedicalRecord();

  const form = useZodForm(novoProntuarioSchema, {
    defaultValues: {
      pacienteId: "",
      appointmentId: "",
      dataConsulta: new Date().toISOString().split("T")[0],
      tipoConsulta: "",
      medicoResponsavel: user?.username ?? "",
      queixaPrincipal: "",
      hda: "",
      antecedentes: "",
      pa: "",
      fc: "",
      temperatura: "",
      spo2: "",
      peso: "",
      altura: "",
      exameFisicoGeral: "",
      cid10: "",
      hipoteseDiagnostica: "",
      conduta: "",
    },
  });

  const onSubmit = form.handleSubmit((data: NovoProntuarioInput) => {
    setGeneralError(null);
    createRecord(
      {
        appointmentId: data.appointmentId,
        patientId: data.pacienteId,
        diagnosis: buildDiagnosis(data) || null,
        prescription: data.conduta || null,
        notes: buildNotes(data) || null,
      },
      {
        onSuccess: () => {
          form.reset();
          navigate("/prontuarios");
        },
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
    isLoading,
    generalError,
    medicoNome: user?.username ?? "",
  };
}
