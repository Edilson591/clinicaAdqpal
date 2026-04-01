import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useZodForm } from "./useZodForm";
import { useCreateAppointment } from "./useAppointments";
import { novaConsultaSchema, type NovaConsultaInput } from "../validate/novaConsulta.schema";
// import { useAuth } from "../context/AuthContext";

export function useNovaConsultaForm() {
  // const { user } = useAuth();
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);

  


  const form = useZodForm(novaConsultaSchema, {
    defaultValues: {
      doctorId: "",
      patientId: "",
      data: new Date(),
      hora: new Date("2026-03-30T08:00:00"),
      notes: "",
    },
  });

  const { mutate: createAppointment, isPending: isLoading } = useCreateAppointment();

  const onSubmit = form.handleSubmit((data: NovaConsultaInput) => {
    setGeneralError(null);

    // Combina data + hora em ISO string
    // hora é um Date retornado pelo InputPickerTime — extrai apenas h/m
    const horaDate = data.hora as Date;

    console.log(horaDate)
    const scheduledAt = new Date(
      data.data.getFullYear(),
      data.data.getMonth(),
      data.data.getDate(),
      horaDate.getHours(),
      horaDate.getMinutes(),
    ).toISOString();

    createAppointment(
      {
        userId: data.doctorId,
        patientId: data.patientId,
        scheduledAt,
        notes: data.notes ?? null,
      },
      {
        onSuccess: () => {
          form.reset();
          navigate("/agenda");
        },
        onError: (error) => {
          setGeneralError(
            isAxiosError(error)
              ? (error.response?.data?.message ?? "Erro ao agendar consulta.")
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
  };
}
