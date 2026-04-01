import { forwardRef, useId, type ComponentProps } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Label, type LabelProps } from "./Input";
import { useVoiceTranscription } from "../../hooks/useVoiceTranscription";

// =============================================================================
// TYPES
// =============================================================================

export interface VoiceTextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  labelProps?: LabelProps;
  /** Valor atual do campo — necessário para concatenar o transcript */
  currentValue?: string;
  /** Chamado quando o transcript chega — recebe o valor já concatenado */
  onTranscriptAppend?: (newValue: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const VoiceTextarea = forwardRef<
  HTMLTextAreaElement,
  VoiceTextareaProps
>(
  (
    {
      label,
      required,
      error,
      helperText,
      labelProps,
      currentValue = "",
      onTranscriptAppend,
      className,
      placeholder,
      ...textareaProps
    },
    ref,
  ) => {
    const uid = useId();

    const { isRecording, isTranscribing, transcriptionError, toggleRecording } =
      useVoiceTranscription({
        onTranscript: (text) => {
          const separator = currentValue.trim() ? " " : "";
          onTranscriptAppend?.(currentValue + separator + text);
        },
      });

    const displayError = error || transcriptionError || undefined;

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <Label htmlFor={uid} required={required} {...labelProps}>
            {label}
          </Label>
        )}

        {/* Wrapper relativo para posicionar o botão dentro do textarea */}
        <div className="relative w-full">
          <textarea
            ref={ref}
            id={uid}
            className={twMerge(
              "flex w-full min-h-24",
              "rounded-lg resize-none",
              "border border-border-input",
              "bg-[#F8FAFC] dark:bg-[#263548] dark:border-[#334155]",
              "px-4 py-3 pr-12", // pr-12 reserva espaço para o botão
              "text-base font-normal text-foreground dark:text-[#F1F5F9]",
              "placeholder:text-muted-foreground",
              "transition-all duration-150 ease-in-out",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              displayError && "border-destructive focus:ring-destructive/20",
              className,
            )}
            placeholder={isTranscribing ? "Transcrevendo..." : placeholder}
            {...textareaProps}
          />

          {/* Botão de microfone — canto inferior direito */}
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isTranscribing}
            title={isRecording ? "Parar gravação" : "Gravar áudio"}
            className={twMerge(
              "absolute bottom-3 right-3 cursor-pointer",
              "w-7 h-7 rounded-full flex items-center justify-center",
              "transition-all duration-150",
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-[#E8F5E9] dark:bg-[#1E3A2F] text-[#38A169] hover:bg-[#D1FAE5] dark:hover:bg-[#1E4A30]",
              isTranscribing && "opacity-60 cursor-not-allowed",
            )}
          >
            {isTranscribing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isRecording ? (
              <MicOff size={14} />
            ) : (
              <Mic size={14} />
            )}
          </button>
        </div>

        {(displayError || helperText) && (
          <p
            className={twMerge(
              "text-sm",
              displayError ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {displayError || helperText}
          </p>
        )}
      </div>
    );
  },
);

VoiceTextarea.displayName = "VoiceTextarea";
