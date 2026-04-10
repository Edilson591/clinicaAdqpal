import { ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRoleLabel } from "../../types/roles";

export function AcessoNegado() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleLabel = user ? getRoleLabel(user.roleId) : "";

  return (
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-center transition-colors duration-200">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm px-6">
        {/* Ícone */}
        <div className="w-16 h-16 rounded-2xl bg-[#FEE2E2] flex items-center justify-center">
          <ShieldOff size={32} className="text-[#EF4444]" />
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[20px] font-bold text-[#1E293B] dark:text-[#F1F5F9]">
            Acesso Restrito
          </h2>
          <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Sua conta <span className="font-medium text-[#475569] dark:text-[#CBD5E1]">({roleLabel})</span>{" "}
            não tem permissão para acessar a Gestão Financeira.
          </p>
          <p className="text-[12px] text-[#94A3B8]">
            Acesso permitido para: Administrador, Recepcionista e Suporte de TI.
          </p>
        </div>

        {/* Ação */}
        <button
          onClick={() => navigate("/dashboard")}
          className="h-10 px-5 rounded-lg bg-[#1E293B] dark:bg-[#334155] text-white text-[13px] font-semibold hover:opacity-80 transition-opacity cursor-pointer"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </main>
  );
}
