import { DdayEvent } from './types';

const STORAGE_KEY = 'dday-counter-events';

export function loadEvents(): DdayEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DdayEvent[];
  } catch {
    return [];
  }
}

export function saveEvents(events: DdayEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function addEvent(event: DdayEvent): DdayEvent[] {
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
  return events;
}

export function deleteEvent(id: string): DdayEvent[] {
  const events = loadEvents().filter((e) => e.id !== id);
  saveEvents(events);
  return events;
}

export function togglePin(id: string): DdayEvent[] {
  const events = loadEvents().map((e) =>
    e.id === id ? { ...e, pinned: !e.pinned } : e
  );
  saveEvents(events);
  return events;
}
