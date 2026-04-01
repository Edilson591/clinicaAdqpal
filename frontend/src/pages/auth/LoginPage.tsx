/**
 * LoginPage - Página de Login ADQPAL
 *
 * Design System: Baseado em designAdqpal.pen - Login Screen (ID: bi8Au) e Login Card (ID: 4oTlQ)
 *
 * Estrutura Modular:
 * - useLoginForm: Hook com toda a lógica do formulário (validação via Zod, estado, submissão)
 * - LoginCard: Componente de UI puro (apresentação)
 * - LoginPage: Componente principal que combina lógica + UI
 *
 * Background do Design (Login Screen - ID: bi8Au):
 * - Gradient: #1a365d → #2d3748 → #38a169 (135° rotation)
 * - Type: linear gradient
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../components/ui/LoginCard";
import useLoginForm from "../../hooks/useLoginForm";
import { useAuth } from "../../context/AuthContext";
import { getCookie } from "../../store/authSlice";

export function LoginPage() {
  const { register, errors, generalError, isLoading, onSubmit, onForgotPassword } = useLoginForm();

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const token = getCookie("adqpal_token");
    if (token || user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #38a169 100%)",
      }}
    >
      <LoginCard
        register={register}
        errors={errors}
        generalError={generalError}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onForgotPassword={onForgotPassword}
      />
    </div>
  );
}

export default LoginPage;
