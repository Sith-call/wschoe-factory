import { useMemo } from 'react';
import { getMoodCounts, MOODS, MOOD_MAP } from '../data';
import type { MoodLog, MoodKey } from '../types';

interface Props {
  logs: MoodLog[];
  streak: number;
  onReset: () => void;
  onBack: () => void;
}

export default function ProfileScreen({ logs, streak, onReset, onBack }: Props) {
  const moodCounts = useMemo(() => getMoodCounts(logs), [logs]);
  const totalLogs = logs.length;

  // Most frequent mood
  const topMood = useMemo(() => {
    if (totalLogs === 0) return null;
    let maxKey: MoodKey = 'happy';
    let maxCount = 0;
    for (const [key, count] of Object.entries(moodCounts)) {
      if (count > maxCount) { maxCount = count; maxKey = key as MoodKey; }
    }
    return { mood: MOOD_MAP[maxKey], count: maxCount };
  }, [moodCounts, totalLogs]);

  // Average intensity
  const avgIntensity = useMemo(() => {
    if (totalLogs === 0) return 0;
    return Math.round((logs.reduce((s, l) => s + l.intensity, 0) / totalLogs) * 10) / 10;
  }, [logs, totalLogs]);

  // Mood balance wheel data
  const wheelData = useMemo(() => {
    return MOODS.map(m => ({
      ...m,
      count: moodCounts[m.key],
      percent: totalLogs > 0 ? Math.round((moodCounts[m.key] / totalLogs) * 100) : 0,
    }));
  }, [moodCounts, totalLogs]);

  // Positive vs negative ratio
  const positiveCount = moodCounts.happy + moodCounts.calm + moodCounts.excited;
  const negativeCount = moodCounts.sad + moodCounts.angry + moodCounts.anxious;
  const neutralCount = moodCounts.tired + moodCounts.empty;

  return (
    <div className="min-h-[100dvh] flex flex-col px-5 pt-8 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-on-surface-dim text-sm">{'\u2190'} 돌아가기</button>
        <h2 className="text-lg font-bold text-on-surface">감정 프로필</h2>
        <div className="w-16" />
      </div>

      {/* Avatar card */}
      <div className="bg-surface-card rounded-2xl p-6 border border-white/10 text-center mb-5">
        <div className="w-20 h-20 rounded-full bg-teal/40 border-2 border-teal-bright/30 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">{'\uD83C\uDFFA'}</span>
        </div>
        <h3 className="text-on-surface font-bold text-lg mb-1">나의 감정 약국</h3>
        <p className="text-on-surface-dim text-sm">
          {totalLogs > 0
            ? `${totalLogs}번의 진료 기록 | ${streak}일 연속`
            : '아직 기록이 없어요'
          }
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-surface-card rounded-xl p-4 border border-white/5">
          <p className="text-on-surface-muted text-xs mb-1">가장 자주 느끼는 감정</p>
          {topMood ? (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl">{topMood.mood.emoji}</span>
              <div>
                <p className="text-on-surface font-bold">{topMood.mood.label}</p>
                <p className="text-on-surface-muted text-xs">{topMood.count}회</p>
              </div>
            </div>
          ) : (
            <p className="text-on-surface-dim text-sm mt-2">-</p>
          )}
        </div>
        <div className="bg-surface-card rounded-xl p-4 border border-white/5">
          <p className="text-on-surface-muted text-xs mb-1">평균 감정 강도</p>
          <p className="text-2xl font-bold text-teal-bright mt-2">{avgIntensity || '-'}</p>
          <p className="text-on-surface-muted text-xs">/ 5.0</p>
        </div>
      </div>

      {/* Mood balance */}
      <div className="bg-surface-card rounded-xl p-5 border border-white/5 mb-5">
        <p className="text-on-surface font-medium text-sm mb-4">감정 밸런스</p>

        {totalLogs > 0 ? (
          <>
            {/* Horizontal bar */}
            <div className="flex h-4 rounded-full overflow-hidden mb-4">
              {positiveCount > 0 && (
                <div
                  className="bg-green-happy/70 transition-all"
                  style={{ width: `${(positiveCount / totalLogs) * 100}%` }}
                />
              )}
              {neutralCount > 0 && (
                <div
                  className="bg-on-surface-muted/40 transition-all"
                  style={{ width: `${(neutralCount / totalLogs) * 100}%` }}
                />
              )}
              {negativeCount > 0 && (
                <div
                  className="bg-red-intense/60 transition-all"
                  style={{ width: `${(negativeCount / totalLogs) * 100}%` }}
                />
              )}
            </div>

            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-happy/70" />
                <span className="text-on-surface-dim">긍정 {Math.round((positiveCount / totalLogs) * 100)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-on-surface-muted/40" />
                <span className="text-on-surface-dim">중립 {Math.round((neutralCount / totalLogs) * 100)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-intense/60" />
                <span className="text-on-surface-dim">부정 {Math.round((negativeCount / totalLogs) * 100)}%</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-on-surface-muted text-sm text-center py-4">기록을 쌓으면 밸런스를 볼 수 있어요</p>
        )}
      </div>

      {/* Mood wheel */}
      <div className="bg-surface-card rounded-xl p-5 border border-white/5 mb-5">
        <p className="text-on-surface font-medium text-sm mb-4">감정 분포</p>
        <div className="space-y-2">
          {wheelData.map(item => (
            <div key={item.key} className="flex items-center gap-3">
              <span className="text-sm w-6">{item.emoji}</span>
              <span className="text-on-surface-dim text-xs w-10">{item.label}</span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.bgColor} rounded-full transition-all`}
                  style={{ width: `${item.percent}%`, opacity: 0.7 }}
                />
              </div>
              <span className="text-on-surface-muted text-[10px] w-8 text-right">
                {item.count > 0 ? `${item.percent}%` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          if (confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            onReset();
          }
        }}
        className="w-full py-3 text-red-intense/60 text-sm border border-red-intense/20 rounded-xl hover:bg-red-soft transition-colors mt-4"
      >
        데이터 초기화
      </button>
    </div>
  );
}
