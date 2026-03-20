import { useState } from 'react';
import type { Ritual, DailyLog, TimeSlot, Character } from '../types';
import { TIME_SLOT_INFO, CATEGORY_INFO, CLASS_INFO } from '../data';

interface Props {
  character: Character;
  rituals: Ritual[];
  todayLog: DailyLog;
  onComplete: (ritualId: string) => void;
  onBack: () => void;
}

export default function QuestScreen({ character, rituals, todayLog, onComplete, onBack }: Props) {
  const [activeSlot, setActiveSlot] = useState<TimeSlot>(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  });
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  const classInfo = CLASS_INFO[character.class];
  const slotRituals = rituals.filter(r => r.timeSlot === activeSlot);
  const completedIds = new Set(todayLog.completions.map(c => c.ritualId));

  const handleComplete = (ritualId: string) => {
    if (completedIds.has(ritualId)) return;
    setJustCompleted(ritualId);
    onComplete(ritualId);
    setTimeout(() => setJustCompleted(null), 1200);
  };

  const slotCompleted = slotRituals.filter(r => completedIds.has(r.id)).length;
  const slotTotal = slotRituals.length;
  const allSlotDone = slotTotal > 0 && slotCompleted >= slotTotal;

  return (
    <div className="min-h-[100dvh] p-4 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-on-surface-variant hover:text-white transition-colors text-lg">←</button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">일일 퀘스트</h1>
          <p className="text-xs text-on-surface-variant">
            루틴을 완료하고 XP를 획득하세요
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-amber-400">+{todayLog.totalXp} XP</div>
          <div className="text-[10px] text-on-surface-variant">오늘 획득</div>
        </div>
      </div>

      {/* Time Slot Tabs */}
      <div className="flex gap-2 mb-5">
        {(['morning', 'afternoon', 'evening'] as const).map(slot => {
          const info = TIME_SLOT_INFO[slot];
          const isActive = activeSlot === slot;
          const done = rituals.filter(r => r.timeSlot === slot && completedIds.has(r.id)).length;
          const total = rituals.filter(r => r.timeSlot === slot).length;
          const isAllDone = total > 0 && done >= total;
          return (
            <button
              key={slot}
              onClick={() => setActiveSlot(slot)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-center transition-all border ${
                isActive
                  ? isAllDone
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/10 border-white/20 text-white'
                  : 'bg-transparent border-white/5 text-on-surface-variant'
              }`}
            >
              <div className="text-lg">{info.emoji}</div>
              <div className="text-[10px] mt-0.5">{info.label}</div>
              <div className="text-[10px] mt-0.5 font-mono">{done}/{total}</div>
            </button>
          );
        })}
      </div>

      {/* Slot Complete Banner */}
      {allSlotDone && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-slideUp">
          <div className="text-lg mb-1">🎉</div>
          <div className="text-sm text-emerald-400 font-semibold">{TIME_SLOT_INFO[activeSlot].label} 완료!</div>
          <div className="text-xs text-emerald-400/60 mt-0.5">보너스 XP +10</div>
        </div>
      )}

      {/* Quest Cards */}
      <div className="space-y-2">
        {slotRituals.map((ritual, i) => {
          const isDone = completedIds.has(ritual.id);
          const isAnimating = justCompleted === ritual.id;
          const catInfo = CATEGORY_INFO[ritual.category];
          return (
            <button
              key={ritual.id}
              onClick={() => handleComplete(ritual.id)}
              disabled={isDone}
              className={`relative w-full text-left p-4 rounded-xl border transition-all duration-300 overflow-hidden ${
                isAnimating
                  ? 'bg-amber-500/20 border-amber-500/40 scale-[1.02]'
                  : isDone
                    ? 'bg-surface-container-highest/30 border-white/5 opacity-60'
                    : 'bg-surface-container-highest/50 border-white/8 hover:border-white/20 active:scale-[0.98]'
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl transition-all ${
                  isDone ? 'bg-emerald-500/20' : 'bg-white/5'
                }`}>
                  {isDone ? '✅' : ritual.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isDone ? 'text-white/40 line-through' : 'text-white'}`}>
                      {ritual.name}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: catInfo.color + '20', color: catInfo.color }}
                    >
                      {catInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{ritual.description}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-mono ${isDone ? 'text-emerald-400/50' : 'text-amber-400'}`}>
                    +{ritual.xpReward}
                  </div>
                  <div className="text-[10px] text-on-surface-variant">XP</div>
                </div>
              </div>

              {/* XP Gain Animation with particles */}
              {isAnimating && (
                <>
                  <div className="absolute top-2 right-4 text-amber-400 font-bold text-lg animate-floatUp z-10">
                    +{ritual.xpReward} XP!
                  </div>
                  {/* Celebration particles */}
                  {[...Array(6)].map((_, pi) => (
                    <div
                      key={pi}
                      className="absolute w-1.5 h-1.5 rounded-full animate-particle"
                      style={{
                        left: `${30 + Math.random() * 40}%`,
                        top: `${20 + Math.random() * 60}%`,
                        backgroundColor: ['#fbbf24', '#f59e0b', '#10b981', '#8b5cf6'][pi % 4],
                        animationDelay: `${pi * 0.1}s`,
                      }}
                    />
                  ))}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Class Bonus Hint */}
      <div className="mt-6 p-3 rounded-xl bg-surface-container-highest/30 border border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-sm">{classInfo.emoji}</span>
          <span className="text-xs text-on-surface-variant">
            {classInfo.name} 클래스 보너스: {
              character.class === 'warrior' ? '체력 루틴 XP +20%' :
              character.class === 'mage' ? '지력 루틴 XP +20%' :
              character.class === 'healer' ? '정신력 루틴 XP +20%' :
              '민첩 루틴 XP +20%'
            }
          </span>
        </div>
      </div>
    </div>
  );
}
