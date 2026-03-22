import React from 'react';
import type { WeeklyReport } from '../types';
import { KEYWORD_LABELS, VARIABLE_LABELS, type Variable } from '../types';

interface Props {
  report: WeeklyReport;
}

export function WeeklySummary({ report }: Props) {
  const trendIcon = report.scoreTrend === 'up' ? 'trending_up' : report.scoreTrend === 'down' ? 'trending_down' : 'trending_flat';
  const trendColor = report.scoreTrend === 'up' ? 'text-emerald-600' : report.scoreTrend === 'down' ? 'text-error' : 'text-on-surface-variant';
  const trendLabel = report.scoreTrend === 'up' ? '상승' : report.scoreTrend === 'down' ? '하락' : '유지';

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-headline text-sm font-medium text-on-surface">주간 리포트</h3>
        <span className="text-[10px] text-on-surface-variant/60">
          {report.weekStart} ~ {report.weekEnd}
        </span>
      </div>

      {/* Score + trend */}
      <div className="flex items-center gap-4">
        <div className="serif-numbers text-4xl text-primary">{report.avgScore}</div>
        <div className="flex flex-col">
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <span className="material-symbols-outlined text-sm">{trendIcon}</span>
            <span className="text-xs font-bold">{trendLabel}</span>
          </div>
          <span className="text-[10px] text-on-surface-variant">{report.recordDays}일 기록</span>
        </div>
      </div>

      {/* Key findings */}
      <div className="space-y-2">
        {report.topPositiveProduct && (
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              thumb_up
            </span>
            <p className="text-xs text-on-surface-variant">
              <span className="font-semibold text-on-surface">{report.topPositiveProduct}</span>
              을 사용한 날 점수가 높았어요
            </p>
          </div>
        )}
        {report.topNegativeVariable && (
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-on-surface-variant text-sm mt-0.5">
              warning
            </span>
            <p className="text-xs text-on-surface-variant">
              <span className="font-semibold text-on-surface">
                {VARIABLE_LABELS[report.topNegativeVariable as Variable] || report.topNegativeVariable}
              </span>
              이 있는 날 점수가 낮았어요
            </p>
          </div>
        )}
      </div>

      {/* Top keywords */}
      {report.keywordChanges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {report.keywordChanges.slice(0, 3).map(({ keyword, change }) => (
            <span key={keyword} className="px-2.5 py-1 rounded-full bg-surface-container-highest text-[11px] text-on-surface-variant">
              {KEYWORD_LABELS[keyword]} {change}회
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
