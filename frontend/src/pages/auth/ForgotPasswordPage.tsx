/**
 * ForgotPasswordPage - Página de Recuperação de Senha ADQPAL
 *
 * Rota pública: /esqueceu-a-senha
 *
 * Estrutura Modular:
 * - useForgotPasswordForm: Hook com lógica do formulário (validação via Zod)
 * - ForgotPasswordPage: Componente principal (UI + lógica combinados)
 *
 * Background: mesmo gradiente da LoginPage
 * - Gradient: #1a365d → #2d3748 → #38a169 (135°)
 */

import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Send } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { InputGroup } from "../../components/ui/Input";
import LogoContainer from "../../components/ui/LogoContainer";
import ErrorAlert from "../../components/ui/ErrorAlert";
import SuccessAlert from "../../components/ui/SuccessAlert";
import LoadingSpinner from "../../components/ui/Spinner";
import useForgotPasswordForm from "../../hooks/useForgotPasswordForm";

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export function ForgotPasswordPage() {
  const { register, errors, generalError, isLoading, successMessage, onSubmit } =
    useForgotPasswordForm();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #38a169 100%)",
      }}
    >
      <div
        className="w-full max-w-120 bg-white rounded-2xl p-8 sm:p-12 flex flex-col items-center"
        style={{
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Logo */}
        <LogoContainer />

        {/* Título */}
        <h1
          className="text-[28px] font-bold mt-8 text-center leading-tight"
          style={{ color: "#1a365d" }}
        >
          Esqueceu a senha?
        </h1>

        {/* Subtítulo */}
        <p
          className="text-base font-normal text-center mt-2"
          style={{ color: "#718096" }}
        >
          Informe seu e-mail e enviaremos as instruções de recuperação.
        </p>

        {/* Feedback de erro geral */}
        {generalError && <ErrorAlert message={generalError} />}

        {/* Feedback de sucesso */}
        {successMessage && <SuccessAlert message={successMessage} />}

        {/* Formulário */}
        {!successMessage && (
          <form
            onSubmit={onSubmit}
            className="w-full flex flex-col gap-6 mt-6"
            noValidate
          >
            <InputGroup
              label="E-mail"
              required
              error={errors.email?.message}
              inputProps={{
                ...register("email"),
                type: "email",
                placeholder: "Digite seu e-mail cadastrado",
                leftIcon: Mail,
                "aria-label": "E-mail para recuperação de senha",
                disabled: isLoading,
              }}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  <span>Enviar instruções</span>
                </>
              )}
            </Button>
          </form>
        )}

        {/* Voltar para login */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm mt-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          style={{ color: "#38a169" }}
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para o login</span>
        </Link>

        {/* Footer */}
        <p
          className="text-sm font-normal text-center mt-8"
          style={{ color: "#718096" }}
        >
          Instituto ADQPAL © 2026
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
