import { User } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { PerfilInput } from "../../validate/perfil.schema";

interface PerfilSectionProps {
  register: UseFormRegister<PerfilInput>;
  errors: FieldErrors<PerfilInput>;
  nome: string;
  especialidade: string;
}

const inputCls =
  "w-full h-10 px-3 rounded-lg text-sm border bg-[#F8FAFC] dark:bg-[#263548] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#38A169] focus:border-[#38A169] transition-colors";

const inputErrCls =
  "w-full h-10 px-3 rounded-lg text-sm border bg-[#F8FAFC] dark:bg-[#263548] border-red-400 dark:border-red-500 text-[#1E293B] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-red-400 transition-colors";

export function PerfilSection({
  register,
  errors,
  nome,
  especialidade,
}: PerfilSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      {/* Título da seção */}
      <div className="flex items-center gap-2">
        <User size={18} className="text-[#38A169]" />
        <h2 className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          Perfil do Usuário
        </h2>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#E8F5E9] dark:bg-[#1E3A2F] flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-[#38A169]">
            {nome.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">
            {nome}
          </p>
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B]">
            {especialidade}
          </p>
        </div>
      </div>

      {/* Campos — pen: XRdSG / wetjN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Nome
          </label>
          <input
            {...register("nome")}
            type="text"
            placeholder="Nome completo"
            className={errors.nome ? inputErrCls : inputCls}
          />
          {errors.nome && (
            <p className="text-xs text-red-500">{errors.nome.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            E-mail
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="seu@email.com"
            className={errors.email ? inputErrCls : inputCls}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Especialidade
          </label>
          <input
            {...register("especialidade")}
            type="text"
            placeholder="Ex: Clínico Geral"
            className={errors.especialidade ? inputErrCls : inputCls}
          />
          {errors.especialidade && (
            <p className="text-xs text-red-500">
              {errors.especialidade.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
