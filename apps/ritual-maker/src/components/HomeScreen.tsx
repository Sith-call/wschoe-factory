import type { Character, DailyLog, ScreenName, Ritual } from '../types';
import { CLASS_INFO, getTitleForLevel, TIME_SLOT_INFO } from '../data';
import { ClassAvatar } from './ClassAvatar';

interface Props {
  character: Character;
  todayLog: DailyLog | null;
  rituals: Ritual[];
  hasBoss: boolean;
  onNavigate: (screen: ScreenName) => void;
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-on-surface-variant w-8">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-surface-variant/50 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono text-on-surface-variant w-6 text-right">{value}</span>
    </div>
  );
}

export default function HomeScreen({ character, todayLog, rituals, hasBoss, onNavigate }: Props) {
  const classInfo = CLASS_INFO[character.class];
  const xpPct = Math.min(100, (character.xp / character.xpToNext) * 100);

  const todayCompleted = todayLog?.completions.length || 0;
  const todayTotal = rituals.length;
  const completionPct = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  const morningDone = todayLog?.completions.filter(c => rituals.find(r => r.id === c.ritualId)?.timeSlot === 'morning').length || 0;
  const afternoonDone = todayLog?.completions.filter(c => rituals.find(r => r.id === c.ritualId)?.timeSlot === 'afternoon').length || 0;
  const eveningDone = todayLog?.completions.filter(c => rituals.find(r => r.id === c.ritualId)?.timeSlot === 'evening').length || 0;
  const morningTotal = rituals.filter(r => r.timeSlot === 'morning').length;
  const afternoonTotal = rituals.filter(r => r.timeSlot === 'afternoon').length;
  const eveningTotal = rituals.filter(r => r.timeSlot === 'evening').length;

  return (
    <div className="min-h-[100dvh] p-4 pb-24 animate-fadeIn">
      {/* Character Card */}
      <div className={`relative rounded-2xl p-5 mb-4 bg-gradient-to-br ${classInfo.gradient} border border-white/10 overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: classInfo.color }} />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-5" style={{ backgroundColor: classInfo.color }} />

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-black/30 border border-white/10 shadow-lg overflow-hidden">
            <ClassAvatar characterClass={character.class} size={56} glow />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{character.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                Lv.{character.level}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">{classInfo.name} · {getTitleForLevel(character.level)}</p>
            {/* XP Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-white/40 mb-1">
                <span>EXP</span>
                <span>{character.xp} / {character.xpToNext}</span>
              </div>
              <div className="h-2 rounded-full bg-black/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-4 space-y-1.5">
          <StatBar label="체력" value={character.stats.stamina} max={20} color="#ef4444" />
          <StatBar label="지력" value={character.stats.intellect} max={20} color="#8b5cf6" />
          <StatBar label="정신" value={character.stats.spirit} max={20} color="#10b981" />
          <StatBar label="민첩" value={character.stats.agility} max={20} color="#f59e0b" />
        </div>
      </div>

      {/* Streak & Today Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`rounded-xl p-4 text-center border transition-all ${
          character.streak >= 30
            ? 'bg-gradient-to-br from-amber-500/20 to-red-500/10 border-amber-500/30'
            : character.streak >= 7
              ? 'bg-gradient-to-br from-orange-500/15 to-red-500/10 border-orange-500/20'
              : 'bg-surface-container-highest/60 border-white/5'
        }`}>
          <div className={`mb-1 ${character.streak >= 30 ? 'text-4xl animate-bounce-slow' : character.streak >= 7 ? 'text-3xl' : 'text-3xl'}`}>
            {character.streak >= 30 ? '🌋' : character.streak >= 14 ? '🔥' : character.streak >= 7 ? '🔥' : character.streak >= 3 ? '🕯️' : '💨'}
          </div>
          <div className={`text-2xl font-bold ${character.streak >= 7 ? 'text-orange-400' : 'text-white'}`}>{character.streak}일</div>
          <div className="text-xs text-on-surface-variant">
            {character.streak >= 30 ? '전설의 불꽃!' : character.streak >= 14 ? '불꽃 활활' : character.streak >= 7 ? '연속 스트릭' : character.streak >= 3 ? '불씨 유지' : '시작하기'}
          </div>
        </div>
        <div className={`rounded-xl p-4 text-center border ${
          completionPct >= 100
            ? 'bg-emerald-500/15 border-emerald-500/30'
            : 'bg-surface-container-highest/60 border-white/5'
        }`}>
          <div className="text-3xl mb-1">{completionPct >= 100 ? '🏆' : '⚡'}</div>
          <div className={`text-2xl font-bold ${completionPct >= 100 ? 'text-emerald-400' : 'text-white'}`}>{completionPct}%</div>
          <div className="text-xs text-on-surface-variant">{completionPct >= 100 ? '오늘 완료!' : '오늘 달성률'}</div>
        </div>
      </div>

      {/* Today's Quests Summary */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-white">오늘의 퀘스트</h2>
          <button
            onClick={() => onNavigate('quest')}
            className="text-xs px-3 py-1 rounded-full text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 transition-colors"
          >
            체크인 →
          </button>
        </div>
        <div className="space-y-2">
          {(['morning', 'afternoon', 'evening'] as const).map(slot => {
            const info = TIME_SLOT_INFO[slot];
            const done = slot === 'morning' ? morningDone : slot === 'afternoon' ? afternoonDone : eveningDone;
            const total = slot === 'morning' ? morningTotal : slot === 'afternoon' ? afternoonTotal : eveningTotal;
            const isComplete = total > 0 && done >= total;
            return (
              <button
                key={slot}
                onClick={() => onNavigate('quest')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isComplete
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-surface-container-highest/40 border-white/5 hover:border-white/15'
                }`}
              >
                <span className="text-xl">{info.emoji}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm text-white">{info.label}</div>
                  <div className="text-[10px] text-on-surface-variant">{info.hours}</div>
                </div>
                <div className="text-sm font-mono">
                  <span className={isComplete ? 'text-emerald-400' : 'text-white/60'}>
                    {done}/{total}
                  </span>
                </div>
                {isComplete && <span className="text-emerald-400 text-sm">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { screen: 'skillTree' as const, emoji: '🌳', label: '스킬트리', enabled: true },
          { screen: 'bossBattle' as const, emoji: '⚔️', label: '보스배틀', enabled: hasBoss },
          { screen: 'guild' as const, emoji: '🏰', label: '길드', enabled: true },
        ].map(item => (
          <button
            key={item.screen}
            onClick={() => item.enabled && onNavigate(item.screen)}
            disabled={!item.enabled}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
              item.enabled
                ? 'bg-surface-container-highest/40 border-white/5 hover:border-white/15 active:scale-95'
                : 'bg-surface-container-highest/20 border-white/3 opacity-40'
            }`}
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-xs text-on-surface-variant">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
