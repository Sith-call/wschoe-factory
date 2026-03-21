import { useState, useCallback } from 'react';
import { DdayEvent, EditPayload } from './types';
import { loadEvents, saveEvents } from './storage';
import { getDdayDiff, sortEvents } from './date-utils';
import AddEventForm from './components/AddEventForm';
import EventList from './components/EventList';
import HeroCard from './components/HeroCard';

export default function App() {
  const [events, setEvents] = useState<DdayEvent[]>(() => loadEvents());

  const handleAdd = useCallback((event: DdayEvent) => {
    setEvents((prev) => {
      const next = [...prev, event];
      saveEvents(next);
      return next;
    });
  }, []);

  const handleEdit = useCallback((payload: EditPayload) => {
    setEvents((prev) => {
      const next = prev.map((e) =>
        e.id === payload.id
          ? { ...e, title: payload.title, date: payload.date, tag: payload.tag }
          : e
      );
      saveEvents(next);
      return next;
    });
  }, []);

  const handleTogglePin = useCallback((id: string) => {
    setEvents((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, pinned: !e.pinned } : e));
      saveEvents(next);
      return next;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveEvents(next);
      return next;
    });
  }, []);

  // Find the nearest upcoming (or today) event for the hero card
  const sorted = sortEvents(events);
  const heroEvent = sorted.find((e) => getDdayDiff(e.date) >= 0) ?? null;

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">D-Day Counter</h1>
          <p className="text-xs text-gray-400 mt-0.5">중요한 날을 기록하세요</p>
        </div>
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {events.length}개
        </span>
      </div>

      {/* Hero: nearest upcoming event */}
      {heroEvent && <HeroCard event={heroEvent} />}

      {/* Add Form */}
      <div className="mb-6">
        <AddEventForm onAdd={handleAdd} />
      </div>

      {/* Event List */}
      <EventList
        events={events}
        onTogglePin={handleTogglePin}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
