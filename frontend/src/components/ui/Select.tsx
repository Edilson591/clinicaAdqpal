import { tv, type VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import { ChevronDown, type LucideIcon } from "lucide-react";
import {
  forwardRef,
  useId,
  type ComponentProps,
} from "react";
import { Label, type LabelProps } from "./Input";

// =============================================================================
// SELECT VARIANTS
// =============================================================================

const selectVariants = tv({
  base: [
    "flex w-full items-center appearance-none",
    "h-14 min-h-[56px]",
    "rounded-lg",
    "border border-border-input",
    "bg-surface px-4 pr-10",
    "text-base font-normal text-foreground",
    "transition-all duration-150 ease-in-out",
    "placeholder:text-muted-foreground ",
    "dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
    "cursor-pointer",
  ],
  variants: {
    variant: {
      default: "",
      error: [
        "border-destructive",
        "focus:ring-destructive/20",
      ],
    },
    size: {
      default: "h-14 px-4 pr-10",
      sm: "h-10 px-3 pr-9 text-sm",
      lg: "h-16 px-5 pr-11 text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// =============================================================================
// SELECT GROUP VARIANTS
// =============================================================================

const selectGroupVariants = tv({
  base: ["flex flex-col gap-2", "w-full"],
});

// =============================================================================
// TYPES
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<ComponentProps<"select">, "size">,
    VariantProps<typeof selectVariants> {
  /** Ícone à esquerda */
  leftIcon?: LucideIcon;
  /** Placeholder desabilitado (primeira opção vazia) */
  placeholder?: string;
  /** Opções do select */
  options?: SelectOption[];
}

export interface SelectGroupProps extends ComponentProps<"div"> {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  selectProps?: SelectProps;
  labelProps?: LabelProps;
}

// =============================================================================
// SELECT COMPONENT
// =============================================================================

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon: LeftIcon,
      placeholder,
      options = [],
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const chevronSize =
      size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

    return (
      <div className="relative w-full">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <LeftIcon className="h-5 w-5" />
          </div>
        )}

        <select
          ref={ref}
          data-slot="select"
          disabled={disabled}
          className={twMerge(
            selectVariants({ variant, size }),
            LeftIcon && "pl-12",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
          {children}
        </select>

        {/* Chevron icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <ChevronDown className={chevronSize} />
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";

// =============================================================================
// SELECT GROUP COMPONENT
// =============================================================================

const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  (
    {
      className,
      label,
      required,
      helperText,
      error,
      selectProps,
      labelProps,
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();
    const selectId = selectProps?.id || `select-${uniqueId}`;

    return (
      <div
        ref={ref}
        data-slot="select-group"
        className={twMerge(selectGroupVariants({}), className)}
        {...props}
      >
        {label && (
          <Label htmlFor={selectId} required={required} {...labelProps}>
            {label}
          </Label>
        )}

        <Select
          id={selectId}
          variant={error ? "error" : selectProps?.variant}
          {...selectProps}
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
  },
);

SelectGroup.displayName = "SelectGroup";

// =============================================================================
// EXPORTS
// =============================================================================

export { Select, SelectGroup };
export default Select;
