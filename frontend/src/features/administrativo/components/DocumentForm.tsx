import { IMaskInput } from "react-imask";
import { twMerge } from "tailwind-merge";
import { InputGroup } from "../../../components/ui/Input";
import { DatePickerInput, InputPickerTime } from "../../../components/ui/DatePickerInput";
import { SelectGroup } from "../../../components/ui/Select";
import { VoiceTextarea } from "../../../components/ui/VoiceTextarea";
import { formatCurrencyInput } from "../../../utils/formatCurrency";
import { formatCpf } from "../../../utils/formatCpf";
import { formatCep } from "../../../utils/formatCep";
import type { AdministrativeDocumentConfig, AdministrativeValues } from "../documents/types";

type DocumentFormProps = {
  document: AdministrativeDocumentConfig;
  values: AdministrativeValues;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
};

const inputBase =
  "flex w-full items-center h-14 min-h-[56px] rounded-lg border border-border-input bg-[#F8FAFC] px-4 text-base font-normal text-foreground transition-all duration-150 ease-in-out placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground";

function isCpfField(name: string, label: string) {
  return `${name} ${label}`.toLowerCase().includes("cpf");
}

function isCnpjField(name: string, label: string) {
  return `${name} ${label}`.toLowerCase().includes("cnpj");
}

function formatCnpj(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function isPhoneField(name: string, label: string) {
  const normalized = `${name} ${label}`.toLowerCase();
  return normalized.includes("telefone") || normalized.includes("celular") || normalized.includes("phone") || normalized.includes("contato");
}

function isDateField(name: string, label: string, type?: string) {
  const normalized = `${name} ${label}`.toLowerCase();
  return type === "date" || normalized.includes("data") || normalized.includes("previsaoparto") || normalized.includes("previsao do parto") || normalized.includes("previsão do parto") || normalized === "dia" || normalized.includes(" dia");
}

function isTimeField(name: string, label: string) {
  const normalized = `${name} ${label}`.toLowerCase();
  return normalized.includes("horario") || normalized.includes("horário");
}

function isCurrencyField(name: string, label: string) {
  return name.toLowerCase() === "valor" && label.toLowerCase() === "valor";
}

function isNumericField(name: string, label: string) {
  const normalized = `${name} ${label}`.toLowerCase();
  return normalized.includes("rg") || normalized.includes("numero do oficio") || normalized.includes("número do oficio") || normalized.includes("numero de linhas") || normalized.includes("número de linhas");
}

function isCepField(name: string, label: string) {
  return `${name} ${label}`.toLowerCase().includes("cep");
}

function formatDateValue(date: Date | null, fieldName: string) {
  if (!date) return "";
  const formatted = new Intl.DateTimeFormat("pt-BR").format(date);
  return fieldName === "data" ? `Sao Miguel dos Campos/AL, ${formatted}` : formatted;
}

function parseDateValue(value: string) {
  const match = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatTimeValue(date: Date | null) {
  if (!date) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function parseTimeValue(value: string) {
  const match = value.match(/(\d{1,2})[:hH](\d{2})?/);
  if (!match) return null;
  const date = new Date();
  date.setHours(Number(match[1]), Number(match[2] ?? 0), 0, 0);
  return date;
}

export function DocumentForm({ document, values, errors, onChange }: DocumentFormProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1E293B] sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1E293B] dark:text-[#F1F5F9]">{document.title}</h2>
        <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">{document.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {document.fields.map((field) => {
          const value = values[field.name] ?? field.defaultValue ?? "";
          const className = field.full ? "md:col-span-2" : undefined;

          if (field.type === "textarea") {
            return (
              <div key={field.name} className={className}>
                <VoiceTextarea
                  className={twMerge("bg-[#F8FAFC] resize-none", field.rows && field.rows >= 10 && "min-h-[280px] font-mono text-sm leading-6")}
                  label={field.label}
                  required={field.required}
                  error={errors[field.name]}
                  value={value}
                  currentValue={value}
                  placeholder={field.placeholder}
                  autoComplete="new-password"
                  rows={field.rows}
                  onChange={(event) => onChange(field.name, event.target.value)}
                  onTranscriptAppend={(nextValue) => onChange(field.name, nextValue)}
                />
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <SelectGroup
                key={field.name}
                className={className}
                label={field.label}
                required={field.required}
                error={errors[field.name]}
                selectProps={{
                  value,
                  options: field.options ?? [],
                  className: "bg-[#F8FAFC]",
                  autoComplete: "new-password",
                  onChange: (event) => onChange(field.name, event.target.value),
                }}
              />
            );
          }

          if (isDateField(field.name, field.label, field.type)) {
            return (
              <div key={field.name} className={className}>
                <DatePickerInput
                  label={field.label}
                  required={field.required}
                  error={errors[field.name]}
                  selected={parseDateValue(value)}
                  onChange={(date) => onChange(field.name, formatDateValue(date, field.name))}
                  placeholderText="DD/MM/AAAA"
                  showYearDropdown
                  showMonthDropdown
                />
              </div>
            );
          }

          if (field.type === "phone" || isPhoneField(field.name, field.label)) {
            return (
              <div key={field.name} className={twMerge("flex flex-col gap-2 w-full", className)}>
                <label className="text-sm font-semibold text-primary-dark dark:text-[#94A3B8] leading-5">
                  {field.label}{field.required && <span className="ml-1 text-destructive">*</span>}
                </label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={value}
                  onAccept={(nextValue: string) => onChange(field.name, nextValue)}
                  placeholder={field.placeholder ?? "(00) 00000-0000"}
                  autoComplete="new-password"
                  className={twMerge(inputBase, errors[field.name] && "border-destructive focus:ring-destructive/20")}
                />
                {errors[field.name] && <p className="text-sm text-destructive">{errors[field.name]}</p>}
              </div>
            );
          }

          if (isTimeField(field.name, field.label)) {
            return (
              <div key={field.name} className={className}>
                <InputPickerTime
                  label={field.label}
                  required={field.required}
                  error={errors[field.name]}
                  selected={parseTimeValue(value)}
                  onChange={(date) => onChange(field.name, formatTimeValue(date))}
                  timeIntervals={15}
                  timeCaption="Horário"
                />
              </div>
            );
          }

          return (
            <InputGroup
              key={field.name}
              className={className}
              label={field.label}
              required={field.required}
              error={errors[field.name]}
              inputProps={{
                value,
                placeholder: field.placeholder,
                type: "text",
                inputMode: isCurrencyField(field.name, field.label) || isNumericField(field.name, field.label) || isCepField(field.name, field.label) ? "numeric" : undefined,
                autoComplete: "new-password",
                maxLength: isCpfField(field.name, field.label) ? 14 : isCnpjField(field.name, field.label) ? 18 : isCepField(field.name, field.label) ? 9 : undefined,
                className: "bg-[#F8FAFC]",
                onChange: (event) => {
                  const nextValue = isCpfField(field.name, field.label)
                    ? formatCpf(event.target.value).slice(0, 14)
                    : isCnpjField(field.name, field.label)
                      ? formatCnpj(event.target.value)
                    : isCepField(field.name, field.label)
                      ? formatCep(event.target.value)
                    : isNumericField(field.name, field.label)
                      ? event.target.value.replace(/\D/g, "")
                    : isCurrencyField(field.name, field.label)
                      ? formatCurrencyInput(event.target.value)
                      : event.target.value;
                  onChange(field.name, nextValue);
                },
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
