import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { APPOINTMENT_KEYS } from "./useAppointments";
import { getCookie } from "../store/authSlice";

/**
 * Conecta ao endpoint SSE do backend e invalida o cache do React Query
 * sempre que um agendamento for criado, atualizado ou deletado.
 *
 * Use este hook em qualquer página que exiba a agenda em tempo real.
 */
export function useAppointmentSSE(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getCookie("adqpal_token");
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL as string;
    const es = new EventSource(
      `${apiUrl}/appointments/events?token=${encodeURIComponent(token)}`,
    );

    const invalidateAll = () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.all });
    };

    es.addEventListener("appointment_created", invalidateAll);
    es.addEventListener("appointment_updated", invalidateAll);
    es.addEventListener("appointment_deleted", invalidateAll);

    es.onerror = () => {
      // EventSource faz reconnect automático — não precisamos fazer nada
    };

    return () => {
      es.close();
    };
  }, [queryClient]);
}
