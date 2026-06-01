import { useRef, useCallback } from "react";

interface DateBoxRowProps {
  values: string[];
  onChange: (vals: string[]) => void;
  length?: number;
}

export function DateBoxRow({
  values,
  onChange,
  length = 6,
}: DateBoxRowProps) {
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
    <div className="flex items-center gap-px flex-1">
      {Array.from({ length }).map((_, i) => (
        <span key={i} className="flex items-center">
          <input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            maxLength={1}
            value={values[i] ?? ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-[15px] h-4 border border-black text-[11pt] font-bold text-center outline-none bg-transparent focus:bg-[#fffde7] p-0"
          />
          {i === 1 && <span className="font-bold text-[11pt] px-px">/</span>}
          {i === 3 && <span className="font-bold text-[11pt] px-px">/</span>}
        </span>
      ))}
    </div>
  );
}
