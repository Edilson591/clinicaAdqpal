import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { userService } from "../services/User";
import { useZodForm } from "./useZodForm";
import { resetPasswordSchema, type ResetPasswordInput } from "../validate/resetPassword.schema";

function useResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useZodForm(resetPasswordSchema, {
    defaultValues: { password: "", confirmPassword: "" },
  });

  const resetMutation = useMutation({
    mutationFn: (password: string) => userService.resetPassword(token, password),
    onSuccess: () => {
      navigate("/reset-password/sucesso");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        navigate("/reset-password/expirado");
      } else if (isAxiosError(error)) {
        setGeneralError(error.response?.data?.message ?? "Erro ao redefinir a senha.");
      } else {
        setGeneralError("Erro ao conectar com o servidor. Tente novamente.");
      }
    },
  });

  const onSubmit = handleSubmit((data: ResetPasswordInput) => {
    setGeneralError(null);
    resetMutation.mutate(data.password);
  });

  return {
    register,
    errors,
    generalError,
    isLoading: resetMutation.isPending,
    token,
    onSubmit,
  };
}

export default useResetPasswordForm;
