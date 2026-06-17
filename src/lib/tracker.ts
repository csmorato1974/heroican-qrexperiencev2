import type { QrParams, TrackedEvent } from "@/types/domain";

const EVENTS_KEY = "heroican.events";
const SESSION_KEY = "heroican.sessionId";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uid();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function readEvents(): TrackedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(EVENTS_KEY) ?? "[]") as TrackedEvent[];
  } catch {
    return [];
  }
}

export function track(
  eventName: string,
  qrParams: QrParams,
  metadata?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  const evt: TrackedEvent = {
    id: uid(),
    sessionId: getSessionId(),
    eventName,
    timestamp: new Date().toISOString(),
    qrParams,
    metadata,
  };
  const all = readEvents();
  all.push(evt);
  window.localStorage.setItem(EVENTS_KEY, JSON.stringify(all));
}

export function clearEvents(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(EVENTS_KEY);
}
