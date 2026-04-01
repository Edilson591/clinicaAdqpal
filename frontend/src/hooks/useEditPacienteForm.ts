import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useZodForm } from "./useZodForm";
import { usePatient, useUpdatePatient } from "./usePatients";
import {
  editPacientSchema,
  type EditPacientInput,
} from "../validate/editPacient";
import { formatCpf } from "../utils/formatCpf";
import { formatPhone } from "../utils/formatPhone";

export function useEditPacienteForm(id: string) {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { data: patient, isLoading: isLoadingPatient } = usePatient(id);
  const { mutate: updatePatient, isPending: isSaving } = useUpdatePatient();

  const form = useZodForm(editPacientSchema, {
    defaultValues: {
      name: "",
      dateOfBirth: "",
      cpf: "",
      gender: "",
      phone: "",
      email: "",
      state: "",
      streetNumber: "",
      city: "",
      street: "",
      zipCode: "",
      additionalInfo: "",
      agreement: "",
    },
  });

  // Preenche o form quando os dados do paciente chegam
  useEffect(() => {
    console.log(patient);
    if (patient) {
      form.reset({
        name: patient.name ?? "",
        cpf: formatCpf(patient.cpf ?? ""),
        email: patient.email ?? "",
        phone: formatPhone(patient.phone ?? ""),
        gender: patient.gender ?? "",
        agreement: patient.agreement ?? "",
        dateOfBirth: patient.dateOfBirth
          ? new Date(patient.dateOfBirth).toISOString()
          : null,
        street: patient.street ?? "",
        streetNumber: patient.streetNumber ?? "",
        city: patient.city ?? "",
        state: patient.state ?? "",
        zipCode: patient.zipCode ?? "",
        additionalInfo: patient.additionalInfo ?? "",
      });
    }
  }, [patient, form]);

  const onSubmit = form.handleSubmit((data: EditPacientInput) => {
    setGeneralError(null);

    const prevData = {
      ...data,
      cpf:  data.cpf?.replace(/\D/g, ""),
      phone: data.phone?.replace(/\D/g, ""),
      gender: data.gender || "feminino",
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString()
        : null,
    };

    console.log(prevData)
    updatePatient(
      {
        id,
        data: prevData,
      },
      {
        onSuccess: () => navigate("/pacientes"),
        onError: (error) => {
          setGeneralError(
            isAxiosError(error)
              ? (error.response?.data?.message ?? "Erro ao salvar alterações.")
              : "Erro ao conectar com o servidor.",
          );
        },
      },
    );
  });

  return {
    ...form,
    onSubmit,
    isLoadingPatient,
    isSaving,
    generalError,
    patient,
  };
}
