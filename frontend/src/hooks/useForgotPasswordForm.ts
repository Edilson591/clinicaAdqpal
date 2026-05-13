import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { userService } from "../services/User";
import { useZodForm } from "./useZodForm";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../validate/forgotPassword.schema";

function useForgotPasswordForm() {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useZodForm(forgotPasswordSchema, {
    defaultValues: { email: "" },
  });

  const forgotMutation = useMutation({
    mutationFn: (email: string) => userService.forgotPassword(email),
    onSuccess: () => {
      navigate("/esqueceu-a-senha/sucesso");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setGeneralError(error.response?.data?.message ?? "Erro ao processar a solicitação.");
      } else {
        setGeneralError("Erro ao conectar com o servidor. Tente novamente.");
      }
    },
  });

  const onSubmit = handleSubmit((data: ForgotPasswordInput) => {
    setGeneralError(null);
    forgotMutation.mutate(data.email);
  });

  return {
    register,
    errors,
    generalError,
    isLoading: forgotMutation.isPending,
    onSubmit,
  };
}

export default useForgotPasswordForm;
