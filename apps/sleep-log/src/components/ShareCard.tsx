import React from 'react';
import { getRecordsByMonth, formatDate } from '../store';

interface Props {
  onClose: () => void;
}

const qualityColor: Record<number, string> = {
  1: '#e0f2fe',
  2: '#bae6fd',
  3: '#7dd3fc',
  4: '#38bdf8',
  5: '#0d9488',
};

export const ShareCard: React.FC<Props> = ({ onClose }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const records = getRecordsByMonth(year, month);

  const avgDuration = records.length > 0
    ? (records.reduce((s, r) => s + r.duration, 0) / records.length / 60).toFixed(1)
    : '-';
  const avgQuality = records.length > 0
    ? (records.reduce((s, r) => s + r.quality, 0) / records.length).toFixed(1)
    : '-';

  // Mini calendar heatmap
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDow = firstDay.getDay();
  const recordMap = new Map(records.map(r => [r.date, r]));

  const dots: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) dots.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const rec = recordMap.get(dateStr);
    dots.push(rec ? qualityColor[rec.quality] : '#e5e7eb');
  }

  const handleCopy = () => {
    const text = `${month}월 수면 리포트\n평균 수면: ${avgDuration}시간\n평균 질: ${avgQuality}/5\n기록일: ${records.length}/${daysInMonth}일\n\n- 수면 일지`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-xl p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-text-primary mb-4 text-center">{month}월 수면 리포트</h3>

        <div className="flex justify-center gap-8 mb-5">
          <div className="text-center">
            <div className="text-xs text-text-tertiary mb-1">평균 수면</div>
            <div className="font-dm text-xl font-bold text-text-primary">{avgDuration}h</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-text-tertiary mb-1">평균 질</div>
            <div className="font-dm text-xl font-bold text-text-primary">{avgQuality}/5</div>
          </div>
        </div>

        {/* Mini heatmap */}
        <div className="grid grid-cols-7 gap-1.5 mb-5 px-4">
          {dots.map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full mx-auto"
              style={{ backgroundColor: color || 'transparent' }}
            />
          ))}
        </div>

        <div className="text-center text-xs text-text-tertiary mb-5">수면 일지</div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
            style={{ minHeight: '44px' }}
          >
            닫기
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold"
            style={{ minHeight: '44px' }}
          >
            복사하기
          </button>
        </div>
      </div>
    </div>
  );
};
