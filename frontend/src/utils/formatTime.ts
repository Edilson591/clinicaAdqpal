export function formatTime(time: string) {
  if (time.length === 5) return time;

  const match = time.match(/(\d{2}:\d{2})/);
  return match ? match[1] : "";
}
