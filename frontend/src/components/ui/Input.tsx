import { tv, type VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import {
  useState,
  useId,
  forwardRef,
  type ComponentProps,
  type ReactNode,
} from "react";

// =============================================================================
// INPUT VARIANTS
// =============================================================================

const inputVariants = tv({
  base: [
    // Base styles - matching design spec
    "flex w-full items-center",
    "h-14 min-h-[56px]", // 56px height
    "rounded-lg", // 8px border radius
    "border border-border-input", // Border from design system
    "bg-surface px-4", // Background white, 16px padding
    "text-base font-normal text-foreground",
    "transition-all duration-150 ease-in-out bg-[#F8FAFC]",

    "invalid:text-muted-foreground",
    "focus:invalid:text-foreground",
    // Placeholder styling
    "placeholder:text-muted-foreground",
    "dark:bg-[#263548] border-red-400 dark:border-red-500",
    // Focus states
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
    // Disabled states
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
    // File input styling
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "dark:text-muted-foreground"
  ],
  variants: {
    variant: {
      default: "",
      // Error state
      error: [
        "border-destructive",
        "focus:ring-destructive/20",
        "placeholder:text-destructive/60",
        "invalid:text-destructive/60",
      ],
    },
    // Size variants
    size: {
      default: "h-14 px-4",
      sm: "h-10 px-3 text-sm",
      lg: "h-16 px-5 text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// =============================================================================
// TEXTAREA VARIANTS
// =============================================================================

const textareaVariants = tv({
  base: [
    "flex w-full",
    "min-h-[112px]",
    "rounded-lg",
    "resize-none",
    "border border-border-input",
    "bg-surface px-4 py-3",
    "text-base font-normal text-foreground",
    "transition-all duration-150 ease-in-out",
    "placeholder:text-muted-foreground",
    "dark:bg-[#263548] dark:border-[#334155] dark:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
  ],
  variants: {
    variant: {
      default: "",
      error: [
        "border-destructive",
        "focus:ring-destructive/20",
        "placeholder:text-destructive/60",
      ],
    },
    size: {
      default: "min-h-[112px]",
      sm: "min-h-[80px] px-3 py-2 text-sm",
      lg: "min-h-[160px] px-5 py-4 text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// =============================================================================
// LABEL VARIANTS
// =============================================================================

const labelVariants = tv({
  base: [
    // Text styling from design spec
    "text-sm font-semibold",
    "dark:text-[#94A3B8]",
    "text-primary-dark", // #2D3748
    "leading-5",
  ],
});

// =============================================================================
// INPUT GROUP VARIANTS
// =============================================================================

const inputGroupVariants = tv({
  base: [
    // Vertical layout with 8px gap
    "flex flex-col gap-2",
    "w-full",
  ],
});

// =============================================================================
// TYPES
// =============================================================================

export interface InputProps
  extends
    Omit<ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Icon to display on the right side of the input */
  rightIcon?: LucideIcon;
  /** Icon to display on the left side of the input */
  leftIcon?: LucideIcon;
  /** Custom content to display on the right side (replaces icon) */
  rightElement?: ReactNode;
}

export interface TextareaProps
  extends Omit<ComponentProps<"textarea">, "size">,
    VariantProps<typeof textareaVariants> {}

export interface LabelProps extends ComponentProps<"label"> {
  /** Whether the associated input is required */
  required?: boolean;
  /** Optional info/help text */
  info?: string;
}

export interface InputGroupProps extends ComponentProps<"div"> {
  /** Label text */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Input props */
  inputProps?: InputProps;
  /** Label props */
  labelProps?: LabelProps;
  /** Quando true, renderiza um <textarea> no lugar do <input> */
  textarea?: boolean;
  /** Props do textarea (usado quando textarea=true) */
  textareaProps?: TextareaProps;
}

// =============================================================================
// INPUT COMPONENT
// =============================================================================

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      size,
      rightIcon: RightIcon,
      leftIcon: LeftIcon,
      rightElement,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative w-full">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <LeftIcon className="h-5 w-5" />
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          data-slot="input"
          disabled={disabled}
          className={twMerge(
            inputVariants({ variant, size }),
            // Add padding for icons
            LeftIcon && "pl-12",
            (RightIcon || rightElement || isPassword) && "pr-12",
            className,
          )}
          {...props}
        />

        {/* Right Element / Icon / Password Toggle */}
        {(RightIcon || rightElement || isPassword) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {rightElement}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
            {RightIcon && !isPassword && (
              <RightIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// =============================================================================
// TEXTAREA COMPONENT
// =============================================================================

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={twMerge(textareaVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

// =============================================================================
// LABEL COMPONENT
// =============================================================================

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, info, ...props }, ref) => {
    const id = useId();

    return (
      <label
        ref={ref}
        htmlFor={props.htmlFor || id}
        data-slot="label"
        className={twMerge(labelVariants({}), className)}
        {...props}
      >
        {children}
        {required && (
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
        )}
        {info && (
          <span
            className="ml-1 text-muted-foreground cursor-help"
            title={info}
            aria-label={info}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = "Label";

// =============================================================================
// INPUT GROUP COMPONENT
// =============================================================================

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  (
    {
      className,
      label,
      required,
      helperText,
      error,
      inputProps,
      labelProps,
      textarea,
      textareaProps,
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();
    const fieldId =
      (textarea ? textareaProps?.id : inputProps?.id) || `input-${uniqueId}`;

    return (
      <div
        ref={ref}
        data-slot="input-group"
        className={twMerge(inputGroupVariants({}), className)}
        {...props}
      >
        {/* Label */}
        {label && (
          <Label htmlFor={fieldId} required={required} {...labelProps}>
            {label}
          </Label>
        )}

        {/* Textarea ou Input */}
        {textarea ? (
          <Textarea
            id={fieldId}
            variant={error ? "error" : textareaProps?.variant}
            {...textareaProps}
          />
        ) : (
          <Input
            id={fieldId}
            variant={error ? "error" : inputProps?.variant}
            {...inputProps}
          />
        )}

        {/* Helper Text / Error Message */}
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

InputGroup.displayName = "InputGroup";

// =============================================================================
// EXPORTS
// =============================================================================

export { Input, Textarea, Label, InputGroup };
export default Input;
