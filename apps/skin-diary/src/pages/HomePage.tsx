import React, { useState } from 'react';
import type { SkinRecord, Product, ProductInsight, VariableInsight, Milestone } from '../types';
import { getToday, getRecentDates, getPrevDate } from '../utils/date';
import { KEYWORD_LABELS, VARIABLE_LABELS } from '../types';
import type { SkinKeyword, Variable } from '../types';
import { WeeklyChart } from '../components/WeeklyChart';
import { StreakBadge, MilestoneBadge } from '../components/MilestoneBadge';
import { DayDetail } from '../components/DayDetail';
import { calculateRecordingRate } from '../utils/insights';

interface Props {
  records: Record<string, SkinRecord>;
  products: Product[];
  userName: string;
  streak: number;
  latestMilestone: Milestone | null;
  bestProduct: ProductInsight | null;
  worstVariable: VariableInsight | null;
  recordingRate: number;
  onOpenNightLog: () => void;
  onOpenMorningLog: () => void;
  onOpenSettings: () => void;
  onNavigateToInsight: () => void;
  onEditMorning: (date: string) => void;
  onEditNight: (date: string) => void;
}

export function HomePage({
  records,
  products,
  userName,
  streak,
  latestMilestone,
  bestProduct,
  worstVariable,
  recordingRate,
  onOpenNightLog,
  onOpenMorningLog,
  onOpenSettings,
  onNavigateToInsight,
  onEditMorning,
  onEditNight,
}: Props) {
  const today = getToday();
  const todayRecord = records[today];
  const hasNightLog = !!todayRecord?.nightLog;
  const hasMorningLog = !!todayRecord?.morningLog;

  // Check if yesterday had a night log but today has no morning log yet
  const yesterday = getPrevDate(today);
  const yesterdayRecord = records[yesterday];
  const showMorningNudge = yesterdayRecord?.nightLog && !hasMorningLog;

  const [detailDate, setDetailDate] = useState<string | null>(null);

  return (
    <div className="pb-24">
      {/* TopAppBar */}
      <header className="w-full pt-6 pb-2 bg-background">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">spa</span>
            <h1 className="font-noto-serif text-2xl font-light italic text-on-surface">
              좋은 아침이에요{userName ? `, ${userName}님` : ''}
            </h1>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      <main className="space-y-8 mt-4">
        {/* Milestone / Streak Badge */}
        <section className="flex justify-center">
          {latestMilestone ? (
            <MilestoneBadge milestone={latestMilestone} />
          ) : (
            <StreakBadge streak={streak} />
          )}
        </section>

        {/* Morning nudge banner */}
        {showMorningNudge && (
          <section className="bg-primary-fixed rounded-[20px] p-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                wb_sunny
              </span>
              <div className="flex-1">
                <p className="text-sm text-on-surface font-medium">어젯밤 기록 완료!</p>
                <p className="text-xs text-on-surface-variant">아침 피부 상태도 기록해봐요</p>
              </div>
              <button
                onClick={onOpenMorningLog}
                className="px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold active:scale-95 transition-transform"
              >
                기록하기
              </button>
            </div>
          </section>
        )}

        {/* Today's Recording Status */}
        <section className="grid grid-cols-2 gap-4">
          {/* Night Record */}
          <div className={`p-5 rounded-[24px] flex flex-col justify-between min-h-[160px] ${
            hasNightLog
              ? 'bg-surface-container-lowest border border-outline-variant/5'
              : 'bg-surface-container-low'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                  hasNightLog ? 'text-primary' : 'text-on-surface-variant/60'
                }`}>
                  밤 기록
                </span>
                {hasNightLog && (
                  <span
                    className="material-symbols-outlined text-primary-container text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </div>
              {hasNightLog ? (
                <p className="text-[13px] text-on-surface-variant leading-relaxed">
                  {todayRecord!.nightLog!.products.length > 1
                    ? `${todayRecord!.nightLog!.products[0]} 외 ${todayRecord!.nightLog!.products.length - 1}개`
                    : todayRecord!.nightLog!.products.length === 1
                      ? todayRecord!.nightLog!.products[0]
                      : '기록 완료'}
                  <br />제품 사용 완료
                </p>
              ) : (
                <p className="text-[13px] text-on-surface-variant mt-2 leading-tight">
                  아직 기록 전이에요
                </p>
              )}
            </div>
            {!hasNightLog && (
              <button
                onClick={onOpenNightLog}
                className="bg-gradient-to-br from-primary to-primary-container text-white py-2.5 px-4 rounded-full text-xs font-semibold shadow-md active:scale-95 transition-transform"
              >
                기록하기
              </button>
            )}
          </div>

          {/* Morning Record */}
          <div className={`p-5 rounded-[24px] flex flex-col justify-between min-h-[160px] ${
            hasMorningLog
              ? 'bg-surface-container-lowest border border-outline-variant/5'
              : 'bg-surface-container-low'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                  hasMorningLog ? 'text-primary' : 'text-on-surface-variant/60'
                }`}>
                  아침 기록
                </span>
                {hasMorningLog && (
                  <span
                    className="material-symbols-outlined text-primary-container text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </div>
              {hasMorningLog ? (
                <div>
                  <p className="text-[13px] text-on-surface-variant leading-relaxed">
                    피부 점수 {todayRecord!.morningLog!.score}점
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {todayRecord!.morningLog!.keywords.slice(0, 2).map(kw => (
                      <span key={kw} className="text-[10px] text-primary font-medium">
                        {KEYWORD_LABELS[kw]}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-on-surface-variant mt-2 leading-tight">
                  아직 기록 전이에요
                </p>
              )}
            </div>
            {!hasMorningLog && (
              <button
                onClick={onOpenMorningLog}
                className="bg-gradient-to-br from-primary to-primary-container text-white py-2.5 px-4 rounded-full text-xs font-semibold shadow-md active:scale-95 transition-transform"
              >
                기록하기
              </button>
            )}
          </div>
        </section>

        {/* Recording Rate */}
        {recordingRate > 0 && (
          <section className="flex items-center gap-3 px-1">
            <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full transition-all"
                style={{ width: `${recordingRate}%` }}
              />
            </div>
            <span className="text-[11px] text-on-surface-variant/60 font-medium whitespace-nowrap">
              이번 달 {recordingRate}%
            </span>
          </section>
        )}

        {/* Weekly Chart */}
        <WeeklyChart
          records={records}
          onDayTap={(date) => setDetailDate(date)}
        />

        {/* Insight Preview Card */}
        {(bestProduct || worstVariable) && (
          <section className="relative overflow-hidden bg-surface-container-highest rounded-[28px] p-6">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">이번 주 발견</h3>
            </div>
            {bestProduct && (
              <p className="text-[15px] text-on-surface-variant leading-relaxed">
                <span className="text-primary font-semibold">{bestProduct.productName}</span>를 사용한 날,{' '}
                <br />
                평소보다 피부 점수가{' '}
                <span className="serif-numbers font-bold text-lg">{Math.abs(bestProduct.impact).toFixed(1)}</span>
                점 높았어요.
              </p>
            )}
            {!bestProduct && worstVariable && (
              <p className="text-[15px] text-on-surface-variant leading-relaxed">
                <span className="text-primary font-semibold">
                  {VARIABLE_LABELS[worstVariable.variable as Variable] || worstVariable.variable}
                </span>
                이 있는 날,{' '}
                <br />
                피부 점수가{' '}
                <span className="serif-numbers font-bold text-lg">{Math.abs(worstVariable.impact).toFixed(1)}</span>
                점 낮았어요.
              </p>
            )}
            <button
              onClick={onNavigateToInsight}
              className="mt-4 text-[13px] font-semibold text-primary flex items-center gap-1 group"
            >
              자세히 보기
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </section>
        )}
      </main>

      {/* Day detail bottom sheet */}
      {detailDate && (
        <DayDetail
          date={detailDate}
          record={records[detailDate]}
          records={records}
          onClose={() => setDetailDate(null)}
          onEditMorning={(d) => { setDetailDate(null); onEditMorning(d); }}
          onEditNight={(d) => { setDetailDate(null); onEditNight(d); }}
        />
      )}
    </div>
  );
}
