import React from 'react';
import type { SkinRecord, Product, ProductInsight, VariableInsight } from '../types';
import { getToday, formatDate, getRecentDates } from '../utils/date';
import { KEYWORD_LABELS, SCORE_LABELS, VARIABLE_LABELS } from '../types';
import type { SkinKeyword, Variable } from '../types';
import { MoonIcon, SunIcon, LeafIcon, SettingsIcon } from '../components/Icons';
import { WeeklySummary } from '../components/WeeklySummary';

interface HomePageProps {
  records: Record<string, SkinRecord>;
  products: Product[];
  userName: string;
  onOpenNightLog: () => void;
  onOpenMorningLog: () => void;
  onOpenProducts: () => void;
  onOpenSettings: () => void;
  bestProduct?: ProductInsight | null;
  worstVariable?: VariableInsight | null;
}

export function HomePage({
  records,
  products,
  userName,
  onOpenNightLog,
  onOpenMorningLog,
  onOpenProducts,
  onOpenSettings,
  bestProduct,
  worstVariable,
}: HomePageProps) {
  const today = getToday();
  const todayRecord = records[today];
  const hasMorning = !!todayRecord?.morningLog;
  const hasNight = !!todayRecord?.nightLog;

  // Calculate streak
  let streak = 0;
  const dates = getRecentDates(60);
  for (let i = dates.length - 1; i >= 0; i--) {
    const r = records[dates[i]];
    if (r && (r.morningLog && r.nightLog)) {
      streak++;
    } else {
      break;
    }
  }

  const greeting = hasMorning
    ? `${userName}님, 오늘도 기록했어요`
    : `안녕, ${userName || ''}님\n오늘 피부는 어때?`;

  return (
    <div className="pb-20">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onOpenProducts} aria-label="제품 관리" className="text-sd-text min-w-[44px] min-h-[44px] flex items-center justify-center">
          <LeafIcon size={22} />
        </button>
        <button onClick={onOpenSettings} aria-label="설정" className="text-sd-text min-w-[44px] min-h-[44px] flex items-center justify-center">
          <SettingsIcon size={22} />
        </button>
      </div>

      {/* Date + greeting */}
      <p className="font-body text-sm text-sd-text-secondary mb-1">{formatDate(today)}</p>
      <h1 className="font-heading text-2xl text-sd-text font-bold mb-6 whitespace-pre-line">
        {greeting}
      </h1>

      {/* Morning log card */}
      <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: '#fdf8f4' }}>
        <div className="flex items-center gap-2 mb-3">
          <SunIcon size={20} color="#c2847a" />
          <span className="font-heading text-lg text-sd-text">오늘 아침 피부</span>
        </div>

        {hasMorning ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="font-number text-xl text-sd-text font-semibold">
                {todayRecord.morningLog!.score}점
              </span>
              <span className="font-body text-sm text-sd-text-secondary">
                {SCORE_LABELS[todayRecord.morningLog!.score]}
              </span>
            </div>
            <p className="font-body text-sm text-sd-text-secondary mt-1">
              {todayRecord.morningLog!.keywords.map(k => KEYWORD_LABELS[k as SkinKeyword]).join(', ')}
            </p>
            {todayRecord.morningLog!.memo && (
              <p className="font-body text-[0.8125rem] text-sd-text-secondary mt-1 italic">
                "{todayRecord.morningLog!.memo}"
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="font-body text-sm text-sd-text-secondary mb-3">아직 기록 전이에요</p>
            <button
              onClick={onOpenMorningLog}
              className="bg-sd-primary text-white rounded-xl px-5 py-2.5 font-body font-medium text-sm w-full"
            >
              아침 피부 기록하기
            </button>
          </div>
        )}
      </div>

      {/* Night log card */}
      <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#f0e8e4' }}>
        <div className="flex items-center gap-2 mb-3">
          <MoonIcon size={20} color="#c2847a" />
          <span className="font-heading text-lg text-sd-text">오늘 밤 루틴</span>
        </div>

        {hasNight ? (
          <div>
            <p className="font-body text-sm text-sd-text mb-1">
              {todayRecord.nightLog!.products.join(', ')}
            </p>
            {todayRecord.nightLog!.variables.length > 0 && (
              <p className="font-body text-[0.8125rem] text-sd-text-secondary mt-1">
                생활: {todayRecord.nightLog!.variables.map(v => {
                  const labels: Record<string, string> = {
                    flour: '밀가루', spicy: '매운 음식', alcohol: '음주', exercise: '운동',
                    poorSleep: '수면 부족', bangs: '앞머리', stress: '스트레스',
                    overtime: '야근', mask: '마스크', period: '생리전',
                  };
                  return labels[v] || v;
                }).join(', ')}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="font-body text-sm text-sd-text-secondary mb-3">아직 기록 전이에요</p>
            <button
              onClick={onOpenNightLog}
              className={`rounded-xl px-5 py-2.5 font-body font-medium text-sm w-full ${
                hasMorning
                  ? 'bg-sd-primary text-white'
                  : 'border border-sd-primary text-sd-primary'
              }`}
            >
              밤 루틴 기록하기
            </button>
          </div>
        )}
      </div>

      {/* Weekly summary */}
      <WeeklySummary records={records} />

      {/* Insight summary */}
      {(bestProduct || worstVariable) && (
        <div className="bg-white border border-sd-border rounded-xl p-4 mt-4">
          <p className="font-heading text-sm text-sd-text font-medium mb-2">이번 주 발견</p>
          {bestProduct && (
            <p className="font-body text-[0.8125rem] text-sd-text-secondary">
              가장 좋았던 제품: <span className="text-sd-text font-medium">{bestProduct.productName}</span> (사용 시 +{bestProduct.impact.toFixed(1)}점)
            </p>
          )}
          {worstVariable && (
            <p className="font-body text-[0.8125rem] text-sd-text-secondary mt-1">
              가장 나빴던 변수: <span className="text-sd-text font-medium">{VARIABLE_LABELS[worstVariable.variable as Variable]}</span> (다음날 {worstVariable.impact.toFixed(1)}점)
            </p>
          )}
        </div>
      )}

      {/* Streak */}
      {streak > 0 && (
        <p className="font-body text-sm text-sd-text-secondary mt-4 text-center">
          {streak}일 연속 기록 중
        </p>
      )}
    </div>
  );
}
