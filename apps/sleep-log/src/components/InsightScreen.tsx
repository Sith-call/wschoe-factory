import React from 'react';
import {
  CoffeeIcon, RunIcon, WineIcon, BrainIcon, ForkIcon, PhoneIcon
} from '../icons';
import {
  calculateWeeklyInsight, getSettings, formatDuration, getDayName,
  getMonthRecords, formatDate, calculateBedtimeConsistency,
  getActionableTip, calculateSleepScore, getWeekRecords
} from '../store';
import { Factor } from '../types';

function FactorIcon({ factor, size = 18 }: { factor: Factor; size?: number }) {
  const cls = '';
  switch (factor) {
    case 'caffeine': return <CoffeeIcon size={size} className={cls} />;
    case 'exercise': return <RunIcon size={size} className={cls} />;
    case 'alcohol': return <WineIcon size={size} className={cls} />;
    case 'stress': return <BrainIcon size={size} className={cls} />;
    case 'lateFood': return <ForkIcon size={size} className={cls} />;
    case 'screenTime': return <PhoneIcon size={size} className={cls} />;
    default: return null;
  }
}

function factorLabel(f: Factor): string {
  switch (f) {
    case 'caffeine': return '카페인';
    case 'exercise': return '운동';
    case 'alcohol': return '음주';
    case 'stress': return '스트레스';
    case 'lateFood': return '야식';
    case 'screenTime': return '스크린타임';
    default: return '';
  }
}

export const InsightScreen: React.FC = () => {
  const insight = calculateWeeklyInsight();
  const settings = getSettings();
  const weekRecords = getWeekRecords();
  const monthRecords = getMonthRecords();
  const bedtimeConsistency = calculateBedtimeConsistency(weekRecords);
  const actionableTip = getActionableTip(insight.factorImpact);
  const sleepScore = calculateSleepScore(weekRecords, settings);

  // 4-week trend
  const now = new Date();
  const weeklyAvgs: { label: string; avg: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const records = getMonthRecords().filter(r => {
      return r.date >= formatDate(weekStart) && r.date <= formatDate(weekEnd);
    });

    const avg = records.length > 0
      ? records.reduce((s, r) => s + r.duration, 0) / records.length / 60
      : 0;

    weeklyAvgs.push({ label: `${w === 0 ? '이번 주' : `${w}주 전`}`, avg });
  }

  const nonZeroAvgs = weeklyAvgs.filter(w => w.avg > 0).map(w => w.avg);
  const minAvg = nonZeroAvgs.length > 0 ? Math.min(...nonZeroAvgs) : 0;
  const maxAvg = Math.max(...weeklyAvgs.map(w => w.avg), settings.goalHours + 1);
  // Scale from (minAvg - 1) to maxAvg for more visible differences
  const scaleBase = Math.max(minAvg - 1.5, 0);
  const trendDiff = weeklyAvgs.length >= 2 && weeklyAvgs[weeklyAvgs.length - 1].avg > 0 && weeklyAvgs[weeklyAvgs.length - 2].avg > 0
    ? weeklyAvgs[weeklyAvgs.length - 1].avg - weeklyAvgs[weeklyAvgs.length - 2].avg
    : null;

  return (
    <div className="px-5 pb-8">
      {/* Weekly Report Card */}
      <div className="bg-surface rounded-xl p-5 mt-6 mb-4">
        <h2 className="font-bold text-text-primary mb-4" style={{ fontSize: '16px' }}>이번 주 수면 리포트</h2>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center">
            <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>평균 수면</div>
            <div className="font-dm text-lg font-semibold text-text-primary">
              {insight.avgDuration > 0 ? (insight.avgDuration / 60).toFixed(1) : '-'}시간
            </div>
          </div>
          <div className="text-center">
            <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>평균 질</div>
            <div className="font-dm text-lg font-semibold text-text-primary">
              {insight.avgQuality > 0 ? insight.avgQuality.toFixed(1) : '-'}/5
            </div>
          </div>
          <div className="text-center">
            <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>목표 달성</div>
            <div className="font-dm text-lg font-semibold text-text-primary">
              {insight.goalAchievedDays}/7일
            </div>
          </div>
        </div>

        {insight.bestDay && (
          <div className="text-text-secondary mb-1.5" style={{ fontSize: '15px' }}>
            <span className="text-primary font-semibold">가장 잘 잔 날:</span>{' '}
            {getDayName(insight.bestDay.date)}요일 — {formatDuration(insight.bestDay.duration)}, 질 {insight.bestDay.quality}
          </div>
        )}
        {insight.worstDay && (
          <div className="text-text-secondary" style={{ fontSize: '15px' }}>
            <span className="text-accent font-semibold">가장 못 잔 날:</span>{' '}
            {getDayName(insight.worstDay.date)}요일 — {formatDuration(insight.worstDay.duration)}, 질 {insight.worstDay.quality}
          </div>
        )}

        {!insight.bestDay && !insight.worstDay && (
          <p className="text-text-tertiary" style={{ fontSize: '15px' }}>이번 주 기록이 없습니다</p>
        )}
      </div>

      {/* Bedtime Consistency */}
      {bedtimeConsistency && (
        <div className="bg-surface rounded-xl p-5 mb-4">
          <h2 className="font-bold text-text-primary mb-4" style={{ fontSize: '16px' }}>취침 시간 규칙성</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>평균 취침 시간</div>
              <div className="font-dm text-xl font-semibold text-text-primary">
                {bedtimeConsistency.avgBedtime}
              </div>
            </div>
            <div className="text-right">
              <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>편차</div>
              <div className="font-dm text-xl font-semibold" style={{
                color: bedtimeConsistency.stdDevMinutes <= 30 ? '#0d9488' :
                       bedtimeConsistency.stdDevMinutes <= 60 ? '#f59e0b' : '#ef4444'
              }}>
                {'\u00B1'}{bedtimeConsistency.stdDevMinutes}분
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-text-secondary" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              {bedtimeConsistency.stdDevMinutes <= 30
                ? '취침 시간이 매우 규칙적이에요. 수면 질에 긍정적입니다.'
                : bedtimeConsistency.stdDevMinutes <= 60
                ? '취침 시간 편차가 다소 있어요. 30분 이내로 줄이면 수면 질이 개선돼요.'
                : '취침 시간이 불규칙해요. 일정한 시간에 잠드는 습관이 중요합니다.'}
            </div>
          </div>
        </div>
      )}

      {/* Factor Analysis */}
      <div className="bg-surface rounded-xl p-5 mb-4">
        <h2 className="font-bold text-text-primary mb-4" style={{ fontSize: '16px' }}>수면에 영향을 주는 요인</h2>

        {insight.factorImpact.length > 0 ? (
          <div className="space-y-3">
            {insight.factorImpact.map(fi => {
              const isPositive = fi.qualityDiff > 0;
              const barWidth = Math.min(Math.abs(fi.qualityDiff) * 30, 100);

              return (
                <div key={fi.factor} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <span className={isPositive ? 'text-primary' : 'text-accent'}>
                      <FactorIcon factor={fi.factor} />
                    </span>
                    <span className="text-text-secondary" style={{ fontSize: '14px' }}>{factorLabel(fi.factor)}</span>
                  </div>

                  <div className="flex-1 flex items-center gap-2">
                    <div
                      className="h-3.5 rounded-sm"
                      style={{
                        width: `${barWidth}%`,
                        minWidth: '8px',
                        backgroundColor: isPositive ? '#0d9488' : '#ef4444'
                      }}
                    />
                    <span className="font-dm font-semibold whitespace-nowrap"
                      style={{ color: isPositive ? '#0d9488' : '#ef4444', fontSize: '14px' }}
                    >
                      {isPositive ? '+' : ''}{fi.qualityDiff.toFixed(1)}점
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-text-tertiary" style={{ fontSize: '15px' }}>데이터가 충분하지 않습니다 (요인별 3회 이상 기록 필요)</p>
        )}
      </div>

      {/* Actionable Tip */}
      {actionableTip && (
        <div className="rounded-xl p-5 mb-4 border-l-4 border-primary" style={{ backgroundColor: '#f0fdfa' }}>
          <h2 className="font-bold text-primary mb-2" style={{ fontSize: '15px' }}>개선 제안</h2>
          <p className="text-text-primary" style={{ fontSize: '15px', lineHeight: '1.6' }}>{actionableTip}</p>
        </div>
      )}

      {/* 4-Week Trend */}
      <div className="bg-surface rounded-xl p-5">
        <h2 className="font-bold text-text-primary mb-4" style={{ fontSize: '16px' }}>4주간 수면 추이</h2>

        <div className="flex items-end justify-between gap-3" style={{ height: '120px' }}>
          {weeklyAvgs.map((w, i) => {
            const pct = maxAvg > scaleBase ? ((w.avg - scaleBase) / (maxAvg - scaleBase)) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="font-dm text-text-secondary" style={{ fontSize: '13px' }}>
                  {w.avg > 0 ? w.avg.toFixed(1) : '-'}
                </span>
                <div className="w-full" style={{ height: '80px' }}>
                  <div className="relative w-full h-full">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-md"
                      style={{ height: `${pct}%`, minHeight: w.avg > 0 ? '4px' : '0' }}
                    />
                  </div>
                </div>
                <span className="text-text-tertiary text-center" style={{ fontSize: '13px' }}>{w.label}</span>
              </div>
            );
          })}
        </div>

        {trendDiff !== null && (
          <div className="text-text-secondary mt-4 text-center" style={{ fontSize: '15px' }}>
            지난주 대비{' '}
            <span className={trendDiff >= 0 ? 'text-primary font-semibold' : 'text-accent font-semibold'}>
              {trendDiff >= 0 ? '+' : ''}{trendDiff.toFixed(1)}시간
            </span>
            {trendDiff >= 0 ? ' 증가' : ' 감소'}
          </div>
        )}
      </div>
    </div>
  );
};
