import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

import LogoContainer from "../../components/ui/LogoContainer";

export function ResetPasswordSuccessPage() {
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

        <CheckCircle className="size-16 mt-8" style={{ color: "#38a169" }} />

        <h1
          className="text-[28px] font-bold mt-6 text-center leading-tight"
          style={{ color: "#1a365d" }}
        >
          Senha redefinida!
        </h1>

        <p
          className="text-base font-normal text-center mt-2"
          style={{ color: "#718096" }}
        >
          Sua senha foi redefinida com sucesso. Agora você pode fazer login com
          sua nova senha.
        </p>

        <Link to="/login" className="w-full mt-8">
          <button
            type="button"
            className="w-full h-14 px-6 inline-flex cursor-pointer items-center justify-center gap-2.5 font-semibold transition-all rounded-lg shadow-sm text-base bg-gradient-to-r from-[#1a365d] to-[#38a169] text-white hover:from-[#1a365d]/90 hover:to-[#38a169]/90"
          >
            <span>Ir para o login</span>
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

export default ResetPasswordSuccessPage;
