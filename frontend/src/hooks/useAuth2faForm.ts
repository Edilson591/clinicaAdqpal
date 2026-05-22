import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { isAxiosError } from "axios";
import { auth2faService } from "../services/Auth2fa";
import { setCredentials, clearTempToken } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store";
import { useZodForm } from "./useZodForm";
import { auth2faSchema, type Auth2faInput } from "../validate/auth2fa.schema";

export function useAuth2faForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const tempToken = useSelector((state: RootState) => state.auth.tempToken);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const email =
    (location.state as { email?: string } | null)?.email ??
    sessionStorage.getItem("adqpal_2fa_email") ??
    "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(auth2faSchema, {
    defaultValues: { code: "" },
  });

  const verifyMutation = useMutation({
    mutationFn: (data: Auth2faInput) =>
      auth2faService.verify({ code: data.code }),
    onSuccess: (result) => {
      dispatch(clearTempToken());
      sessionStorage.removeItem("adqpal_2fa_email");
      dispatch(setCredentials({ user: result.user, token: result.token }));
      navigate("/dashboard");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          setGeneralError(
            "Código expirado ou inválido. Faça login novamente.",
          );
        } else {
          setGeneralError(
            error.response?.data?.message ?? "Código inválido. Tente novamente.",
          );
        }
      } else {
        setGeneralError("Erro ao conectar com o servidor. Tente novamente.");
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => auth2faService.resend(),
    onSuccess: () => {
      setResendMessage("Código reenviado com sucesso!");
      setGeneralError(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setGeneralError(
          error.response?.data?.message ?? "Erro ao reenviar código.",
        );
      } else {
        setGeneralError("Erro ao conectar com o servidor. Tente novamente.");
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    setGeneralError(null);
    setResendMessage(null);
    verifyMutation.mutate(data);
  });

  const onResend = () => {
    setResendMessage(null);
    setGeneralError(null);
    resendMutation.mutate();
  };

  const onBackToLogin = () => {
    dispatch(clearTempToken());
    sessionStorage.removeItem("adqpal_2fa_email");
    navigate("/login");
  };

  return {
    register,
    errors,
    generalError,
    resendMessage,
    email,
    isLoading: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    onSubmit,
    onResend,
    onBackToLogin,
    hasTempToken: !!tempToken,
  };
}
