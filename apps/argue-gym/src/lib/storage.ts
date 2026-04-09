import type { Session } from "./types";

const KEY = "argue-gym:sessions:v1";

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Session[];
  } catch {
    return [];
  }
}

export function saveSession(session: Session): void {
  const all = loadSessions().filter((s) => s.id !== session.id);
  all.unshift(session);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 50)));
}

export function newSessionId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
