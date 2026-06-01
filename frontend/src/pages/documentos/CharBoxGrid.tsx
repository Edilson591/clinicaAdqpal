import { useRef, useCallback } from "react";

interface CharBoxGridProps {
  values: string[];
  onChange: (vals: string[]) => void;
  length: number;
  className?: string;
  boxClassName?: string;
}

export function CharBoxGrid({
  values,
  onChange,
  length,
  className,
  boxClassName = "w-4 h-[17px] border border-black text-[11pt] font-bold text-center outline-none bg-transparent focus:bg-[#fffde7] p-0 shrink-0",
}: CharBoxGridProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (i: number, val: string) => {
      const digit = val.replace(/\D/g, "").slice(0, 1);
      const next = [...values];
      next[i] = digit;
      onChange(next);
      if (digit && i + 1 < length) {
        inputRefs.current[i + 1]?.focus();
      }
    },
    [values, onChange, length],
  );

  const handleKeyDown = useCallback(
    (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !values[i] && i > 0) {
        inputRefs.current[i - 1]?.focus();
      }
    },
    [values],
  );

  return (
    <div className={className}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          maxLength={1}
          value={values[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={boxClassName}
        />
      ))}
    </div>
  );
}
