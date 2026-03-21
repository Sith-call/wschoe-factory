import { HistoryEntry } from '../types';

interface Props {
  entries: HistoryEntry[];
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function HistoryList({ entries }: Props) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">
        최근 결과
      </h2>
      <div className="space-y-1.5">
        {entries.map((entry, i) => (
          <div
            key={`${entry.timestamp}-${i}`}
            className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold">
                {entry.category}
              </span>
              <span className="text-sm text-gray-800 font-semibold">
                {entry.name}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-sora">
              {formatTime(entry.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
