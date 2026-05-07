import {
  useState,
  useId,
  useRef,
  useEffect,
  type ComponentProps,
  useMemo,
  useDeferredValue,
} from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Label, type LabelProps } from "./Input";

// =============================================================================
// TYPES
// =============================================================================

export interface SearchableOption {
  value: string;
  label: string;
}

interface SearchableMultiSelectProps {
  options: SearchableOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  onSearchChange?: (query: string) => void;
  maxItems?: number;
}

export interface SearchableMultiSelectGroupProps extends Omit<
  ComponentProps<"div">,
  "onChange"
> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  labelProps?: LabelProps;
  value: string[];
  classNameChildren?: string;
  onChange: (value: string[]) => void;
  options: SearchableOption[];
  placeholder?: string;
  disabled?: boolean;
  onSearchChange?: (query: string) => void;
  maxItems?: number;
}

// =============================================================================
// SEARCHABLE MULTI SELECT
// =============================================================================

export function SearchableMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Selecionar...",
  error,
  disabled,
  className,
  onSearchChange,
  maxItems,
}: SearchableMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
      const q = search.toLowerCase().trim();
      return q
        ? options.filter((o) => o.label.toLowerCase().includes(q))
        : options;
  }, [search, options]);

  const selectedLabels = useMemo(
    () =>
      value
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean),
    [value, options],
  );

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleOpen() {
    if (disabled) return;
    setOpen((v) => !v);
    setSearch("");
    onSearchChange?.("");
  }

  function handleSelect(optValue: string) {
    const isSelected = value.includes(optValue);
    let newValue: string[];

    if (isSelected) {
      newValue = value.filter((v) => v !== optValue);
    } else {
      if (maxItems && value.length >= maxItems) {
        return;
      }
      newValue = [...value, optValue];
    }

    onChange(newValue);
  }

  function handleRemove(optValue: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  }

   const isPending = search !== deferredSearch;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className={twMerge(
          "flex w-full items-center justify-between",
          "min-h-14 rounded-lg border px-4 py-2 cursor-pointer",
          "text-base transition-all duration-150",
          "bg-[#F8FAFC] dark:bg-[#263548]",
          error
            ? "border-destructive focus:ring-destructive/20"
            : "border-border-input dark:border-[#334155]",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <div className="flex-1 flex flex-wrap gap-1.5">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label, index) => (
              <span
                key={value[index]}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-sm rounded-md bg-primary/10 text-primary dark:bg-primary/20"
              >
                {label}
                <X
                  size={14}
                  className="cursor-pointer hover:text-destructive transition-colors"
                  onClick={(e) => handleRemove(value[index], e)}
                />
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-left">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={twMerge(
            "shrink-0 text-muted-foreground ml-2 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border-input dark:border-[#334155] bg-surface dark:bg-[#263548] shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border-input dark:border-[#334155]">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              placeholder="Buscar..."
              className="flex-1 text-sm bg-transparent outline-none text-foreground dark:text-[#F1F5F9] placeholder:text-muted-foreground"
            />
          </div>

          <ul className="max-h-52 overflow-y-auto py-1">
            {isPending && (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                Filtrando...
              </li>
            )}
            {!isPending && filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                Nenhum resultado encontrado
              </li>
            )}
            {!isPending &&
              filtered.map((opt) => {
                const isSelected = value.includes(opt.value);
                const isMaxReached = maxItems
                  ? value.length >= maxItems
                  : false;
                const isDisabled = !isSelected && isMaxReached;

                return (
                  <li
                    key={opt.value}
                    onClick={() => !isDisabled && handleSelect(opt.value)}
                    className={twMerge(
                      "flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors",
                      "hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] dark:text-muted-foreground",
                      isSelected &&
                        "font-semibold text-[#38A169] bg-[#F0FDF4] dark:bg-[#1E3A2F]",
                      isDisabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {opt.label}
                    {isSelected && (
                      <Check size={14} className="text-[#38A169] shrink-0" />
                    )}
                  </li>
                );
              })}
          </ul>

          {maxItems && (
            <div className="px-3 py-2 border-t border-border-input dark:border-[#334155] text-xs text-muted-foreground">
              {value.length} de {maxItems} selecionado{maxItems > 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SEARCHABLE MULTI SELECT GROUP
// =============================================================================

export function SearchableMultiSelectGroup({
  label,
  required,
  error,
  helperText,
  labelProps,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  classNameChildren,
  onSearchChange,
  maxItems,
  className,
  ...props
}: SearchableMultiSelectGroupProps) {
  const id = useId();

  return (
    <div
      className={twMerge("flex flex-col gap-2 w-full", className)}
      {...props}
    >
      {label && (
        <Label htmlFor={id} required={required} {...labelProps}>
          {label}
        </Label>
      )}
      <SearchableMultiSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={!!error}
        className={classNameChildren}
        disabled={disabled}
        onSearchChange={onSearchChange}
        maxItems={maxItems}
      />
      {(error || helperText) && (
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
