import { Link } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { InputGroup } from "../../components/ui/Input";
import LogoContainer from "../../components/ui/LogoContainer";
import ErrorAlert from "../../components/ui/ErrorAlert";
import LoadingSpinner from "../../components/ui/Spinner";
import useResetPasswordForm from "../../hooks/useResetPasswordForm";

export function ResetPasswordPage() {
  const { register, errors, generalError, isLoading, token, onSubmit } =
    useResetPasswordForm();

  if (!token) {
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
          <LogoContainer />
          <ShieldCheck className="size-16 mt-8" style={{ color: "#E53E3E" }} />
          <h1
            className="text-[28px] font-bold mt-6 text-center leading-tight"
            style={{ color: "#1a365d" }}
          >
            Link inválido
          </h1>
          <p
            className="text-base font-normal text-center mt-2"
            style={{ color: "#718096" }}
          >
            O link de redefinição de senha é inválido. Solicite um novo link na
            página de recuperação.
          </p>
          <Link to="/esqueceu-a-senha" className="w-full mt-8">
            <button
              type="button"
              className="w-full h-14 px-6 inline-flex cursor-pointer items-center justify-center gap-2.5 font-semibold transition-all rounded-lg shadow-sm text-base bg-gradient-to-r from-[#1a365d] to-[#38a169] text-white hover:from-[#1a365d]/90 hover:to-[#38a169]/90"
            >
              <span>Ir para recuperação</span>
            </button>
          </Link>
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
        <LogoContainer />

        <h1
          className="text-[28px] font-bold mt-8 text-center leading-tight"
          style={{ color: "#1a365d" }}
        >
          Redefinir senha
        </h1>

        <p
          className="text-base font-normal text-center mt-2"
          style={{ color: "#718096" }}
        >
          Escolha uma nova senha para sua conta.
        </p>

        {generalError && <ErrorAlert message={generalError} />}

        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-6 mt-6"
          noValidate
        >
          <InputGroup
            label="Nova senha"
            required
            error={errors.password?.message}
            inputProps={{
              ...register("password"),
              type: "password",
              placeholder: "Mín. 8 caracteres, 1 maiúscula e 1 número",
              leftIcon: Lock,
              "aria-label": "Nova senha",
              disabled: isLoading,
            }}
          />

          <InputGroup
            label="Confirmar senha"
            required
            error={errors.confirmPassword?.message}
            inputProps={{
              ...register("confirmPassword"),
              type: "password",
              placeholder: "Repita a nova senha",
              leftIcon: Lock,
              "aria-label": "Confirmar nova senha",
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
                <span>Redefinindo...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="size-5" />
                <span>Redefinir senha</span>
              </>
            )}
          </Button>
        </form>

        <Link
          to="/login"
          className="flex items-center gap-2 text-sm mt-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          style={{ color: "#38a169" }}
        >
          <span>Voltar para o login</span>
        </Link>

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

export default ResetPasswordPage;
