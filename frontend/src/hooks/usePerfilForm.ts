import { useMutation } from "@tanstack/react-query";
import { useZodForm } from "./useZodForm";
import { formatCpf, formatCpfOrCpnj } from "../utils/formatCpf";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { perfilSchema, type PerfilInput } from "../validate/perfil.schema";
import { userService } from "../services/User";
import { useSpecialties, useSpecialtiesByDoctor } from "./useSpecialties";
import { useNavigate } from "react-router-dom";

const DOCTOR_ROLE_ID = 3;

function usePerfilForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isDoctor = user?.roleId === DOCTOR_ROLE_ID;

  const { data: allSpecialties = [] } = useSpecialties();
  const { data: doctorSpecialties = [] } = useSpecialtiesByDoctor(
    user?.id ?? ""
  );


    const defaultSpecialtyIds = doctorSpecialties.map((s) => s.id);


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useZodForm(perfilSchema, {
    defaultValues: {
      nome: user?.username ?? "",
      email: user?.email ?? "",
      cpfOrCnpj: user?.cpf
        ? formatCpf(user.cpf)
        : formatCpfOrCpnj(user?.cnpj ?? ""),
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      specialtyIds: defaultSpecialtyIds,
    },
  });

  const selectedIds: string[] = watch("specialtyIds") ?? [];

  const toggleSpecialty = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((s) => s !== id)
      : [...selectedIds, id];

    setValue("specialtyIds", next);
  };

  const mutation = useMutation({
    mutationFn: async (data: PerfilInput) => {
      const digits = (data.cpfOrCnpj ?? "").replace(/\D/g, "");

      const docField =
        digits.length === 11
          ? { cpf: digits, cnpj: null }
          : digits.length === 14
          ? { cnpj: digits, cpf: null }
          : {};

      return userService.update(user!.id, {
        username: data.nome,
        email: data.email,
        ...docField,
        ...(data.newPassword && {
          currentPassword: data.currentPassword,
          password: data.newPassword,
        }),
        ...(isDoctor &&
          data.specialtyIds !== undefined && {
            specialtyIds: data.specialtyIds,
          }),
      });
    },

    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Perfil atualizado com sucesso!",
      });
    },

    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao atualizar o perfil. Tente novamente.";

      setFeedback({ type: "error", message: msg });
    },
  });

  const onSubmit = handleSubmit((data) => {
    setFeedback(null);
    mutation.mutate(data);
  });

  return {
    register,
    errors,
    feedback,
    setValue,
    isLoading: mutation.isPending,
    onSubmit,
    toggleSpecialty,
    selectedIds,
    allSpecialties,
    isDoctor,
    onForgotPassword: () => navigate("/esqueceu-a-senha"),
  };
}

export default usePerfilForm;