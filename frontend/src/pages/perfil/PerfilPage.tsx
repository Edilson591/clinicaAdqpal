import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { InputGroup } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Header } from "../../components/Dashboard/Header";
import { useZodForm } from "../../hooks/useZodForm";
import { perfilSchema, type PerfilInput } from "../../validate/perfil.schema";
import { segurancaSchema, type SegurancaInput } from "../../validate/seguranca.schema";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/User";

// ─── Feedback inline ─────────────────────────────────────────────────────────

function FeedbackMessage({ type, message }: { type: "success" | "error"; message: string }) {
  const isSuccess = type === "success";
  return (
    <div
      className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
        isSuccess
          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
      }`}
    >
      {isSuccess ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

// ─── Seção Perfil ─────────────────────────────────────────────────────────────

function PerfilSection() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(perfilSchema, {
    defaultValues: {
      nome: user?.username ?? "",
      email: user?.email ?? "",
      especialidade: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PerfilInput) =>
      userService.update(user!.id, { username: data.nome, email: data.email }),
    onSuccess: () => {
      setFeedback({ type: "success", message: "Perfil atualizado com sucesso!" });
    },
    onError: () => {
      setFeedback({ type: "error", message: "Erro ao atualizar o perfil. Tente novamente." });
    },
  });

  const onSubmit = handleSubmit((data) => {
    setFeedback(null);
    mutation.mutate(data);
  });

  return (
    <section className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-[#1E3A2F] flex items-center justify-center">
          <User size={20} className="text-[#38A169]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
            Informações do Perfil
          </h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Atualize seus dados pessoais</p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputGroup
            label="Nome completo"
            required
            error={errors.nome?.message}
            inputProps={{
              placeholder: "Seu nome",
              ...register("nome"),
            }}
          />
          <InputGroup
            label="E-mail"
            required
            error={errors.email?.message}
            inputProps={{
              type: "email",
              placeholder: "seu@email.com",
              ...register("email"),
            }}
          />
        </div>

        <InputGroup
          label="Especialidade"
          required
          error={errors.especialidade?.message}
          inputProps={{
            placeholder: "Ex: Psicologia, Nutrição...",
            ...register("especialidade"),
          }}
        />

        {feedback && <FeedbackMessage type={feedback.type} message={feedback.message} />}

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </section>
  );
}

// ─── Seção Segurança ──────────────────────────────────────────────────────────

function SegurancaSection() {
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(segurancaSchema, {
    defaultValues: { atual: "", nova: "", confirma: "" },
  });

  const mutation = useMutation({
    mutationFn: async (_data: SegurancaInput) => {
      await new Promise((res) => setTimeout(res, 800));
    },
    onSuccess: () => {
      setFeedback({ type: "success", message: "Senha alterada com sucesso!" });
      reset();
    },
    onError: () => {
      setFeedback({ type: "error", message: "Erro ao alterar a senha. Verifique a senha atual." });
    },
  });

  const onSubmit = handleSubmit((data) => {
    setFeedback(null);
    mutation.mutate(data);
  });

  return (
    <section className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <Lock size={20} className="text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#1E293B] dark:text-[#F1F5F9]">Segurança</h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Altere sua senha de acesso</p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <InputGroup
          label="Senha atual"
          required
          error={errors.atual?.message}
          inputProps={{
            type: "password",
            placeholder: "••••••••",
            ...register("atual"),
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputGroup
            label="Nova senha"
            required
            error={errors.nova?.message}
            inputProps={{
              type: "password",
              placeholder: "Mínimo 8 caracteres",
              ...register("nova"),
            }}
          />
          <InputGroup
            label="Confirmar nova senha"
            required
            error={errors.confirma?.message}
            inputProps={{
              type: "password",
              placeholder: "Repita a nova senha",
              ...register("confirma"),
            }}
          />
        </div>

        {feedback && <FeedbackMessage type={feedback.type} message={feedback.message} />}

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" disabled={mutation.isPending}>
            {mutation.isPending ? "Alterando..." : "Alterar senha"}
          </Button>
        </div>
      </form>
    </section>
  );
}

// ─── Avatar header ────────────────────────────────────────────────────────────

function AvatarHeader({ username }: { username: string }) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-6">
      <div className="w-16 h-16 rounded-full bg-[#38A169] flex items-center justify-center shrink-0">
        <span className="text-white text-2xl font-bold uppercase">
          {username.charAt(0)}
        </span>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9]">{username}</h2>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Membro da equipe ADQPAL</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const { user } = useAuth();

  return (
    <main className="flex-1 overflow-y-auto bg-[#F5F6FA] dark:bg-[#0F172A] p-6 sm:p-8">
      {/* Header compartilhado (greeting + toggle de tema) */}
      <Header />

      <div className=" mx-auto flex flex-col gap-6">
        {/* Título */}
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">Meu Perfil</h1>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
            Gerencie suas informações e segurança
          </p>
        </div>

        {/* Avatar */}
        {user && <AvatarHeader username={user.username} />}

        {/* Formulários */}
        <PerfilSection />
        <SegurancaSection />
      </div>
    </main>
  );
}
