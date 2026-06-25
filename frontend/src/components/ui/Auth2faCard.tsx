import { type FormEvent } from "react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Button } from "./Button";
import { InputGroup } from "./Input";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import LoadingSpinner from "./Spinner";
import type { Auth2faInput } from "../../validate/auth2fa.schema";

interface Auth2faCardProps {
  register: UseFormRegister<Auth2faInput>;
  errors: FieldErrors<Auth2faInput>;
  generalError: string | null;
  resendMessage: string | null;
  email: string;
  isLoading: boolean;
  isResending: boolean;
  onSubmit: (e: FormEvent) => void;
  onResend: () => void;
  onBackToLogin: () => void;
}

function Auth2faCard({
  register,
  errors,
  generalError,
  resendMessage,
  email,
  isLoading,
  isResending,
  onSubmit,
  onResend,
  onBackToLogin,
}: Auth2faCardProps) {
  return (
    <div
      className="w-full max-w-120 bg-white rounded-2xl p-6 sm:p-12 flex flex-col items-center"
      style={{
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#E8F5E9" }}
      >
        <ShieldCheck className="w-8 h-8" style={{ color: "#38A169" }} />
      </div>

      <h1
        className="text-2xl sm:text-[28px] font-bold mt-6 text-center leading-tight"
        style={{ color: "#1a365d" }}
      >
        Verificação em duas etapas
      </h1>

      <p
        className="text-sm sm:text-base font-normal text-center mt-2 max-w-sm break-words"
        style={{ color: "#718096" }}
      >
        Digite o código de 6 dígitos enviado para{" "}
        <span className="font-semibold" style={{ color: "#2D3748" }}>
          {email}
        </span>
      </p>

      {generalError && <ErrorAlert message={generalError} />}
      {resendMessage && <SuccessAlert message={resendMessage} />}

      <form
        onSubmit={onSubmit}
        className="w-full flex flex-col gap-6 mt-6"
        noValidate
      >
        <InputGroup
          label="Código de verificação"
          required
          error={errors.code?.message}
          inputProps={{
            ...register("code"),
            type: "text",
            inputMode: "numeric",
            placeholder: "000000",
            maxLength: 6,
            autoComplete: "one-time-code",
            autoFocus: true,
            "aria-label": "Digite o código de 6 dígitos",
            disabled: isLoading,
            className:
              "text-center text-xl sm:text-2xl tracking-[0.35em] sm:tracking-[0.5em] font-mono placeholder:tracking-normal",
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
              <span>Verificando...</span>
            </>
          ) : (
            <span>Confirmar</span>
          )}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-3 mt-6">
        <button
          type="button"
          onClick={onResend}
          disabled={isResending}
          className="text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: "#38A169" }}
        >
          {isResending ? "Reenviando..." : "Não recebeu o código? Reenviar"}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="flex items-center gap-1.5 text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer"
          style={{ color: "#718096" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o login
        </button>
      </div>
    </div>
  );
}

export default Auth2faCard;
export { Auth2faCard };
