export function formatTime(time: string) {
  if (time.length === 5) return time;

  const match = time.match(/(\d{2}:\d{2})/);
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(time);

  if (!hasTimezone) return match ? match[1] : "";

  const date = new Date(time);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  }

  return match ? match[1] : "";
}
