import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { IMaskInput } from "react-imask";
import { twMerge } from "tailwind-merge";
import { InputGroup } from "../ui/Input";
import { FormSection } from "../Form/FormSection";
import { PhoneCall } from "lucide-react";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

// Classes que espelham exatamente o <Input variant="default"> do design system
const inputBase =
  "flex w-full items-center h-14 min-h-[56px] dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground rounded-lg border border-border-input bg-surface px-4 text-base font-normal text-foreground transition-all duration-150 ease-in-out placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50";

export const ContatoSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: Props<T>) => {
  const phoneError = errors["phone"]?.message as string | undefined;

  return (
    <FormSection icon={PhoneCall} title="Contato">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Telefone — IMask para deleção sem bugs */}
        <Controller
          name={"phone" as Path<T>}
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
                  phoneError && "border-destructive focus:ring-destructive/20",
                )}
              />
              {phoneError && (
                <p className="text-sm text-destructive">{phoneError}</p>
              )}
            </div>
          )}
        />

        <InputGroup
          label="E-mail"
          inputProps={{
            type: "email",
            placeholder: "email@exemplo.com",
            ...register("email" as Path<T>),
            className: "bg-[#F8FAFC]",
          }}
          helperText={errors["email"]?.message as string}
          error={errors["email"]?.message as string}
        />
      </div>
    </FormSection>
  );
};
