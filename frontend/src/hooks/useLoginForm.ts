import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { isAxiosError } from "axios";
import { userService } from "../services/User";
import { setCredentials } from "../store/authSlice";
import type { AppDispatch } from "../store";
import { useZodForm } from "./useZodForm";
import { loginSchema, type LoginInput } from "../validate/login.schema";

function useLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useZodForm(loginSchema, {
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => userService.login(data),
    onSuccess: (result) => {
      dispatch(setCredentials(result));
      navigate("/dashboard");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setGeneralError(error.response?.data?.message ?? "E-mail ou senha incorretos.");
      } else {
        setGeneralError("Erro ao conectar com o servidor. Tente novamente.");
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    setGeneralError(null);
    loginMutation.mutate(data);
  });

  return {
    register,
    errors,
    generalError,
    isLoading: loginMutation.isPending,
    onSubmit,
    onForgotPassword: () => navigate("/esqueceu-a-senha"),
  };
}

export default useLoginForm;
