import { useState } from 'react';
import { DdayEvent, EditPayload } from '../types';
import { sortEvents, getDdayDiff } from '../date-utils';
import EventCard from './EventCard';

interface EventListProps {
  events: DdayEvent[];
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (payload: EditPayload) => void;
}

export default function EventList({ events, onTogglePin, onDelete, onEdit }: EventListProps) {
  const [pastCollapsed, setPastCollapsed] = useState(false);
  const sorted = sortEvents(events);

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300 mx-auto mb-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <p className="text-sm text-gray-400">아직 등록된 이벤트가 없습니다</p>
        <p className="text-xs text-gray-300 mt-1">위에서 새 이벤트를 추가해보세요</p>
      </div>
    );
  }

  const upcomingEvents = sorted.filter((e) => getDdayDiff(e.date) >= 0);
  const pastEvents = sorted.filter((e) => getDdayDiff(e.date) < 0);

  return (
    <div>
      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}

      {/* Past events */}
      {pastEvents.length > 0 && (
        <div className={upcomingEvents.length > 0 ? 'mt-6' : ''}>
          <button
            onClick={() => setPastCollapsed(!pastCollapsed)}
            className="flex items-center gap-2 w-full text-left mb-3 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-4 h-4 text-gray-400 transition-transform ${pastCollapsed ? '' : 'rotate-90'}`}
            >
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-gray-400 group-hover:text-gray-500 transition-colors">
              지난 이벤트 ({pastEvents.length})
            </span>
          </button>

          {!pastCollapsed && (
            <div className="space-y-2">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onTogglePin={onTogglePin}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
