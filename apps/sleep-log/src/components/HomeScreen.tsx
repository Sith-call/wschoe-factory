import React from 'react';
import {
  FlameIcon, MoonIcon, SunIcon, StarIcon, FullMoonIcon, HalfMoonIcon,
  CloudMoonIcon, BrokenMoonIcon, CheckIcon,
  CoffeeIcon, RunIcon, WineIcon, BrainIcon, ForkIcon, PhoneIcon
} from '../icons';
import {
  getRecord, getWeekRecords, getStreak, getSettings,
  formatDuration, formatDate, getQualityLabel, getFactorLabel,
  calculateWeeklyInsight, calculateSleepScore, getPreviousWeekRecords,
  getWeekdayWeekendAvg, saveRecord, calculateDuration
} from '../store';
import { SleepRecord, Factor } from '../types';

interface Props {
  onLog: () => void;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return '좋은 아침이에요';
  if (h >= 12 && h < 18) return '좋은 오후예요';
  return '편안한 밤 되세요';
}

function QualityIcon({ quality, size = 20 }: { quality: number; size?: number }) {
  const cls = 'text-primary';
  switch (quality) {
    case 1: return <BrokenMoonIcon size={size} className={cls} />;
    case 2: return <CloudMoonIcon size={size} className={cls} />;
    case 3: return <HalfMoonIcon size={size} className={cls} />;
    case 4: return <FullMoonIcon size={size} className={cls} />;
    case 5: return <StarIcon size={size} className={cls} />;
    default: return null;
  }
}

function FactorMiniIcon({ factor, size = 12 }: { factor: Factor; size?: number }) {
  switch (factor) {
    case 'caffeine': return <CoffeeIcon size={size} />;
    case 'exercise': return <RunIcon size={size} />;
    case 'alcohol': return <WineIcon size={size} />;
    case 'stress': return <BrainIcon size={size} />;
    case 'lateFood': return <ForkIcon size={size} />;
    case 'screenTime': return <PhoneIcon size={size} />;
    default: return null;
  }
}

/* ===== Goal Achievement Ring (SVG circular progress) ===== */
function GoalRing({ achieved, total }: { achieved: number; total: number }) {
  const size = 72;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? achieved / total : 0;
  const offset = circumference * (1 - pct);

  const color = pct >= 0.7 ? '#0d9488' : pct >= 0.4 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-dm text-lg font-bold" style={{ color }}>{achieved}</span>
          <span className="text-text-tertiary" style={{ fontSize: '13px' }}>/{total}</span>
        </div>
      </div>
      <div className="text-text-tertiary mt-1" style={{ fontSize: '13px' }}>목표 달성</div>
    </div>
  );
}

/* ===== Goal comparison with color coding ===== */
function GoalStatus({ durationHours, goalHours }: { durationHours: number; goalHours: number }) {
  const diff = durationHours - goalHours;
  const absDiff = Math.abs(diff).toFixed(1);

  let color: string;
  let label: string;
  let showCheck = false;

  if (diff >= 0) {
    color = '#0d9488';
    label = `+${absDiff}시간 달성`;
    showCheck = true;
  } else if (diff >= -1) {
    color = '#f59e0b';
    label = `${absDiff}시간 부족`;
  } else {
    color = '#ef4444';
    label = `${absDiff}시간 부족`;
  }

  return (
    <div className="flex items-center gap-1.5">
      {showCheck && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      <span className="font-semibold" style={{ color, fontSize: '15px' }}>
        목표 대비 {label}
      </span>
    </div>
  );
}

/* ===== Encouraging message when goal achieved ===== */
function GoalMessage({ durationHours, goalHours }: { durationHours: number; goalHours: number }) {
  if (durationHours < goalHours) return null;

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg mt-3"
      style={{ backgroundColor: '#ccfbf1', border: '1px solid #99f6e4' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <span className="font-semibold" style={{ color: '#0d9488', fontSize: '15px' }}>
        목표 달성! 오늘도 잘 했어요
      </span>
    </div>
  );
}

/* ===== "한눈에 보기" — #1 positive and #1 negative factor on home ===== */
function AtAGlanceCard({ factorImpact }: { factorImpact: { factor: Factor; qualityDiff: number }[] }) {
  if (factorImpact.length === 0) return null;

  const negative = factorImpact.find(f => f.qualityDiff < 0);
  const positive = [...factorImpact].reverse().find(f => f.qualityDiff > 0);

  if (!negative && !positive) return null;

  return (
    <div className="bg-surface rounded-xl p-5 mb-4">
      <h3 className="font-semibold text-text-primary mb-3" style={{ fontSize: '15px' }}>한눈에 보기</h3>

      {negative && (
        <div className="flex items-center gap-3 mb-2.5 p-3 rounded-lg" style={{ backgroundColor: '#fef2f2' }}>
          <span className="text-red-500 shrink-0">
            <FactorMiniIcon factor={negative.factor} size={20} />
          </span>
          <div>
            <div className="font-semibold" style={{ fontSize: '15px', color: '#991b1b' }}>
              {getFactorLabel(negative.factor)}이 수면을 방해해요
            </div>
            <div style={{ fontSize: '13px', color: '#ef4444' }}>
              수면 질 {negative.qualityDiff.toFixed(1)}점 영향
            </div>
          </div>
        </div>
      )}

      {positive && (
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f0fdfa' }}>
          <span className="text-primary shrink-0">
            <FactorMiniIcon factor={positive.factor} size={20} />
          </span>
          <div>
            <div className="font-semibold text-primary-dark" style={{ fontSize: '15px' }}>
              {getFactorLabel(positive.factor)}이 수면에 도움돼요
            </div>
            <div className="text-primary" style={{ fontSize: '13px' }}>
              수면 질 +{positive.qualityDiff.toFixed(1)}점 영향
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WeeklyChart() {
  const settings = getSettings();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const maxHours = 12;

  const weekData: { label: string; record: SleepRecord | null; dateStr: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatDate(d);
    const record = getRecord(dateStr);
    weekData.push({ label: days[i], record, dateStr });
  }

  const goalPct = (settings.goalHours / maxHours) * 100;

  const qualityColor = (q: number) => {
    switch (q) {
      case 1: return '#fca5a5';
      case 2: return '#fdba74';
      case 3: return '#93c5fd';
      case 4: return '#5eead4';
      case 5: return '#0d9488';
      default: return '#e5e7eb';
    }
  };

  return (
    <div className="bg-surface rounded-xl p-5">
      <h3 className="font-semibold text-text-primary mb-4" style={{ fontSize: '15px' }}>이번 주 수면</h3>

      <div className="relative">
        <div
          className="absolute left-0 right-0 border-t border-dashed border-text-tertiary z-10"
          style={{ bottom: `${goalPct}%` }}
        >
          <span className="absolute -top-3 -left-0 text-text-tertiary font-dm" style={{ fontSize: '13px' }}>
            {settings.goalHours}h
          </span>
        </div>

        <div className="flex items-end justify-between gap-2" style={{ height: '180px' }}>
          {weekData.map((d, i) => {
            const hours = d.record ? d.record.duration / 60 : 0;
            const pct = Math.min((hours / maxHours) * 100, 100);
            const color = d.record ? qualityColor(d.record.quality) : '#e5e7eb';
            const isToday = d.dateStr === formatDate(today);
            const factors = d.record ? d.record.factors.filter(f => f !== 'none') : [];

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {/* Factor icons above bar */}
                <div className="flex flex-col items-center gap-0.5" style={{ minHeight: '18px' }}>
                  {factors.slice(0, 2).map(f => (
                    <span key={f} className={
                      f === 'alcohol' || f === 'caffeine' || f === 'stress'
                        ? 'text-red-400' : 'text-primary'
                    }>
                      <FactorMiniIcon factor={f} size={11} />
                    </span>
                  ))}
                </div>
                <div className="w-full relative" style={{ height: '120px' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-md transition-all"
                    style={{ height: `${pct}%`, backgroundColor: color, minHeight: hours > 0 ? '4px' : '0' }}
                  />
                </div>
                <span className="font-dm text-text-tertiary" style={{ fontSize: '13px' }}>
                  {hours > 0 ? hours.toFixed(1) : '-'}
                </span>
                <span className={`${isToday ? 'font-bold text-primary' : 'text-text-tertiary'}`} style={{ fontSize: '13px' }}>
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===== Weekday vs Weekend comparison ===== */
function WeekdayWeekendCompare() {
  const { weekdayAvg, weekendAvg, weekdayCount, weekendCount } = getWeekdayWeekendAvg();

  if (weekdayCount === 0 && weekendCount === 0) return null;

  const weekdayHours = weekdayAvg / 60;
  const weekendHours = weekendAvg / 60;
  const diff = weekendHours - weekdayHours;
  const maxBar = Math.max(weekdayHours, weekendHours, 1);

  let balanceLabel: string;
  let balanceColor: string;
  if (Math.abs(diff) <= 1) {
    balanceLabel = '균형 잡힌 수면 패턴이에요';
    balanceColor = '#0d9488';
  } else if (diff > 1) {
    balanceLabel = '주말에 몰아 자고 있어요. 주중 수면을 늘려보세요';
    balanceColor = '#f59e0b';
  } else {
    balanceLabel = '주중에 더 자고 있어요. 주말에도 일정한 수면을 유지하세요';
    balanceColor = '#f59e0b';
  }

  return (
    <div className="bg-surface rounded-xl p-5 mt-4">
      <h3 className="font-semibold text-text-primary mb-4" style={{ fontSize: '15px' }}>주중 vs 주말 비교</h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-text-secondary w-8 shrink-0" style={{ fontSize: '14px' }}>주중</span>
          <div className="flex-1 h-7 rounded-md overflow-hidden" style={{ backgroundColor: '#f0fdfa' }}>
            <div
              className="h-full rounded-md flex items-center justify-end pr-2"
              style={{
                width: `${weekdayCount > 0 ? (weekdayHours / maxBar) * 100 : 0}%`,
                backgroundColor: '#99f6e4',
                minWidth: weekdayCount > 0 ? '40px' : '0',
              }}
            >
              <span className="font-dm font-semibold text-primary-dark" style={{ fontSize: '13px' }}>
                {weekdayCount > 0 ? weekdayHours.toFixed(1) : '-'}시간
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-text-secondary w-8 shrink-0" style={{ fontSize: '14px' }}>주말</span>
          <div className="flex-1 h-7 rounded-md overflow-hidden" style={{ backgroundColor: '#f0fdfa' }}>
            <div
              className="h-full rounded-md flex items-center justify-end pr-2"
              style={{
                width: `${weekendCount > 0 ? (weekendHours / maxBar) * 100 : 0}%`,
                backgroundColor: '#5eead4',
                minWidth: weekendCount > 0 ? '40px' : '0',
              }}
            >
              <span className="font-dm font-semibold text-primary-dark" style={{ fontSize: '13px' }}>
                {weekendCount > 0 ? weekendHours.toFixed(1) : '-'}시간
              </span>
            </div>
          </div>
        </div>
      </div>

      {weekdayCount > 0 && weekendCount > 0 && (
        <div className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={balanceColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span style={{ color: balanceColor, fontSize: '14px' }}>{balanceLabel}</span>
        </div>
      )}
    </div>
  );
}

export const HomeScreen: React.FC<Props> = ({ onLog }) => {
  const todayStr = formatDate(new Date());
  const todayRecord = getRecord(todayStr);
  const streak = getStreak();
  const settings = getSettings();
  const insight = calculateWeeklyInsight();

  /* ===== Quick Log handler ===== */
  const handleQuickLog = () => {
    const record: SleepRecord = {
      date: todayStr,
      bedtime: settings.typicalBedtime,
      wakeTime: settings.typicalWakeTime,
      duration: calculateDuration(settings.typicalBedtime, settings.typicalWakeTime),
      quality: 3,
      factors: ['none'],
      createdAt: new Date().toISOString(),
    };
    saveRecord(record);
    window.location.reload();
  };

  return (
    <div className="px-5 pb-8">
      {/* Greeting */}
      <div className="pt-6 pb-4">
        <h1 className="text-xl font-bold text-text-primary">{getGreeting()}</h1>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <FlameIcon size={16} className="text-accent" />
            <span className="text-text-secondary" style={{ fontSize: '15px' }}>{streak}일 연속 기록</span>
          </div>
        )}
      </div>

      {/* "한눈에 보기" — cause-effect summary at a glance */}
      <AtAGlanceCard factorImpact={insight.factorImpact} />

      {/* Today card */}
      <div className="bg-surface rounded-xl p-5 mb-4">
        {todayRecord ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-tertiary" style={{ fontSize: '15px' }}>오늘의 수면</span>
              <div className="flex items-center gap-1.5">
                <QualityIcon quality={todayRecord.quality} size={18} />
                <span className="text-text-secondary" style={{ fontSize: '15px' }}>{getQualityLabel(todayRecord.quality)}</span>
              </div>
            </div>

            <div className="font-dm text-3xl font-bold text-text-primary mb-3" style={{ fontSize: '32px' }}>
              {formatDuration(todayRecord.duration)}
            </div>

            {todayRecord.factors.length > 0 && todayRecord.factors[0] !== 'none' && (
              <div className="flex flex-wrap gap-2 mb-3">
                {todayRecord.factors.filter(f => f !== 'none').map(f => (
                  <span key={f} className="bg-primary-light text-primary-dark px-3 py-1 rounded-full" style={{ fontSize: '13px' }}>
                    {getFactorLabel(f)}
                  </span>
                ))}
              </div>
            )}

            {/* Color-coded goal comparison */}
            <div className="flex items-center justify-between">
              <GoalStatus durationHours={todayRecord.duration / 60} goalHours={settings.goalHours} />
              <button
                onClick={onLog}
                className="text-primary font-medium px-3 py-1.5 rounded-lg border border-primary"
                style={{ minHeight: '36px', fontSize: '14px' }}
              >
                수정하기
              </button>
            </div>

            {/* Encouraging message */}
            <GoalMessage durationHours={todayRecord.duration / 60} goalHours={settings.goalHours} />
          </>
        ) : (
          <div className="py-4">
            <div className="text-center mb-4">
              <MoonIcon size={32} className="text-text-tertiary mx-auto mb-3" />
              <p className="text-text-secondary" style={{ fontSize: '15px' }}>오늘의 수면을 기록해주세요</p>
            </div>

            {/* Quick Log + Detailed Log buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleQuickLog}
                className="flex-1 py-3 rounded-lg font-bold border-2 border-primary text-primary"
                style={{ minHeight: '48px', fontSize: '15px' }}
              >
                빠른 기록
                <span className="block font-normal text-text-tertiary mt-0.5" style={{ fontSize: '13px' }}>
                  {settings.typicalBedtime} ~ {settings.typicalWakeTime}
                </span>
              </button>
              <button
                onClick={onLog}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-bold"
                style={{ minHeight: '48px', fontSize: '15px' }}
              >
                상세 기록
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Weekly chart with factor icons */}
      <WeeklyChart />

      {/* Weekday vs Weekend comparison */}
      <WeekdayWeekendCompare />

      {/* Weekly summary with Goal Ring */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-surface rounded-xl p-4 text-center">
          <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>평균 수면</div>
          <div className="font-dm text-lg font-semibold text-text-primary">
            {insight.avgDuration > 0 ? (insight.avgDuration / 60).toFixed(1) : '-'}
            <span className="text-text-tertiary ml-0.5" style={{ fontSize: '13px' }}>시간</span>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center">
          <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>평균 질</div>
          <div className="font-dm text-lg font-semibold text-text-primary">
            {insight.avgQuality > 0 ? insight.avgQuality.toFixed(1) : '-'}
            <span className="text-text-tertiary ml-0.5" style={{ fontSize: '13px' }}>/5</span>
          </div>
        </div>
        {/* Goal ring replaces plain text */}
        <div className="bg-surface rounded-xl p-3 flex items-center justify-center">
          <GoalRing achieved={insight.goalAchievedDays} total={7} />
        </div>
      </div>
    </div>
  );
};
