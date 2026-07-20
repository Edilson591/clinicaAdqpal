import { useState, useRef } from "react";
import api from "../services/api";

interface UseVoiceTranscriptionOptions {
  /** Chamado com o texto transcrito ao terminar */
  onTranscript: (text: string) => void;
}

export function useVoiceTranscription({
  onTranscript,
}: UseVoiceTranscriptionOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(
    null,
  );

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setTranscriptionError(null);

    if (!window.isSecureContext) {
      setTranscriptionError(
        "O microfone só pode ser usado em uma conexão segura. Acesse pelo HTTPS ou use localhost durante o desenvolvimento.",
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setTranscriptionError(
        "Este navegador não oferece suporte ao acesso ao microfone.",
      );
      return;
    }

    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);

      if (error instanceof Error || error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            setTranscriptionError(
              "O acesso ao microfone foi bloqueado. Clique no cadeado ao lado do endereço, permita o microfone e verifique a permissão do sistema.",
            );
            break;

          case "NotFoundError":
            setTranscriptionError(
              "Nenhum microfone ativo foi encontrado. Conecte ou habilite um microfone nas configurações de som do sistema.",
            );
            break;

          case "OverconstrainedError":
            setTranscriptionError(
              "Nenhum microfone disponível atende às configurações solicitadas.",
            );
            break;

          case "NotReadableError":
            setTranscriptionError(
              "O microfone está ocupado ou não pôde ser iniciado. Feche outros aplicativos que possam estar usando-o.",
            );
            break;

          case "AbortError":
            setTranscriptionError(
              "O acesso ao microfone foi interrompido. Tente novamente.",
            );
            break;

          case "SecurityError":
            setTranscriptionError(
              "O navegador bloqueou o microfone por uma configuração de segurança.",
            );
            break;

          default:
            setTranscriptionError(
              `Não foi possível acessar o microfone: ${error.message}`,
            );
        }

        return;
      }

      setTranscriptionError("Não foi possível acessar o microfone.");
      return;
    }

    let recorder: MediaRecorder;

    try {
      recorder = new MediaRecorder(stream);
    } catch (error) {
      stream.getTracks().forEach((track) => track.stop());
      console.error("Erro ao iniciar gravação:", error);
      setTranscriptionError(
        "O navegador liberou o microfone, mas não conseguiu iniciar a gravação.",
      );
      return;
    }

    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      // Para todas as tracks do microfone
      stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
      setIsTranscribing(true);

      try {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const form = new FormData();
        form.append("file", blob, "audio.webm");

        const res = await api.post<{
          success: boolean;
          data: { text: string };
        }>("/transcribe", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const transcript: string = res.data.data.text?.trim() ?? "";
        if (transcript) onTranscript(transcript);
      } catch {
        setTranscriptionError("Erro ao transcrever. Tente novamente.");
      } finally {
        setIsTranscribing(false);
      }
    };

    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  function toggleRecording() {
    if (isRecording) stopRecording();
    else startRecording();
  }

  return {
    isRecording,
    isTranscribing,
    transcriptionError,
    toggleRecording,
  };
}
