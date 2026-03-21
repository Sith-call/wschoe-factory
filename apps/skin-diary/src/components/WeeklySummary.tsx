import React from 'react';
import type { SkinRecord } from '../types';
import { getRecentDates, getDayName } from '../utils/date';
import { KEYWORD_LABELS } from '../types';
import type { SkinKeyword } from '../types';

interface WeeklySummaryProps {
  records: Record<string, SkinRecord>;
}

const SCORE_COLORS: Record<number, string> = {
  1: '#e8a0a0',
  2: '#e8c4a0',
  3: '#e8dca0',
  4: '#a0d4a0',
  5: '#7ac27a',
};

export function WeeklySummary({ records }: WeeklySummaryProps) {
  const dates = getRecentDates(7);
  const scores: (number | null)[] = dates.map(d => records[d]?.morningLog?.score ?? null);
  const validScores = scores.filter((s): s is number => s !== null);
  const avg = validScores.length > 0
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
    : null;

  // Count keywords
  const keywordCounts: Record<string, number> = {};
  for (const d of dates) {
    const ml = records[d]?.morningLog;
    if (ml) {
      for (const kw of ml.keywords) {
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
      }
    }
  }
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => KEYWORD_LABELS[k as SkinKeyword]);

  if (validScores.length === 0) {
    return (
      <div className="bg-sd-primary-light rounded-2xl p-5">
        <p className="font-heading text-lg text-sd-text">이번 주 피부</p>
        <p className="font-body text-sm text-sd-text-secondary mt-2">
          기록을 시작하면 여기에 추이가 나와요
        </p>
      </div>
    );
  }

  const chartHeight = 100;
  const chartWidth = 280;
  const paddingX = 16;
  const usableWidth = chartWidth - paddingX * 2;
  const stepX = usableWidth / 6;

  const points = scores.map((s, i) => {
    if (s === null) return null;
    const x = paddingX + i * stepX;
    const y = chartHeight - ((s - 1) / 4) * (chartHeight - 20) - 10;
    return { x, y, score: s };
  });

  const pathSegments: string[] = [];
  let started = false;
  for (const p of points) {
    if (p === null) {
      started = false;
      continue;
    }
    if (!started) {
      pathSegments.push(`M ${p.x} ${p.y}`);
      started = true;
    } else {
      pathSegments.push(`L ${p.x} ${p.y}`);
    }
  }

  return (
    <div className="bg-sd-primary-light rounded-2xl p-5">
      <p className="font-heading text-lg text-sd-text mb-3">이번 주 피부</p>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`} className="w-full" aria-label="주간 피부 추이 차트">
        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map(s => {
          const y = chartHeight - ((s - 1) / 4) * (chartHeight - 20) - 10;
          return (
            <g key={s}>
              <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y}
                stroke="#ece4df" strokeWidth="0.5" strokeDasharray="3,3" />
              <text x={2} y={y + 4} fontSize="13" fill="#b5aaaa" fontFamily="'Crimson Pro', serif">{s}</text>
            </g>
          );
        })}

        {/* Line */}
        {pathSegments.length > 0 && (
          <path d={pathSegments.join(' ')} fill="none" stroke="#c2847a" strokeWidth="2" />
        )}

        {/* Points */}
        {points.map((p, i) => p && (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={SCORE_COLORS[p.score]} stroke="white" strokeWidth="1.5" />
        ))}

        {/* Day labels */}
        {dates.map((d, i) => (
          <text
            key={d}
            x={paddingX + i * stepX}
            y={chartHeight + 18}
            textAnchor="middle"
            fontSize="13"
            fill="#8b7e7e"
            fontFamily="'SUIT Variable', sans-serif"
          >
            {getDayName(d)}
          </text>
        ))}
      </svg>

      <div className="flex items-baseline justify-between mt-3">
        <span className="font-body text-sm text-sd-text-secondary">
          이번 주 평균
        </span>
        <span className="font-number text-xl text-sd-text font-semibold">{avg}</span>
      </div>

      {topKeywords.length > 0 && (
        <p className="font-body text-[0.8125rem] text-sd-text-secondary mt-1">
          주요 키워드: {topKeywords.join(', ')}
        </p>
      )}
    </div>
  );
}
