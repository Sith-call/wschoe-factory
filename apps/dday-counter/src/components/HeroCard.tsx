import { DdayEvent, TAG_COLORS, TAG_OPTIONS } from '../types';
import { formatDday, formatDate, getDdayDiff } from '../date-utils';

interface HeroCardProps {
  event: DdayEvent;
}

export default function HeroCard({ event }: HeroCardProps) {
  const diff = getDdayDiff(event.date);
  const ddayStr = formatDday(event.date);
  const isToday = diff === 0;
  const tagColors = TAG_COLORS[event.tag];
  const tagLabel = TAG_OPTIONS.find((t) => t.id === event.tag)?.label ?? '';

  return (
    <div className="mb-6 bg-cyan-50 border border-cyan-200 rounded-xl p-5">
      <p className="text-xs font-medium text-cyan-600 mb-2">
        {isToday ? '오늘이에요!' : '다가오는 이벤트'}
      </p>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-4xl font-bold tracking-tight text-cyan-600">
          {ddayStr}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColors.bg} ${tagColors.text}`}>
          {tagLabel}
        </span>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mt-2">{event.title}</h2>
      <p className="text-sm text-gray-500 mt-1">{formatDate(event.date)}</p>
    </div>
  );
}
