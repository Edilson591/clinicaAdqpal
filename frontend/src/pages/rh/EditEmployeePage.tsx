import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  FileText,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { Button } from "../../components/ui/Button";
import { InputGroup } from "../../components/ui/Input";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { DividerForm } from "../../components/ui/DividerForms";
import { FieldSkeleton } from "../../components/ui/FieldSkeleton";
import { FormContent } from "../../components/Form/FormContent";
import { FormHeader } from "../../components/Form/FormHeader";
import { FormCard } from "../../components/Form/FormCard";
import { FormSection } from "../../components/Form/FormSection";
import { SearchableSelect } from "../../components/ui/SearchableSelect";
import { useEditEmployeeForm } from "../../hooks/useEditEmployeeForm";
import { ROLE_OPTIONS } from "../../hooks/useUsersPage";
// import { formatCpf } from "../../utils/formatCpf";
import { DadosPessoaisSection } from "../../components/NewPacient/DadosPessoaisSection";
import { DadosProfissionaisSection } from "../../components/NewEmployee/DadosProfissionaisSection";
import { EnderecoSection } from "../../components/NewPacient/EnderecoSection";
import { ContatoSection } from "../../components/NewPacient/ContatoSection";
import { VoiceTextarea } from "../../components/ui/VoiceTextarea";

const ROLE_SELECT_OPTIONS = ROLE_OPTIONS.filter((o) => o.value !== "");

// const GENDER_OPTIONS = [
//   { value: "", label: "Não informado" },
//   { value: "Masculino", label: "Masculino" },
//   { value: "Feminino", label: "Feminino" },
//   { value: "Outro", label: "Outro" },
// ];

export default function EditEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    register,
    setValue,
    watch,
    errors,
    hasSystemAccess,
    hasLinkedUser,
    onSubmit,
    isLoading,
    isSaving,
    control,
    saveError,
    loadError,
  } = useEditEmployeeForm(id ?? "");

  // const status = watch("status") ?? "ACTIVE";
  // const gender = watch("gender") ?? "";
  const roleId = watch("roleId") ?? "";

  return (
    <FormContent>
      <Header isSearchAvaliable={false} />

      <FormHeader
        title="Recursos Humanos"
        link="/rh"
        subTitle="Editar Funcionário"
        description="Altere os dados do funcionário abaixo"
      />

      <FormCard>
        {(saveError || loadError) && (
          <div className="mb-1">
            <ErrorAlert message={saveError ?? loadError ?? ""} />
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
            <DividerForm />
            <FieldSkeleton tall />
            <FieldSkeleton tall />
            <DividerForm />
            <FieldSkeleton tall />
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
            {/* Identificação */}
            <DadosPessoaisSection
              control={control}
              errors={errors}
              register={register}
            />

            <DividerForm />

            <ContatoSection
              control={control}
              errors={errors}
              register={register}
            />

            <DividerForm />
            {/* Dados profissionais */}
            <DadosProfissionaisSection
              control={control}
              errors={errors}
              register={register}
              isEdition={true}
            />

            <DividerForm />

            {/* Endereço */}
            {/* <FormSection icon={MapPin} title="Endereço">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup
                  label="Logradouro"
                  inputProps={{
                    placeholder: "Rua, Avenida...",
                    className: "bg-[#F8FAFC]",
                    ...register("street"),
                  }}
                />
                <InputGroup
                  label="Número"
                  inputProps={{
                    placeholder: "123",
                    className: "bg-[#F8FAFC]",
                    ...register("streetNumber"),
                  }}
                />
                <InputGroup
                  label="Cidade"
                  inputProps={{
                    placeholder: "São Paulo",
                    className: "bg-[#F8FAFC]",
                    ...register("city"),
                  }}
                />
                <InputGroup
                  label="Estado (UF)"
                  inputProps={{
                    placeholder: "SP",
                    maxLength: 2,
                    className: "bg-[#F8FAFC] uppercase",
                    ...register("state"),
                  }}
                />
                <InputGroup
                  label="CEP"
                  inputProps={{
                    placeholder: "00000-000",
                    className: "bg-[#F8FAFC]",
                    ...register("zipCode"),
                  }}
                />
              </div>
            </FormSection> */}
            <EnderecoSection errors={errors} register={register} />

            <DividerForm />

            {/* Observações */}
            <FormSection icon={FileText} title="Observações">
              <VoiceTextarea
                // label="Observações"
                error={errors["notes"]?.message as string}
                placeholder="Informações adicionais..."
                className="bg-[#F8FAFC] resize-none"
                rows={4}
                currentValue={String(watch("notes"))}
                onTranscriptAppend={(val) => setValue("notes", val as string)}
                {...register("notes")}
              />
            </FormSection>

            <DividerForm />

            {/* Checkbox — acesso ao sistema */}
            <div className="flex items-start gap-3">
              <input
                id="hasSystemAccess"
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-[#CBD5E1] text-[#38A169] accent-[#38A169] cursor-pointer"
                {...register("hasSystemAccess")}
              />
              <label
                htmlFor="hasSystemAccess"
                className="cursor-pointer select-none"
              >
                <p className="text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                  Este funcionário tem acesso ao sistema
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {hasLinkedUser
                    ? "Conta de usuário vinculada — você pode editar o perfil e a senha abaixo"
                    : "Ao marcar, será criada uma conta de usuário vinculada a este funcionário"}
                </p>
              </label>
            </div>

            {/* Seção de acesso — aparece ao marcar o checkbox */}
            {hasSystemAccess && (
              <>
                <DividerForm />

                <FormSection icon={ShieldCheck} title="Perfil de Acesso">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#374151] dark:text-[#CBD5E1]">
                        Perfil <span className="text-red-500">*</span>
                      </label>
                      <SearchableSelect
                        options={ROLE_SELECT_OPTIONS}
                        value={roleId}
                        onChange={(val) => setValue("roleId", val)}
                        placeholder="Selecione o perfil"
                        error={!!errors.roleId}
                        className="h-14 text-sm"
                      />
                      {errors.roleId && (
                        <p className="text-sm text-red-500">
                          {errors.roleId.message}
                        </p>
                      )}
                    </div>
                    <InputGroup
                      label="Nome de usuário"
                      required
                      error={errors.username?.message}
                      inputProps={{
                        placeholder: "Nome para login",
                        className: "bg-[#F8FAFC]",
                        ...register("username"),
                      }}
                    />
                  </div>
                </FormSection>

                <FormSection
                  icon={Lock}
                  title={
                    hasLinkedUser
                      ? "Alterar Senha (opcional)"
                      : "Senha de Acesso"
                  }
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup
                      label={hasLinkedUser ? "Nova senha" : "Senha"}
                      required={!hasLinkedUser}
                      error={errors.password?.message}
                      inputProps={{
                        type: "password",
                        placeholder: hasLinkedUser
                          ? "Deixe em branco para não alterar"
                          : "Mínimo 8 caracteres",
                        className: "bg-[#F8FAFC]",
                        ...register("password"),
                      }}
                    />
                    <InputGroup
                      label="Confirmar senha"
                      required={!hasLinkedUser}
                      error={errors.confirmPassword?.message}
                      inputProps={{
                        type: "password",
                        placeholder: "Repita a senha",
                        className: "bg-[#F8FAFC]",
                        ...register("confirmPassword"),
                      }}
                    />
                  </div>
                </FormSection>
              </>
            )}

            {/* Ações */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                className="bg-[#38A169] from-[#38A169] to-[#38A169] hover:from-[#2F9259] hover:to-[#2F9259] h-11 px-5"
              >
                <Save size={16} />
                {isSaving ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 rounded-lg text-sm font-medium border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:opacity-80 transition-all cursor-pointer"
                onClick={() => navigate("/rh")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </FormCard>
    </FormContent>
  );
}
