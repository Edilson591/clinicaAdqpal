import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  User,
  Lock,
  CheckCircle,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { InputGroup } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Header } from "../../components/Dashboard/Header";
import { useZodForm } from "../../hooks/useZodForm";
import { perfilSchema, type PerfilInput } from "../../validate/perfil.schema";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/User";
import { formatCpf, formatCpfOrCpnj } from "../../utils/formatCpf";
import api from "../../services/api";
import type { ApiResponse, SpecialtyResponse } from "../../types/api";

const DOCTOR_ROLE_ID = 3;

// ─── Feedback inline ─────────────────────────────────────────────────────────

function FeedbackMessage({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
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
        <h2 className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          {username}
        </h2>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
          Membro da equipe ADQPAL
        </p>
      </div>
    </div>
  );
}

// ─── Formulário unificado ─────────────────────────────────────────────────────

function PerfilForm() {
  const { user } = useAuth();
  const isDoctor = user?.roleId === DOCTOR_ROLE_ID;

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Busca especialidades disponíveis (somente para médicos)
  const { data: allSpecialties = [] } = useQuery<SpecialtyResponse[]>({
    queryKey: ["specialties"],
    enabled: isDoctor,
    queryFn: async () => {
      const res =
        await api.get<ApiResponse<SpecialtyResponse[]>>("/specialties");
      return res.data.data ?? [];
    },
  });

  // Busca especialidades atuais do médico
  const { data: doctorSpecialties = [] } = useQuery<SpecialtyResponse[]>({
    queryKey: ["specialties", "doctor", user?.id],
    enabled: isDoctor && !!user?.id,
    queryFn: async () => {
      const res = await api.get<ApiResponse<SpecialtyResponse[]>>(
        `/specialties/doctor/${user!.id}`,
      );
      return res.data.data ?? [];
    },
  });

  const defaultSpecialtyIds = doctorSpecialties.map((s) => s.id);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useZodForm(perfilSchema, {
    defaultValues: {
      nome: user?.username ?? "",
      email: user?.email ?? "",
      cpfOrCnpj: formatCpf(user?.cpf ?? ""),
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      specialtyIds: defaultSpecialtyIds,
    },
  });

  const selectedIds: string[] = watch("specialtyIds") ?? [];

  const toggleSpecialty = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((s) => s !== id)
      : [...selectedIds, id];
    setValue("specialtyIds", next);
  };

  const mutation = useMutation({
    mutationFn: (data: PerfilInput) => {
      const digits = (data.cpfOrCnpj ?? "").replace(/\D/g, "");
      const docField =
        digits.length === 11
          ? { cpf: digits, cnpj: null }
          : digits.length === 14
            ? { cnpj: digits, cpf: null }
            : {};
      return userService.update(user!.id, {
        username: data.nome,
        email: data.email,
        ...docField,
        ...(data.newPassword && {
          currentPassword: data.currentPassword,
          password: data.newPassword,
        }),
        ...(isDoctor &&
          data.specialtyIds !== undefined && {
            specialtyIds: data.specialtyIds,
          }),
      });
    },
    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Perfil atualizado com sucesso!",
      });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao atualizar o perfil. Tente novamente.";
      setFeedback({ type: "error", message: msg });
    },
  });

  const onSubmit = handleSubmit((data) => {
    setFeedback(null);
    mutation.mutate(data);
  });

  return (
    <section className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-6 flex flex-col gap-8">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
        {/* ── Informações pessoais ───────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-[#1E3A2F] flex items-center justify-center">
              <User size={20} className="text-[#38A169]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
                Informações do Perfil
              </h2>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                Atualize seus dados pessoais
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputGroup
              label="Nome completo"
              required
              error={errors.nome?.message}
              inputProps={{
                placeholder: "Seu nome",
                className: "bg-[#F8FAFC]",
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
                className: "bg-[#F8FAFC]",
                ...register("email"),
              }}
            />
            <InputGroup
              label="Cpf ou Cnpj"
              error={errors.cpfOrCnpj?.message}
              inputProps={{
                type: "text",
                placeholder: "Digite CPF ou CNPJ",
                ...register("cpfOrCnpj"),
                onChange: (e) => {
                  const formatted = formatCpfOrCpnj(e.target.value);
                  setValue("cpfOrCnpj", formatted);
                },
                maxLength: 17,
                className: "bg-[#F8FAFC]",
              }}
            />
          </div>
        </div>

        <hr className="border-[#E5E7EB] dark:border-[#334155]" />

        {/* ── Alterar senha ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Lock size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
                Alterar Senha
              </h2>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                Deixe em branco para não alterar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputGroup
              label="Senha atual"
              error={errors.currentPassword?.message}
              inputProps={{
                type: "password",
                placeholder: "••••••••",
                className: "bg-[#F8FAFC]",
                ...register("currentPassword"),
              }}
            />
            <div />
            <InputGroup
              label="Nova senha"
              error={errors.newPassword?.message}
              inputProps={{
                type: "password",
                placeholder: "Mínimo 8 caracteres",
                className: "bg-[#F8FAFC]",
                ...register("newPassword"),
              }}
            />
            <InputGroup
              label="Confirmar nova senha"
              error={errors.confirmPassword?.message}
              inputProps={{
                type: "password",
                placeholder: "Repita a nova senha",
                className: "bg-[#F8FAFC]",
                ...register("confirmPassword"),
              }}
            />
          </div>
        </div>

        {/* ── Especialidades (somente médicos) ───────────────────────────── */}
        {isDoctor && allSpecialties.length > 0 && (
          <>
            <hr className="border-[#E5E7EB] dark:border-[#334155]" />
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Stethoscope
                    size={20}
                    className="text-purple-500 dark:text-purple-400"
                  />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
                    Especialidades
                  </h2>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                    Selecione as especialidades que você atende
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {allSpecialties.map((specialty) => {
                  const active = selectedIds.includes(specialty.id);
                  return (
                    <button
                      key={specialty.id}
                      type="button"
                      onClick={() => toggleSpecialty(specialty.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        active
                          ? "bg-[#38A169] text-white border-[#38A169]"
                          : "bg-white dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border-[#E5E7EB] dark:border-[#334155] hover:border-[#38A169] hover:text-[#38A169]"
                      }`}
                    >
                      {specialty.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {feedback && (
          <FeedbackMessage type={feedback.type} message={feedback.message} />
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={mutation.isPending}
            className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
          >
            {mutation.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const { user } = useAuth();

  return (
    <main className="flex-1 overflow-y-auto bg-[#F5F6FA] dark:bg-[#0F172A] p-6 sm:p-8">
      <Header />

      <div className="mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
            Meu Perfil
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
            Gerencie suas informações e segurança
          </p>
        </div>

        {user && <AvatarHeader username={user.username} />}

        <PerfilForm />
      </div>
    </main>
  );
}
