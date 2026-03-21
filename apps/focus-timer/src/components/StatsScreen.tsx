import { useMemo } from 'react';
import { getTodaysSessions, getWeekSessions, getSessions, getPetStage, getAchievements } from '../store';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function energyEmoji(avg: number): string {
  if (avg <= 1.5) return '\uD83D\uDE34'; // sleeping
  if (avg <= 2.5) return '\uD83D\uDE29'; // weary
  if (avg <= 3.5) return '\uD83D\uDE10'; // neutral
  if (avg <= 4.5) return '\uD83D\uDE0A'; // smiling
  return '\uD83D\uDCAA'; // flexed bicep
}

function formatMinutes(totalMin: number): string {
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours > 0 && mins > 0) return `${hours}시간 ${mins}분`;
  if (hours > 0) return `${hours}시간`;
  return `${mins}분`;
}

export default function StatsScreen() {
  const todaySessions = getTodaysSessions();
  const weekSessions = getWeekSessions();
  const allSessions = getSessions();

  const todayStats = useMemo(() => {
    const totalMin = todaySessions.reduce((sum, s) => sum + s.focusMinutes, 0);
    const avgEnergy = todaySessions.length > 0
      ? todaySessions.reduce((sum, s) => sum + s.energy, 0) / todaySessions.length
      : 0;
    return { totalMin, count: todaySessions.length, avgEnergy };
  }, [todaySessions]);

  const weekData = useMemo(() => {
    const days: { label: string; totalMin: number; avgEnergy: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const daySessions = weekSessions.filter(s => s.date === dateStr);
      const totalMin = daySessions.reduce((sum, s) => sum + s.focusMinutes, 0);
      const avgEnergy = daySessions.length > 0
        ? daySessions.reduce((sum, s) => sum + s.energy, 0) / daySessions.length
        : 0;
      days.push({
        label: DAY_LABELS[d.getDay()],
        totalMin,
        avgEnergy,
      });
    }
    return days;
  }, [weekSessions]);

  const maxMinutes = Math.max(...weekData.map(d => d.totalMin), 60);

  const bestStreak = useMemo(() => {
    if (allSessions.length === 0) return 0;
    const dateSet = new Set(allSessions.map(s => s.date));
    const sortedDates = Array.from(dateSet).sort();
    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    return maxStreak;
  }, [allSessions]);

  return (
    <div className="px-6 pt-8 pb-8">
      <h1 className="text-[24px] font-headline font-bold mb-6">통계</h1>

      {/* Today section */}
      <section className="bg-surface-container rounded-2xl p-5 mb-4">
        <h2 className="text-[14px] text-on-surface-variant mb-4 font-medium">오늘</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-[22px] font-headline font-bold text-gradient">
              {formatMinutes(todayStats.totalMin)}
            </p>
            <p className="text-[12px] text-on-surface-variant mt-1">총 집중 시간</p>
          </div>
          <div className="text-center">
            <p className="text-[22px] font-headline font-bold text-on-surface">
              {todayStats.count}회
            </p>
            <p className="text-[12px] text-on-surface-variant mt-1">완료 세션</p>
          </div>
          <div className="text-center">
            <p className="text-[22px] font-headline font-bold text-on-surface">
              {todayStats.avgEnergy > 0
                ? `${todayStats.avgEnergy.toFixed(1)} ${energyEmoji(todayStats.avgEnergy)}`
                : '-'}
            </p>
            <p className="text-[12px] text-on-surface-variant mt-1">평균 에너지</p>
          </div>
        </div>
      </section>

      {/* Weekly chart */}
      <section className="bg-surface-container rounded-2xl p-5 mb-4">
        <h2 className="text-[14px] text-on-surface-variant mb-4 font-medium">주간 집중 시간</h2>
        <div className="flex items-end justify-between gap-2 h-[160px] mb-2">
          {weekData.map((day, i) => {
            const barHeight = maxMinutes > 0 ? (day.totalMin / maxMinutes) * 120 : 0;
            const energyY = day.avgEnergy > 0 ? 120 - (day.avgEnergy / 5) * 120 : -1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center relative h-full justify-end">
                {/* Energy dot */}
                {energyY >= 0 && (
                  <div
                    className="absolute w-2 h-2 rounded-full bg-secondary z-10"
                    style={{ bottom: `${(day.avgEnergy / 5) * 120 + 24}px` }}
                  />
                )}
                {/* Bar */}
                <div
                  className="w-full max-w-[32px] rounded-t-lg"
                  style={{
                    height: `${Math.max(barHeight, 4)}px`,
                    background: day.totalMin > 0
                      ? 'linear-gradient(180deg, #fbbc00, #ffb77d)'
                      : '#323539',
                  }}
                />
                {/* Label */}
                <span className="text-[12px] text-on-surface-variant mt-2">{day.label}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-2 justify-end">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-[11px] text-on-surface-variant">집중 시간</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-[11px] text-on-surface-variant">에너지</span>
          </div>
        </div>
      </section>

      {/* Best streak + Pet badge */}
      <section className="bg-surface-container rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[28px]">local_fire_department</span>
            <div>
              <p className="text-[18px] font-headline font-bold">{bestStreak}일 연속</p>
              <p className="text-[12px] text-on-surface-variant">최장 집중 기록</p>
            </div>
          </div>
          {/* Pet badge */}
          <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-3 py-1.5">
            <span className="text-[24px] leading-none">{getPetStage().emoji}</span>
            <span className="text-[12px] font-medium text-on-surface">{getPetStage().name}</span>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-surface-container rounded-2xl p-5">
        <h2 className="text-[14px] text-on-surface-variant mb-4 font-medium">업적</h2>
        <div className="grid grid-cols-5 gap-3">
          {getAchievements().map((ach) => {
            const isUnlocked = ach.unlockedAt !== null;
            return (
              <div key={ach.id} className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 ${
                    isUnlocked
                      ? 'bg-surface-container-high'
                      : 'bg-surface-container-high opacity-40 grayscale'
                  }`}
                >
                  <span className="text-[24px] leading-none">
                    {isUnlocked ? ach.icon : '\uD83D\uDD12'}
                  </span>
                </div>
                <p className={`text-[10px] leading-tight ${
                  isUnlocked ? 'text-on-surface font-medium' : 'text-on-surface-variant'
                }`}>
                  {ach.name}
                </p>
                {isUnlocked && ach.unlockedAt && (
                  <p className="text-[9px] text-on-surface-variant mt-0.5">
                    {new Date(ach.unlockedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
