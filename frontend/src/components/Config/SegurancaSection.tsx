import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { useState, forwardRef } from "react";
import { useZodForm } from "../../hooks/useZodForm";
import { segurancaSchema, type SegurancaInput } from "../../validate/seguranca.schema";

const inputCls =
  "w-full h-10 px-3 rounded-lg text-sm border bg-[#F8FAFC] dark:bg-[#263548] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#38A169] focus:border-[#38A169] transition-colors";

const inputErrCls =
  "w-full h-10 px-3 rounded-lg text-sm border bg-[#F8FAFC] dark:bg-[#263548] border-red-400 dark:border-red-500 text-[#1E293B] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-red-400 transition-colors";

const PasswordInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
>(function PasswordInput({ hasError, ...rest }, ref) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...rest}
        ref={ref}
        type={show ? "text" : "password"}
        className={`${hasError ? inputErrCls : inputCls} pr-10`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-[#64748B] hover:opacity-70 transition-colors cursor-pointer"
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
});

export function SegurancaSection() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(segurancaSchema, {
    defaultValues: { atual: "", nova: "", confirma: "" },
  });

  function onSubmit(_data: SegurancaInput) {
    setSuccess(true);
    reset();
    console.log(_data)
    setTimeout(() => setSuccess(false), 2500);
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Lock size={18} className="text-[#38A169]" />
        <h2 className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          Segurança
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#64748B] dark:text-[#94A3B8]">Senha atual</label>
            <PasswordInput
              {...register("atual")}
              placeholder="••••••••"
              hasError={!!errors.atual}
            />
            {errors.atual && <p className="text-xs text-red-500">{errors.atual.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#64748B] dark:text-[#94A3B8]">Nova senha</label>
            <PasswordInput
              {...register("nova")}
              placeholder="Mínimo 8 caracteres"
              hasError={!!errors.nova}
            />
            {errors.nova && <p className="text-xs text-red-500">{errors.nova.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#64748B] dark:text-[#94A3B8]">Confirmar nova senha</label>
            <PasswordInput
              {...register("confirma")}
              placeholder="Repita a nova senha"
              hasError={!!errors.confirma}
            />
            {errors.confirma && <p className="text-xs text-red-500">{errors.confirma.message}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            type="submit"
            className="h-10 px-5 bg-[#38A169] hover:bg-[#2F9259] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Atualizar Senha
          </button>
          {success && (
            <span className="flex items-center gap-1.5 text-sm text-[#38A169]">
              <Check size={15} /> Senha atualizada!
            </span>
          )}
          {errors.atual && !success && (
            <span className="flex items-center gap-1.5 text-sm text-red-500">
              <X size={15} /> Verifique os campos
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
