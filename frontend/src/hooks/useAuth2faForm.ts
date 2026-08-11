import { useEffect, useState } from "react";
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
  const [resendSeconds, setResendSeconds] = useState(readResendSeconds);

  useEffect(() => {
    const updateCountdown = () => setResendSeconds(readResendSeconds());
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(timer);
  }, []);

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
      if (!result?.user || !result?.token) {
        setGeneralError("Erro ao autenticar. Tente novamente.");
        return;
      }

      dispatch(clearTempToken());
      sessionStorage.removeItem("adqpal_2fa_email");
      sessionStorage.removeItem("adqpal_2fa_resend_at");
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
    onSuccess: (result) => {
      const seconds = result.resendAvailableInSeconds ?? 60;
      sessionStorage.setItem(
        "adqpal_2fa_resend_at",
        String(Date.now() + seconds * 1000),
      );
      setResendSeconds(seconds);
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
    if (resendSeconds > 0) return;
    setResendMessage(null);
    setGeneralError(null);
    resendMutation.mutate();
  };

  const onBackToLogin = () => {
    dispatch(clearTempToken());
    sessionStorage.removeItem("adqpal_2fa_email");
    sessionStorage.removeItem("adqpal_2fa_resend_at");
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
    resendSeconds,
    onSubmit,
    onResend,
    onBackToLogin,
    hasTempToken: !!tempToken,
  };
}

function readResendSeconds(): number {
  const resendAt = Number(sessionStorage.getItem("adqpal_2fa_resend_at") ?? 0);
  return Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
}
