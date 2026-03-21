import React from 'react';

interface InsightCardProps {
  name: string;
  usedLabel: string;
  usedDays: number;
  avgWhenUsed: number;
  avgWhenNotUsed: number;
  impact: number;
  sentenceTemplate?: string;
  verdict?: string;
}

export function InsightCard({
  name,
  usedLabel,
  usedDays,
  avgWhenUsed,
  avgWhenNotUsed,
  impact,
  sentenceTemplate,
  verdict,
}: InsightCardProps) {
  const maxScore = 5;
  const barUsed = (avgWhenUsed / maxScore) * 100;
  const barNotUsed = (avgWhenNotUsed / maxScore) * 100;

  const isPositive = impact > 0.1;
  const isNegative = impact < -0.1;
  const impactColor = isPositive ? '#7ab87a' : isNegative ? '#c27a7a' : '#8b7e7e';
  const impactSymbol = isPositive ? '▲' : isNegative ? '▼' : '—';
  const impactText = isPositive
    ? `+${impact.toFixed(1)}`
    : isNegative
    ? `${impact.toFixed(1)}`
    : '±0';

  return (
    <div className="bg-white border border-sd-border rounded-xl p-4 space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="font-body text-[0.9375rem] text-sd-text font-medium">{name}</span>
        <span className="font-body text-[0.8125rem] text-sd-text-secondary">{usedLabel} {usedDays}회</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-body text-[0.8125rem] text-sd-text-secondary w-16 shrink-0">사용 시</span>
          <div className="flex-1 h-3 bg-sd-primary-light rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${barUsed}%`, backgroundColor: '#c2847a' }}
            />
          </div>
          <span className="font-number text-sm text-sd-text w-8 text-right">{avgWhenUsed.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-body text-[0.8125rem] text-sd-text-secondary w-16 shrink-0">미사용</span>
          <div className="flex-1 h-3 bg-sd-primary-light rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-sd-text-tertiary"
              style={{ width: `${barNotUsed}%` }}
            />
          </div>
          <span className="font-number text-sm text-sd-text w-8 text-right">{avgWhenNotUsed.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span style={{ color: impactColor }} className="font-number text-sm font-medium">
          {impactSymbol} {impactText}
        </span>
      </div>

      {verdict && (
        <p className="font-body text-sm text-sd-text font-medium mt-1">{verdict}</p>
      )}

      {sentenceTemplate && (
        <p className="font-body text-[0.8125rem] text-sd-text-secondary">{sentenceTemplate}</p>
      )}
    </div>
  );
}
