import ReactDatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, Clock } from "lucide-react";
import { forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";
import { Label } from "./Input";
import type { LabelProps } from "./Input";

registerLocale("pt-BR", ptBR);

// =============================================================================
// CUSTOM INPUT — styled identically ao Input.tsx
// =============================================================================

interface StyledInputProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
  hasError?: boolean;
}

const StyledDateInput = forwardRef<HTMLInputElement, StyledInputProps>(
  ({ value, onClick, placeholder, hasError }, ref) => (
    <div className="relative w-full cursor-pointer" onClick={onClick}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <CalendarDays className="h-5 w-5" />
      </div>
      <input
        ref={ref}
        readOnly
        value={value ?? ""}
        placeholder={placeholder}
        className={twMerge(
          "flex w-full items-center",
          "h-14 min-h-14 rounded-lg",
          "border border-border-input bg-surface",
          "pl-12 pr-4",
          "text-base font-normal text-foreground",
          "transition-all duration-150 ease-in-out",
          "placeholder:text-muted-foreground bg-[#F8FAFC]",
          "dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "cursor-pointer",
          hasError && "border-destructive focus:ring-destructive/20",
        )}
      />
    </div>
  ),
);

StyledDateInput.displayName = "StyledDateInput";

// Input estilizado para horário — usa ícone de relógio
const StyledTimeInput = forwardRef<HTMLInputElement, StyledInputProps>(
  ({ value, onClick, placeholder, hasError }, ref) => (
    <div className="relative w-full cursor-pointer" onClick={onClick}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <Clock className="h-5 w-5" />
      </div>
      <input
        ref={ref}
        readOnly
        value={value ?? ""}
        placeholder={placeholder}
        className={twMerge(
          "flex w-full items-center",
          "h-14 min-h-14 rounded-lg",
          "border border-border-input bg-surface",
          "pl-12 pr-4",
          "text-base font-normal text-foreground",
          "transition-all duration-150 ease-in-out",
          "placeholder:text-muted-foreground bg-[#F8FAFC]",
          "dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "cursor-pointer",
          hasError && "border-destructive focus:ring-destructive/20",
        )}
      />
    </div>
  ),
);

StyledTimeInput.displayName = "StyledTimeInput";

// =============================================================================
// PROPS
// =============================================================================

export interface DatePickerInputProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  labelProps?: LabelProps;
  placeholderText?: string;
  maxDate?: Date;
  minDate?: Date;
  dateFormat?: string;
  showTimeSelect?: boolean;
  timeIntervals?: number;
  timeCaption?: string;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  showTimeSelectOnly?: boolean;
  scrollableYearDropdown?: boolean;
  yearDropdownItemNumber?: number;
  dropdownMode?: "scroll" | "select";
  locale?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DatePickerInput({
  selected,
  onChange,
  label,
  required,
  error,
  helperText,
  labelProps,
  placeholderText = "DD/MM/AAAA",
  maxDate,
  minDate,
  dateFormat = "dd/MM/yyyy",
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeIntervals = 15,
  timeCaption = "Hora",
  showYearDropdown = false,
  showMonthDropdown = false,
  scrollableYearDropdown = false,
  yearDropdownItemNumber = 100,
  dropdownMode = "select",
  locale = "pt-BR",
}: DatePickerInputProps) {
  const uid = useId();
  const inputId = `datepicker-${uid}`;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <Label htmlFor={inputId} required={required} {...labelProps}>
          {label}
        </Label>
      )}

      <ReactDatePicker
        id={inputId}
        selected={selected}
        onChange={onChange}
        dateFormat={dateFormat}
        placeholderText={placeholderText}
        maxDate={maxDate}
        minDate={minDate}
        showTimeSelect={showTimeSelect}
        showTimeSelectOnly={showTimeSelectOnly}
        timeIntervals={timeIntervals}
        timeCaption={timeCaption}
        showYearDropdown={showYearDropdown}
        showMonthDropdown={showMonthDropdown}
        scrollableYearDropdown={scrollableYearDropdown}
        yearDropdownItemNumber={yearDropdownItemNumber}
        dropdownMode={dropdownMode}
        locale={locale}
        customInput={
          <StyledDateInput hasError={!!error} placeholder={placeholderText} />
        }
        wrapperClassName="w-full dark:text-muted-foreground"
        popperClassName="z-50"
      />

      {(helperText || error) && (
        <p
          className={twMerge(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// BIRTH DATE PICKER — defaults prontos para data de nascimento
// =============================================================================

export interface BirthDatePickerInputProps extends Omit<
  DatePickerInputProps,
  | "showYearDropdown"
  | "showMonthDropdown"
  | "scrollableYearDropdown"
  | "yearDropdownItemNumber"
  | "dropdownMode"
  | "maxDate"
> {
  maxDate?: Date;
}

export function BirthDatePickerInput({
  label = "Data de nascimento",
  placeholderText = "DD/MM/AAAA",
  maxDate = new Date(),
  ...props
}: BirthDatePickerInputProps) {
  return (
    <DatePickerInput
      label={label}
      placeholderText={placeholderText}
      maxDate={maxDate}
      showYearDropdown
      showMonthDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={100}
      dropdownMode="select"
      {...props}
    />
  );
}

// =============================================================================
// INPUT PICKER TIME — defaults para todos os input tipo time
// =============================================================================

export interface InputPickerTimeProps extends Omit<
  DatePickerInputProps,
  | "showYearDropdown"
  | "showMonthDropdown"
  | "scrollableYearDropdown"
  | "yearDropdownItemNumber"
  | "dropdownMode"
  | "maxDate"
> {
  label?: string;
  placeholderText?: string;
  maxDate?: Date;
  timeIntervals?: number;
  timeCaption?: string;
}

export function InputPickerTime({
  selected,
  onChange,
  label = "Horário",
  required,
  error,
  helperText,
  labelProps,
  placeholderText = "HH:mm",
  timeIntervals = 15,
  timeCaption = "Horário",
}: InputPickerTimeProps) {
  const uid = useId();
  const inputId = `timepicker-${uid}`;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <Label htmlFor={inputId} required={required} {...labelProps}>
          {label}
        </Label>
      )}

      <ReactDatePicker
        id={inputId}
        selected={selected}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals}
        timeCaption={timeCaption}
        dateFormat="HH:mm"
        placeholderText={placeholderText}
        locale="pt-BR"
        customInput={
          <StyledTimeInput hasError={!!error} placeholder={placeholderText} />
        }
        wrapperClassName="w-full"
        popperClassName="z-50"
      />

      {(helperText || error) && (
        <p
          className={twMerge(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
