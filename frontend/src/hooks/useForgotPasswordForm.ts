import { useState } from "react";
import { useZodForm } from "./useZodForm";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../validate/forgotPassword.schema";

function useForgotPasswordForm() {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useZodForm(forgotPasswordSchema, {
    defaultValues: { email: "" },
  });

  /**
   * Simulação de envio de e-mail de recuperação
   * TODO: Substituir por useMutation(userService.sendResetEmail) quando backend estiver pronto
   */
  const sendResetEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (email === "naoexiste@teste.com") {
      return { success: false, error: "E-mail não encontrado no sistema." };
    }
    return { success: true };
  };

  const onSubmit = handleSubmit(async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setGeneralError(null);
    setSuccessMessage(null);

    try {
      const result = await sendResetEmail(data.email);
      if (result.success) {
        setSuccessMessage("Se este e-mail estiver cadastrado, você receberá as instruções em breve.");
        reset();
      } else {
        setGeneralError(result.error ?? "Erro ao processar a solicitação.");
      }
    } catch {
      setGeneralError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  });

  return {
    register,
    errors,
    generalError,
    isLoading,
    successMessage,
    onSubmit,
  };
}

export default useForgotPasswordForm;
