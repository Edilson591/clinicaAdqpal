import { useParams, useNavigate } from "react-router-dom";
import { Save, Lock, User, FileText, Briefcase, MapPin } from "lucide-react";
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
import { formatCpfOrCpnj } from "../../utils/formatCpf";
import { ROLE_OPTIONS } from "../../hooks/useUsersPage";
import { useEditUserForm } from "../../hooks/useEditUserForm";
import { IMaskInput } from "react-imask";
import { Controller } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { BirthDatePickerInput } from "../../components/ui/DatePickerInput";
import { SelectGroup } from "../../components/ui/Select";
import { ESTADOS } from "../../data/state";
import { formatCep } from "../../utils/formatCep";
import { VoiceTextarea } from "../../components/ui/VoiceTextarea";

const ROLE_SELECT_OPTIONS = ROLE_OPTIONS.filter((o) => o.value !== "");

const GENDER_OPTIONS = [
  { value: "", label: "Não informado" },
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "outro", label: "Outro" },
];

function EditUserContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    setValue,
    watch,
    errors,
    onSubmit,
    isLoadingUser,
    control,
    isSaving,
    saveError,
    loadError,
    linkedEmployee,
  } = useEditUserForm(id ?? "");

  const roleId = watch("roleId");
  const isEmployee = watch("isEmployee");
  const gender = watch("gender") ?? "";
  const phoneError = errors["phone"]?.message as string | undefined;
  const inputBase =
    "flex w-full items-center h-14 min-h-[56px] dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground rounded-lg border border-border-input bg-surface px-4 text-base font-normal text-foreground transition-all duration-150 ease-in-out placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <FormContent>
      <Header isSearchAvaliable={false} />

      <FormHeader
        title="Usuários"
        link="/configuracoes/usuarios"
        subTitle="Editar Usuário"
        description="Altere os dados do usuário abaixo"
      />

      <FormCard>
        {(saveError || loadError) && (
          <div className="mb-1">
            <ErrorAlert message={saveError ?? loadError ?? ""} />
          </div>
        )}

        {isLoadingUser ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
            <DividerForm />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
            {/* Informações básicas */}
            <FormSection icon={User} title="Informações Básicas">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup
                  label="Nome de usuário"
                  required
                  error={errors.username?.message}
                  inputProps={{
                    placeholder: "Nome completo",
                    className: "bg-[#F8FAFC]",
                    ...register("username"),
                  }}
                />
                <InputGroup
                  label="E-mail"
                  required
                  error={errors.email?.message}
                  inputProps={{
                    type: "email",
                    placeholder: "usuario@email.com",
                    className: "bg-[#F8FAFC]",
                    ...register("email"),
                  }}
                />
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
                  label="CPF ou CNPJ"
                  error={errors.cpfOrCnpj?.message}
                  inputProps={{
                    type: "text",
                    placeholder: "000.000.000-00",
                    className: "bg-[#F8FAFC]",
                    ...register("cpfOrCnpj"),
                    onChange: (e) => {
                      setValue("cpfOrCnpj", formatCpfOrCpnj(e.target.value));
                    },
                    maxLength: 18,
                  }}
                />
              </div>
            </FormSection>

            <DividerForm />

            {/* Redefinir senha */}
            <FormSection icon={Lock} title="Redefinir Senha">
              <p className="text-sm text-[#94A3B8] -mt-2">
                Deixe em branco para manter a senha atual
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </FormSection>

            <DividerForm />

            {/* Checkbox funcionário */}
            <div className="flex items-start gap-3">
              <input
                id="isEmployee"
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-[#CBD5E1] text-[#38A169] accent-[#38A169] cursor-pointer"
                {...register("isEmployee")}
              />
              <label
                htmlFor="isEmployee"
                className="cursor-pointer select-none"
              >
                <p className="text-sm font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                  Este usuário também é um funcionário da clínica
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {linkedEmployee
                    ? `Funcionário vinculado: ${linkedEmployee.position}${linkedEmployee.department ? ` — ${linkedEmployee.department}` : ""}`
                    : "Ao marcar, será criado ou atualizado um registro de funcionário vinculado"}
                </p>
              </label>
            </div>

            {/* Campos de funcionário */}
            {isEmployee && (
              <>
                <DividerForm />

                <FormSection icon={Briefcase} title="Dados Profissionais">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup
                      label="Cargo"
                      required
                      error={errors.position?.message}
                      inputProps={{
                        placeholder: "Ex: Médico, Recepcionista",
                        className: "bg-[#F8FAFC]",
                        ...register("position"),
                      }}
                    />
                    <InputGroup
                      label="Departamento"
                      inputProps={{
                        placeholder: "Ex: Clínica Geral",
                        className: "bg-[#F8FAFC]",
                        ...register("department"),
                      }}
                    />
                    <Controller
                      name={"phone"}
                      control={control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-2 w-full">
                          <label className="text-sm font-semibold text-primary-dark dark:text-[#94A3B8] leading-5">
                            Telefone
                          </label>
                          <IMaskInput
                            mask="(00) 00000-0000"
                            value={field.value ?? ""}
                            onAccept={(value: string) => field.onChange(value)}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            placeholder="(00) 00000-0000"
                            className={twMerge(
                              inputBase,
                              "bg-[#F8FAFC]",
                              phoneError &&
                                "border-destructive focus:ring-destructive/20",
                            )}
                          />
                        </div>
                      )}
                    />
                    <Controller
                      name={"hireDate"}
                      control={control}
                      render={({ field }) => (
                        <BirthDatePickerInput
                          label="Data de admissão"
                          required
                          error={errors.hireDate?.message as string}
                          selected={
                            field.value ? new Date(field.value) : new Date()
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? date.toISOString().split("T")[0] : "",
                            )
                          }
                        />
                      )}
                    />
                    <Controller
                      name={"salary"}
                      control={control}
                      rules={{
                        pattern: {
                          value: /^(\d{1,3}(\.\d{3})*|\d+)(,\d{1,2})?$/,
                          message: "Formato de salário inválido",
                        },
                      }}
                      render={({ field }) => (
                        <InputGroup
                          label="Salário (R$)"
                          error={errors.salary?.message as string}
                          inputProps={{
                            type: "text",
                            placeholder: "0,00",
                            className: "bg-[#F8FAFC]",
                            value: field.value || "",
                            onChange: (e) => {
                              let value = e.target.value;

                              // remove tudo que não for número, . ou ,
                              value = value.replace(/[^0-9.,]/g, "");

                              // impede começar com . ou ,
                              value = value.replace(/^[.,]+/, "");

                              const parts = value.split(/[.,]/);

                              if (parts.length > 2) {
                                value = parts.slice(0, 2).join(".");
                              }

                              field.onChange(value);
                            },
                          }}
                        />
                      )}
                    />
                    <Controller
                      name={"dateOfBirth"}
                      control={control}
                      render={({ field }) => (
                        <BirthDatePickerInput
                          label="Data de nascimento"
                          required
                          error={errors.dateOfBirth?.message as string}
                          selected={
                            field.value ? new Date(field.value) : new Date()
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? date.toISOString().split("T")[0] : "",
                            )
                          }
                        />
                      )}
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#374151] dark:text-[#CBD5E1]">
                        Gênero
                      </label>
                      <SearchableSelect
                        options={GENDER_OPTIONS}
                        value={gender}
                        onChange={(val) => setValue("gender", val)}
                        placeholder="Selecione"
                        className="h-14 text-sm"
                      />
                    </div>
                  </div>
                </FormSection>

                <DividerForm />

                <FormSection icon={MapPin} title="Endereço">
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
                        placeholder: "Ex: 123",
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
                    <SelectGroup
                      label="Estado"
                      selectProps={{
                        ...register("state"),
                        className: "bg-[#F8FAFC]",
                        options: ESTADOS.map((uf) => ({
                          value: uf,
                          label: uf,
                        })),
                      }}
                      helperText={errors["state"]?.message as string}
                      error={errors["state"]?.message as string}
                    />

                    <InputGroup
                      label="CEP"
                      inputProps={{
                        type: "text",
                        placeholder: "00000-000",
                        ...register("zipCode"),
                        onChange: (e) => {
                          const formated = formatCep(e.target.value);
                          e.target.value = formated;
                        },
                        maxLength: 9,
                        className: "bg-[#F8FAFC]",
                      }}
                      helperText={errors["zipCode"]?.message as string}
                      error={errors["zipCode"]?.message as string}
                    />
                  </div>
                </FormSection>

                <DividerForm />

                <FormSection icon={FileText} title="Observações">
                  <VoiceTextarea
                    // label="Observações"
                    error={errors["notes"]?.message as string}
                    placeholder="Informações adicionais..."
                    className="bg-[#F8FAFC] resize-none"
                    rows={4}
                    currentValue={String(watch("notes"))}
                    onTranscriptAppend={(val) =>
                      setValue("notes", val as string)
                    }
                    {...register("notes")}
                  />
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
                onClick={() => navigate("/configuracoes/usuarios")}
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

export default function EditUserPage() {
  return <EditUserContent />;
}
