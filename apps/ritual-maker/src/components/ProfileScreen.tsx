import { useState } from 'react';
import type { Character, DailyLog, SkillNode, Ritual } from '../types';
import { CLASS_INFO, getTitleForLevel, CATEGORY_INFO, STAT_DESCRIPTIONS, requestNotificationPermission, calculatePassiveBonus } from '../data';
import { ClassAvatar } from './ClassAvatar';

interface Props {
  character: Character;
  dailyLogs: DailyLog[];
  skills: SkillNode[];
  rituals: Ritual[];
  onBack: () => void;
  onEditRituals: () => void;
  onShareProfile: () => void;
}

function NotificationToggle() {
  const [enabled, setEnabled] = useState(() => 'Notification' in window && Notification.permission === 'granted');

  const handleToggle = async () => {
    if (enabled) {
      setEnabled(false);
    } else {
      const granted = await requestNotificationPermission();
      setEnabled(granted);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="w-full mt-2 p-3 rounded-xl bg-surface-container-highest/40 border border-white/8 hover:border-white/20 transition-all text-left flex items-center gap-3 active:scale-[0.98]"
    >
      <span className="text-lg">🔔</span>
      <div className="flex-1">
        <div className="text-sm text-white">알림 설정</div>
        <div className="text-[10px] text-on-surface-variant">
          {enabled ? '아침 7시, 점심 12시, 저녁 8시 알림' : '탭하여 알림 허용'}
        </div>
      </div>
      <div className={`w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-white/20'} relative`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
    </button>
  );
}

function ActivePassives({ skills }: { skills: SkillNode[] }) {
  const passives = calculatePassiveBonus(skills);
  const unlockedSkills = skills.filter(s => s.unlocked);
  if (unlockedSkills.length === 0) return null;

  return (
    <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
      <div className="text-xs font-semibold text-amber-400 mb-2">⚡ 적용 중인 패시브 효과</div>
      <div className="space-y-1">
        {passives.xpMultiplier > 1 && (
          <div className="text-[10px] text-on-surface-variant">• 전체 XP ×{passives.xpMultiplier.toFixed(2)}</div>
        )}
        {passives.morningXpBonus > 0 && (
          <div className="text-[10px] text-on-surface-variant">• 아침 XP +{Math.round(passives.morningXpBonus * 100)}%</div>
        )}
        {passives.streakProtection && (
          <div className="text-[10px] text-emerald-400">• 스트릭 보호 활성화</div>
        )}
        {passives.bossWeaknessBonus > 0 && (
          <div className="text-[10px] text-on-surface-variant">• 보스 약점 공격 +{Math.round(passives.bossWeaknessBonus * 100)}%</div>
        )}
        {Object.entries(passives.statBonuses).map(([key, val]) => val ? (
          <div key={key} className="text-[10px] text-on-surface-variant">• {key === 'stamina' ? '체력' : key === 'intellect' ? '지력' : key === 'spirit' ? '정신력' : '민첩'} +{val}</div>
        ) : null)}
      </div>
    </div>
  );
}

export default function ProfileScreen({ character, dailyLogs, skills, rituals, onBack, onEditRituals, onShareProfile }: Props) {
  const classInfo = CLASS_INFO[character.class];
  const xpPct = Math.min(100, (character.xp / character.xpToNext) * 100);
  const totalXp = dailyLogs.reduce((s, l) => s + l.totalXp, 0);
  const totalCompletions = dailyLogs.reduce((s, l) => s + l.completions.length, 0);
  const unlockedSkills = skills.filter(s => s.unlocked).length;
  const daysPlayed = dailyLogs.length;

  // Category completion breakdown
  const categoryBreakdown = (['body', 'mind', 'soul', 'social'] as const).map(cat => {
    const catRituals = rituals.filter(r => r.category === cat);
    const catCompletions = dailyLogs.reduce((s, log) =>
      s + log.completions.filter(c => catRituals.some(r => r.id === c.ritualId)).length, 0);
    return { category: cat, completions: catCompletions };
  });
  const maxCatCompletions = Math.max(...categoryBreakdown.map(c => c.completions), 1);

  // Streak calendar (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = dailyLogs.find(l => l.date === dateStr);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return {
      day: dayNames[d.getDay()],
      date: d.getDate(),
      completions: log?.completions.length || 0,
      hasLog: !!log,
    };
  });

  return (
    <div className="min-h-[100dvh] p-4 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-on-surface-variant hover:text-white transition-colors text-lg">←</button>
        <h1 className="text-lg font-bold text-white">프로필</h1>
      </div>

      {/* Character Portrait */}
      <div className={`relative rounded-2xl p-6 mb-5 bg-gradient-to-br ${classInfo.gradient} border border-white/10 text-center overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-black/30 border border-white/10 shadow-xl mb-3 overflow-hidden">
            <ClassAvatar characterClass={character.class} size={68} glow />
          </div>
          <h2 className="text-xl font-bold text-white">{character.name}</h2>
          <p className="text-sm text-white/60">{classInfo.name} · {getTitleForLevel(character.level)}</p>

          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/50">
            <span>Lv.{character.level}</span>
            <span>🔥 {character.streak}일</span>
            <span>⭐ {unlockedSkills} 스킬</span>
          </div>

          <div className="mt-3 max-w-48 mx-auto">
            <div className="flex justify-between text-[10px] text-white/40 mb-1">
              <span>EXP</span>
              <span>{character.xp} / {character.xpToNext}</span>
            </div>
            <div className="h-2 rounded-full bg-black/30 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" style={{ width: `${xpPct}%` }} />
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={onShareProfile}
            className="mt-3 px-4 py-1.5 rounded-full bg-white/10 text-xs text-white/70 hover:bg-white/15 transition-colors active:scale-95"
          >
            📤 캐릭터 카드 공유
          </button>
        </div>
      </div>

      {/* Stats Detail */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white mb-3">📊 능력치</h3>
        <div className="space-y-3">
          {(Object.entries(character.stats) as [keyof typeof character.stats, number][]).map(([key, value]) => {
            const labels: Record<string, string> = { stamina: '체력', intellect: '지력', spirit: '정신력', agility: '민첩' };
            const colors: Record<string, string> = { stamina: '#ef4444', intellect: '#8b5cf6', spirit: '#10b981', agility: '#f59e0b' };
            return (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white">{labels[key]}</span>
                  <span className="font-mono" style={{ color: colors[key] }}>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-variant/50 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(value / 20) * 100}%`, backgroundColor: colors[key] }} />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{STAT_DESCRIPTIONS[key]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white mb-3">📈 활동 요약</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-surface-container-highest/40 border border-white/5">
            <div className="text-lg font-bold text-amber-400">{totalXp}</div>
            <div className="text-[10px] text-on-surface-variant">총 획득 XP</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-highest/40 border border-white/5">
            <div className="text-lg font-bold text-white">{totalCompletions}</div>
            <div className="text-[10px] text-on-surface-variant">루틴 완료 횟수</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-highest/40 border border-white/5">
            <div className="text-lg font-bold text-emerald-400">{daysPlayed}</div>
            <div className="text-[10px] text-on-surface-variant">활동 일수</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-highest/40 border border-white/5">
            <div className="text-lg font-bold text-purple-400">{unlockedSkills}</div>
            <div className="text-[10px] text-on-surface-variant">해금 스킬</div>
          </div>
        </div>
      </div>

      {/* Category Radar */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white mb-3">🎯 카테고리별 달성</h3>
        <div className="space-y-2">
          {categoryBreakdown.map(({ category, completions }) => {
            const info = CATEGORY_INFO[category];
            const pct = (completions / maxCatCompletions) * 100;
            return (
              <div key={category} className="flex items-center gap-2">
                <span className="w-6 text-center">{info.emoji}</span>
                <span className="text-xs text-on-surface-variant w-10">{info.label}</span>
                <div className="flex-1 h-3 rounded-full bg-surface-variant/30 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: info.color }} />
                </div>
                <span className="text-xs font-mono text-on-surface-variant w-6 text-right">{completions}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Calendar */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">📅 최근 7일</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {last7Days.map((day, i) => (
            <div key={i} className="text-center">
              <div className="text-[10px] text-on-surface-variant mb-1">{day.day}</div>
              <div className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-mono ${
                day.hasLog && day.completions > 0
                  ? day.completions >= 5
                    ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                  : 'bg-surface-container-highest/30 text-on-surface-variant/50 border border-white/5'
              }`}>
                {day.date}
              </div>
              {day.hasLog && day.completions > 0 && (
                <div className="text-[9px] text-on-surface-variant mt-0.5">{day.completions}회</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6 mb-4">
        <h3 className="text-sm font-semibold text-white mb-3">⚙️ 설정</h3>
        <button
          onClick={onEditRituals}
          className="w-full p-3 rounded-xl bg-surface-container-highest/40 border border-white/8 hover:border-white/20 transition-all text-left flex items-center gap-3 active:scale-[0.98]"
        >
          <span className="text-lg">📋</span>
          <div className="flex-1">
            <div className="text-sm text-white">루틴 편집</div>
            <div className="text-[10px] text-on-surface-variant">현재 {rituals.length}개 루틴 선택됨</div>
          </div>
          <span className="text-on-surface-variant">→</span>
        </button>

        {/* Notification toggle */}
        <NotificationToggle />

        {/* Active passives */}
        <ActivePassives skills={skills} />
      </div>
    </div>
  );
}
