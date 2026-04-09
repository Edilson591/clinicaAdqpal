  export function formatTime(time: string) {
    // se vier só HH:mm
    if (time.length === 5) return time;

    // pega só a parte da hora
    const match = time.match(/(\d{2}:\d{2})/);

    return match ? match[1] : "";
  }