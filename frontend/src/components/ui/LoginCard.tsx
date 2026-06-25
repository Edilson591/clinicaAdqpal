import { type FormEvent } from "react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Button } from "./Button";
import { InputGroup } from "./Input";
import { LogIn } from "lucide-react";
// import LogoContainer from "./LogoContainer";
import ErrorAlert from "./ErrorAlert";
import LoadingSpinner from "./Spinner";
import type { LoginInput } from "../../validate/login.schema";
import { ContentLogo } from "./ContentLogo";
import { LgpdFooter } from "./LgpdFooter";
import logo from "../../../public/logo-adqpal.png";

// =============================================================================
// TYPES
// =============================================================================
interface LoginCardProps {
  register: UseFormRegister<LoginInput>;
  errors: FieldErrors<LoginInput>;
  generalError: string | null;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
  onForgotPassword: () => void;
}

function LoginCard({
  register,
  errors,
  generalError,
  isLoading,
  onSubmit,
  onForgotPassword,
}: LoginCardProps) {
  return (
    <div
      className="w-full max-w-120 bg-white rounded-2xl p-6 sm:p-12 flex flex-col items-center"
      style={{
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Logo Container */}
      <ContentLogo logo={logo} />
      {/* <LogoContainer /> */}

      {/* Título - ID: XPRor */}
      <h1
        className="text-2xl sm:text-[28px] font-bold mt-4 text-center leading-tight"
        style={{ color: "#1a365d" }}
      >
        Bem-vindo ao ADQPAL
      </h1>

      {/* Subtítulo - ID: WRpo5 */}
      <p
        className="text-sm sm:text-base font-normal text-center mt-2"
        style={{ color: "#718096" }}
      >
        Acesse sua conta para gerenciar a clínica.
      </p>

      {/* Mensagem de erro geral */}
      {generalError && <ErrorAlert message={generalError} />}

      {/* Formulário de Login */}
      <form
        onSubmit={onSubmit}
        className="w-full flex flex-col gap-6 mt-6"
        noValidate
      >
        {/* Campo de E-mail - ID: nHuPs + 21Qho */}
        <InputGroup
          label="E-mail"
          required
          error={errors.email?.message}
          inputProps={{
            ...register("email"),
            type: "email",
            placeholder: "Digite seu e-mail",
            "aria-label": "Digite seu e-mail",
            disabled: isLoading,
          }}
        />

        {/* Campo de Senha - ID: jLzFK + DkxVi */}
        <InputGroup
          label="Senha"
          required
          error={errors.password?.message}
          inputProps={{
            ...register("password"),
            type: "password",
            placeholder: "Digite sua senha",
            "aria-label": "Digite sua senha",
            disabled: isLoading,
          }}
        />

        {/* Link "Esqueceu a senha?" - ID: RQfnD */}
        <a
          href="#"
          className="text-sm text-accent hover:underline self-end focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          onClick={(e) => {
            e.preventDefault();
            onForgotPassword();
          }}
        >
          Esqueceu a senha?
        </a>

        {/* Botão de Login - ID: ppmIs */}
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
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <LogIn className="size-5" />
              <span>Entrar</span>
            </>
          )}
        </Button>
      </form>

      {/* Footer LGPD - ID: QTyPO */}
      <LgpdFooter />
    </div>
  );
}

export default LoginCard;
export { LoginCard };
