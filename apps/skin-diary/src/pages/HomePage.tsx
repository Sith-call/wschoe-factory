import React, { useState, useEffect } from 'react';
import type { SkinRecord, Product, ProductInsight, VariableInsight, Milestone } from '../types';
import { getToday, getRecentDates, getPrevDate } from '../utils/date';
import { KEYWORD_LABELS, VARIABLE_LABELS, MILESTONE_LABELS } from '../types';
import type { SkinKeyword, Variable } from '../types';
import { WeeklyChart } from '../components/WeeklyChart';
import { StreakBadge, MilestoneBadge } from '../components/MilestoneBadge';
import { DayDetail } from '../components/DayDetail';
import { calculateRecordingRate } from '../utils/insights';
import type { MiniInsight } from '../utils/insights';
import { getCustomVariables } from '../utils/storage';

interface Props {
  records: Record<string, SkinRecord>;
  products: Product[];
  userName: string;
  streak: number;
  latestMilestone: Milestone | null;
  bestProduct: ProductInsight | null;
  worstVariable: VariableInsight | null;
  recordingRate: number;
  miniInsight: MiniInsight | null;
  onOpenNightLog: () => void;
  onOpenMorningLog: () => void;
  onOpenSettings: () => void;
  onNavigateToInsight: () => void;
  onEditMorning: (date: string) => void;
  onEditNight: (date: string) => void;
  onOpenWeeklyReport: () => void;
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
  miniInsight,
  onOpenNightLog,
  onOpenMorningLog,
  onOpenSettings,
  onNavigateToInsight,
  onEditMorning,
  onEditNight,
  onOpenWeeklyReport,
}: Props) {
  const today = getToday();
  const todayRecord = records[today];
  const hasNightLog = !!todayRecord?.nightLog;
  const hasMorningLog = !!todayRecord?.morningLog;

  // Check if yesterday had a night log but today has no morning log yet
  const yesterday = getPrevDate(today);
  const yesterdayRecord = records[yesterday];
  const showMorningNudge = yesterdayRecord?.nightLog && !hasMorningLog;

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '좋은 아침이에요';
    if (hour >= 12 && hour < 18) return '좋은 오후예요';
    if (hour >= 18 && hour < 22) return '좋은 저녁이에요';
    return '좋은 밤이에요';
  };

  const greeting = getGreeting();

  const [detailDate, setDetailDate] = useState<string | null>(null);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  // Check if we should show streak celebration
  useEffect(() => {
    const celebrationMilestones = [7, 14, 30, 60, 100];
    if (celebrationMilestones.includes(streak)) {
      const key = `streak_celebrated_${streak}`;
      if (!sessionStorage.getItem(key)) {
        setShowStreakCelebration(true);
        sessionStorage.setItem(key, 'true');
        setTimeout(() => setShowStreakCelebration(false), 4000);
      }
    }
  }, [streak]);

  return (
    <div className="pb-24">
      {/* TopAppBar */}
      <header className="w-full pt-6 pb-2 bg-background">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">spa</span>
            <h1 className="font-noto-serif text-2xl font-light italic text-on-surface">
              {greeting}{userName ? `, ${userName}님` : ''}
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

        {/* Today's Recording Status — completion banner */}
        <section className={`rounded-2xl p-4 flex items-center gap-3 border transition-all ${
          hasMorningLog && hasNightLog
            ? 'bg-primary-fixed/40 border-primary/10'
            : 'bg-surface-container-lowest border-outline-variant/5'
        }`} style={hasMorningLog && hasNightLog ? { boxShadow: '0 2px 12px rgba(133,80,72,0.08)' } : {}}>
          <div className="flex gap-1.5">
            <div className={`w-3 h-3 rounded-full transition-colors ${hasMorningLog ? 'bg-primary' : 'bg-surface-container-highest'}`} />
            <div className={`w-3 h-3 rounded-full transition-colors ${hasNightLog ? 'bg-primary' : 'bg-surface-container-highest'}`} />
          </div>
          <p className={`text-xs flex-1 ${hasMorningLog && hasNightLog ? 'text-primary font-medium' : 'text-on-surface-variant'}`}>
            {hasMorningLog && hasNightLog
              ? '오늘 기록을 모두 완료했어요!'
              : hasMorningLog
                ? '아침 기록 완료 -- 밤 기록도 잊지 마세요'
                : hasNightLog
                  ? '밤 기록 완료 -- 아침 기록도 남겨봐요'
                  : '아직 오늘의 기록이 없어요'}
          </p>
          {hasMorningLog && hasNightLog && (
            <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
          )}
        </section>

        {/* Today's Recording Status */}
        <section className="grid grid-cols-2 gap-4">
          {/* Night Record */}
          <div className={`p-5 rounded-[24px] flex flex-col justify-between min-h-[160px] border ${
            hasNightLog
              ? 'bg-surface-container-lowest border-primary/10'
              : 'bg-surface-container-low border-outline-variant/5'
          }`} style={hasNightLog ? { boxShadow: '0 1px 6px rgba(133,80,72,0.06)' } : {}}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant/50" style={{ fontVariationSettings: "'FILL' 1" }}>dark_mode</span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                    hasNightLog ? 'text-primary' : 'text-on-surface-variant/60'
                  }`}>
                    밤 기록
                  </span>
                </div>
                {hasNightLog && (
                  <span
                    className="material-symbols-outlined text-primary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </div>
              {hasNightLog ? (
                <p className="text-[13px] text-on-surface-variant leading-relaxed font-noto-serif italic">
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
          <div className={`p-5 rounded-[24px] flex flex-col justify-between min-h-[160px] border ${
            hasMorningLog
              ? 'bg-surface-container-lowest border-primary/10'
              : 'bg-surface-container-low border-outline-variant/5'
          }`} style={hasMorningLog ? { boxShadow: '0 1px 6px rgba(133,80,72,0.06)' } : {}}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant/50" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                    hasMorningLog ? 'text-primary' : 'text-on-surface-variant/60'
                  }`}>
                    아침 기록
                  </span>
                </div>
                {hasMorningLog && (
                  <span
                    className="material-symbols-outlined text-primary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
              </div>
              {hasMorningLog ? (
                <div>
                  <p className="text-[13px] text-on-surface-variant leading-relaxed font-noto-serif italic">
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

        {/* Quick combined log: when both are missing, offer a combined option */}
        {!hasNightLog && !hasMorningLog && (
          <section>
            <button
              onClick={onOpenMorningLog}
              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-primary-fixed/40 border border-primary/10 active:scale-[0.98] transition-transform"
            >
              <span className="material-symbols-outlined text-primary text-lg">bolt</span>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-on-surface">아침 빠른 기록</p>
                <p className="text-[11px] text-on-surface-variant">점수와 키워드만 30초 기록</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 text-sm">arrow_forward</span>
            </button>
          </section>
        )}

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

        {/* Weekly Report Link */}
        <section>
          <button
            onClick={onOpenWeeklyReport}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 active:scale-[0.98] transition-transform group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-lg">summarize</span>
              <span className="text-sm font-medium text-on-surface">주간 리포트 보기</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/40 text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </section>

        {/* Recent Timeline (3-5 days) */}
        {(() => {
          const recentDates = getRecentDates(5).reverse(); // oldest first
          const timelineData = recentDates.filter(d => records[d]?.morningLog || records[d]?.nightLog);
          if (timelineData.length === 0) return null;
          return (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface-variant">최근 기록</h3>
              <div className="space-y-2">
                {timelineData.map(date => {
                  const rec = records[date];
                  const dayLabel = date === today ? '오늘' : `${new Date(date + 'T12:00:00').getMonth() + 1}/${new Date(date + 'T12:00:00').getDate()}`;
                  return (
                    <button
                      key={date}
                      onClick={() => setDetailDate(date)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/5 active:scale-[0.98] transition-transform"
                    >
                      <span className="text-xs font-medium text-on-surface-variant w-10">{dayLabel}</span>
                      {rec?.morningLog && (
                        <span className="text-xs text-primary font-semibold">{rec.morningLog.score}점</span>
                      )}
                      {rec?.morningLog?.keywords.slice(0, 2).map(kw => (
                        <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container/20 text-on-surface-variant">
                          {KEYWORD_LABELS[kw]}
                        </span>
                      ))}
                      {rec?.nightLog && (
                        <span className="text-[10px] text-on-surface-variant/60 ml-auto">
                          {rec.nightLog.products.length}개 제품
                        </span>
                      )}
                      {!rec?.morningLog && !rec?.nightLog && (
                        <span className="text-[10px] text-on-surface-variant/40">미기록</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* Mini-Insight Teaser (from day 3) */}
        {miniInsight && miniInsight.correlations.length > 0 && (
          <section
            className="bg-primary-fixed/30 rounded-2xl p-5 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={onNavigateToInsight}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">발견된 패턴</h3>
            </div>
            {(() => {
              const c = miniInsight.correlations[0];
              const customVars = getCustomVariables();
              const varLabel = VARIABLE_LABELS[c.variable as Variable]
                || customVars.find(cv => cv.id === c.variable)?.label
                || c.variable;
              return (
                <p className="text-[14px] text-on-surface leading-relaxed">
                  <span className="font-semibold text-primary">{varLabel}</span>
                  {' '}다음날{' '}
                  <span className="font-medium">{KEYWORD_LABELS[c.keyword as SkinKeyword]}</span>
                  {' '}등장 확률{' '}
                  <span className="serif-numbers font-bold text-primary text-lg">{c.probability}%</span>
                </p>
              );
            })()}
            <p className="text-[11px] text-on-surface-variant/60 mt-2 flex items-center gap-1">
              인사이트 탭에서 더 보기
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </p>
          </section>
        )}

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

      {/* Streak Celebration */}
      {showStreakCelebration && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/30"
          onClick={() => setShowStreakCelebration(false)}
        >
          <div className="bg-surface rounded-3xl p-8 mx-6 max-w-sm text-center space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              celebration
            </span>
            <h2 className="font-headline text-2xl font-medium text-on-surface">
              {streak}일 연속 기록!
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {streak >= 30
                ? '한 달 넘게 꾸준히 기록하고 있어요. 대단해요!'
                : streak >= 14
                  ? '2주 동안 빠짐없이 기록했어요. 피부 변화가 보이기 시작할 거예요.'
                  : '일주일 연속 기록 달성! 첫 번째 인사이트가 준비되었어요.'}
            </p>
            <button
              onClick={() => setShowStreakCelebration(false)}
              className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold active:scale-95 transition-transform"
            >
              계속하기
            </button>
          </div>
        </div>
      )}

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
