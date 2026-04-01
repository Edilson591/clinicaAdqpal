import { useState, useRef } from "react";

const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string;

interface UseVoiceTranscriptionOptions {
  /** Chamado com o texto transcrito ao terminar */
  onTranscript: (text: string) => void;
}

export function useVoiceTranscription({ onTranscript }: UseVoiceTranscriptionOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setTranscriptionError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setTranscriptionError("Permissão de microfone negada.");
      return;
    }

    const recorder = new MediaRecorder(stream);
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
        form.append("model", "whisper-large-v3-turbo");
        form.append("language", "pt");
        form.append("response_format", "json");

        const res = await fetch(GROQ_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${GROQ_KEY}` },
          body: form,
        });

        if (!res.ok) throw new Error(`Groq ${res.status}`);

        const json = await res.json();
        const transcript: string = json.text?.trim() ?? "";
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
