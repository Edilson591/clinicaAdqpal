import { Lock, Stethoscope, User } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { InputGroup } from "../../components/ui/Input";
import { FeedbackMessage } from "./FeedbackMessage";
import { formatCpfOrCpnj } from "../../utils/formatCpf";

import usePerfilForm from "../../hooks/usePerfilForm";
// import { USER_ROLES } from "../../types/roles";
// import { SearchableMultiSelectGroup } from "../../components/ui/SearchableMultiSelect";

export function PerfilForm() {
  const {
    allSpecialties,
    errors,
    feedback,
    isDoctor,
    onSubmit,
    register,
    toggleSpecialty,
    setValue,
    isLoading,
    selectedIds,
  } = usePerfilForm();

  return (
    <section className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-6 flex flex-col gap-8">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
        {/* Informações pessoais */}
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
              label="CPF ou CNPJ"
              error={errors.cpfOrCnpj?.message}
              inputProps={{
                type: "text",
                placeholder: "Digite CPF ou CNPJ",
                ...register("cpfOrCnpj"),
                onChange: (e) => {
                  const formatted = formatCpfOrCpnj(e.target.value);
                  setValue("cpfOrCnpj", formatted);
                },
                maxLength: 18,
                className: "bg-[#F8FAFC]",
              }}
            />
            {/* {roleId === USER_ROLES.DOCTOR && (
              <SearchableMultiSelectGroup
                label="Especialidades"
                // required={user?.roleId === USER_ROLES.DOCTOR}
                error={errors.especialidades?.message}
                value={watch("especialidades") || []}
                onChange={(value) => setValue("especialidades", value)}
                options={specialties}
                placeholder="Selecione as especialidades"
                maxItems={5}
              />
            )} */}
          </div>
        </div>

        <hr className="border-[#E5E7EB] dark:border-[#334155]" />

        {/* Alterar senha */}
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

        {/* Especialidades (somente médicos) */}
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
            disabled={isLoading}
            className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
          >
            {isLoading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </section>
  );
}
