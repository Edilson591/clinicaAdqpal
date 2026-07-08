import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useZodForm } from "./useZodForm";
import {
  useAppointmentsByDateAndTime,
  useCreateAppointment,
  useSendWhatsApp,
} from "./useAppointments";
import {
  novaConsultaSchema,
  type NovaConsultaInput,
} from "../validate/novaConsulta.schema";
import { usePatient } from "./usePatients";
import { formatToInternationalPhone } from "../utils/formatPhone";

export function useNovaConsultaForm() {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const form = useZodForm(novaConsultaSchema, {
    defaultValues: {
      doctorId: "",
      patientId: "",
      data: new Date(),
      hora: new Date("2026-03-30T08:00:00"),
      type: "IN_PERSON" as const,
      specialtyId: "",
      roomId: "",
      meetingLink: "",
      address: "",
      notes: "",
    },
  });

  const dataObj = form.watch("data");
  const horaObj = form.watch("hora");

  const date = dataObj.toLocaleDateString("sv-SE"); // formato YYYY-MM-DD
  const hora = horaObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const { data: appointments = [] } = useAppointmentsByDateAndTime(
    date,
    hora,
    hora,
  );

  const { mutate: createAppointment, isPending: isLoading } =
    useCreateAppointment();
    const { data: patient } = usePatient(form.watch("patientId"));
  const { mutate: sendWhatsApp } = useSendWhatsApp();

  const onSubmit = form.handleSubmit((data: NovaConsultaInput) => {
    setGeneralError(null);

    const hasConflict = appointments.some(
      (app) => app.userId === data.doctorId && app.status === "SCHEDULED",
    );

    if (hasConflict) {
      form.setError("data", {
        type: "manual",
        message: "Médico já possui consulta agendada neste horário",
      });
      return;
    }

    const horaDate = data.hora as Date;

    const scheduledAt = `${date}T${String(horaDate.getHours()).padStart(2, "0")}:${String(horaDate.getMinutes()).padStart(2, "0")}`;

    createAppointment(
      {
        userId: data.doctorId,
        patientId: data.patientId,
        scheduledAt,
        type: data.type,
        specialtyId: data.specialtyId || null,
        roomId: data.roomId || null,
        meetingLink: data.meetingLink || null,
        address: data.address || null,
        notes: data.notes ?? null,
      },
      {
        onSuccess: (appointment) => {
          const phone = patient?.phone;
          if (phone) {
            const phoneInternational = formatToInternationalPhone(patient?.phone ?? "")
            sendWhatsApp({
              id: appointment.id,
              data: { telefone: phoneInternational, channels: ["whatsapp"] },
            });
          }
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
