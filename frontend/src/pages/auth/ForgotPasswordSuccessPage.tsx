import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

import logo from "../../../public/logo-adqpal.png";
import { ContentLogo } from "../../components/ui/ContentLogo";

export function ForgotPasswordSuccessPage() {
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
        <ContentLogo logo={logo} />

        <CheckCircle className="size-16 mt-8" style={{ color: "#38a169" }} />

        <h1
          className="text-[28px] font-bold mt-6 text-center leading-tight"
          style={{ color: "#1a365d" }}
        >
          E-mail enviado!
        </h1>

        <p
          className="text-base font-normal text-center mt-2"
          style={{ color: "#718096" }}
        >
          Se este e-mail estiver cadastrado, você receberá as instruções de
          recuperação em breve. Verifique sua caixa de entrada e a pasta de spam.
        </p>

        <Link
          to="/login"
          className="w-full mt-8"
        >
          <button
            type="button"
            className="w-full h-14 px-6 inline-flex cursor-pointer items-center justify-center gap-2.5 font-semibold transition-all rounded-lg shadow-sm text-base bg-gradient-to-r from-[#1a365d] to-[#38a169] text-white hover:from-[#1a365d]/90 hover:to-[#38a169]/90"
          >
            <ArrowLeft className="size-5" />
            <span>Voltar para o login</span>
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

export default ForgotPasswordSuccessPage;
