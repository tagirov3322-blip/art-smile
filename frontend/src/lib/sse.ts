const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const SSE_URL = API_URL.replace(/\/api$/, "") + "/api/events";

let eventSource: EventSource | null = null;
const listeners: Map<string, Set<() => void>> = new Map();

function connect() {
  if (typeof window === "undefined") return;
  if (eventSource) return;

  eventSource = new EventSource(SSE_URL);

  eventSource.onopen = () => {
    console.log("[SSE] connected to", SSE_URL);
  };

  eventSource.onerror = () => {
    console.log("[SSE] error, will reconnect automatically");
  };

  // Слушаем все booking events
  ["new_booking", "booking_updated", "booking_deleted"].forEach((event) => {
    eventSource!.addEventListener(event, () => {
      console.log("[SSE] event:", event);
      const cbs = listeners.get(event);
      if (cbs) cbs.forEach((cb) => cb());
      // Также вызываем wildcard слушатели
      const wildcardCbs = listeners.get("*");
      if (wildcardCbs) wildcardCbs.forEach((cb) => cb());
    });
  });
}

export function onSSE(event: string, callback: () => void): () => void {
  connect();
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)!.add(callback);

  // Return cleanup function
  return () => {
    listeners.get(event)?.delete(callback);
  };
}
