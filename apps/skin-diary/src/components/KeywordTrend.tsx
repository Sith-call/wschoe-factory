import React from 'react';
import type { KeywordTrend as KeywordTrendType } from '../types';
import { KEYWORD_LABELS } from '../types';

interface Props {
  trends: KeywordTrendType[];
}

export function KeywordTrend({ trends }: Props) {
  if (trends.length === 0) return null;

  const maxCount = Math.max(...trends.map(t => t.currentCount), 1);

  return (
    <div className="space-y-6">
      {trends.map(trend => (
        <div key={trend.keyword} className="space-y-2">
          <div className="flex justify-between text-xs font-body">
            <span className="text-on-surface">
              {KEYWORD_LABELS[trend.keyword] || trend.keyword}
            </span>
            <span className="text-on-surface-variant">
              {trend.currentCount}회
              {trend.changePercent !== 0 && (
                <span
                  className={`font-bold serif-numbers ml-1 ${
                    trend.changePercent < 0 ? 'text-emerald-600' : 'text-primary'
                  }`}
                >
                  {trend.changePercent > 0 ? '↑' : '↓'} {Math.abs(trend.changePercent)}%
                </span>
              )}
            </span>
          </div>
          <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                trend.currentCount > trend.previousCount
                  ? 'bg-primary'
                  : 'bg-primary/40'
              }`}
              style={{ width: `${(trend.currentCount / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
