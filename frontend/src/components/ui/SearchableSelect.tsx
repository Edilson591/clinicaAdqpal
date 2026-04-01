import {
  useState,
  useTransition,
  useId,
  useRef,
  useEffect,
  type ComponentProps,
} from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Label, type LabelProps } from "./Input";

// =============================================================================
// TYPES
// =============================================================================

export interface SearchableOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

export interface SearchableSelectGroupProps extends Omit<ComponentProps<"div">, "onChange"> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  labelProps?: LabelProps;
  value: string;
  onChange: (value: string) => void;
  options: SearchableOption[];
  placeholder?: string;
  disabled?: boolean;
}

// =============================================================================
// SEARCHABLE SELECT
// =============================================================================

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selecionar...",
  error,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<SearchableOption[]>(options);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  // Filtra com useTransition para não bloquear a UI
  useEffect(() => {
    startTransition(() => {
      const q = search.toLowerCase().trim();
      setFiltered(
        q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options,
      );
    });
  }, [search, options]);

  // Fecha ao clicar fora
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
  }

  function handleSelect(optValue: string) {
    onChange(optValue);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full ">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className={twMerge(
          "flex w-full items-center justify-between",
          "h-14 rounded-lg border px-4",
          "text-base transition-all duration-150",
          " bg-[#F8FAFC] dark:bg-[#263548]",
          error
            ? "border-destructive focus:ring-destructive/20"
            : "border-border-input dark:border-[#334155]",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          !value && "text-muted-foreground",
          value && "text-foreground dark:text-[#F1F5F9]",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <span className="truncate">{value ? selectedLabel : placeholder}</span>
        <ChevronDown
          size={18}
          className={twMerge(
            "shrink-0 text-muted-foreground ml-2 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border-input dark:border-[#334155] bg-surface dark:bg-[#263548] shadow-lg overflow-hidden">
          {/* Input de busca */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border-input dark:border-[#334155]">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="flex-1 text-sm bg-transparent outline-none text-foreground dark:text-[#F1F5F9] placeholder:text-muted-foreground"
            />
          </div>

          {/* Lista de opções */}
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
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={twMerge(
                    "flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors",
                    "hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] dark:text-muted-foreground",
                    opt.value === value &&
                      "font-semibold text-[#38A169] bg-[#F0FDF4] dark:bg-[#1E3A2F]",
                  )}
                >
                  {opt.label}
                  {opt.value === value && (
                    <Check size={14} className="text-[#38A169] shrink-0" />
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SEARCHABLE SELECT GROUP (Label + Select + Error)
// =============================================================================

export function SearchableSelectGroup({
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
  className,
  ...props
}: SearchableSelectGroupProps) {
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
      <SearchableSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={!!error}
        disabled={disabled}
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
