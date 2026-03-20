import { useState } from 'react';
import type { SkillNode, Character } from '../types';
import { CATEGORY_INFO } from '../data';

interface Props {
  character: Character;
  skills: SkillNode[];
  onUnlockSkill: (skillId: string) => void;
  onBack: () => void;
}

function SkillCard({ skill, character, onUnlock }: { skill: SkillNode; character: Character; onUnlock: (id: string) => void }) {
  const [justUnlocked, setJustUnlocked] = useState(false);
  const catInfo = CATEGORY_INFO[skill.category];
  const canUnlock = !skill.unlocked && character.level >= skill.requiredLevel;
  const isLocked = !skill.unlocked && character.level < skill.requiredLevel;

  const handleUnlock = () => {
    if (!canUnlock) return;
    setJustUnlocked(true);
    onUnlock(skill.id);
    setTimeout(() => setJustUnlocked(false), 1500);
  };

  return (
    <button
      onClick={handleUnlock}
      disabled={!canUnlock}
      className={`relative w-full text-left p-3 rounded-xl border transition-all duration-300 overflow-hidden ${
        justUnlocked
          ? 'bg-gradient-to-br from-amber-500/30 to-transparent border-amber-400/60 scale-[1.02]'
          : skill.unlocked
            ? 'bg-gradient-to-br from-amber-500/15 to-transparent border-amber-500/30'
            : canUnlock
              ? 'bg-surface-container-highest/60 border-emerald-500/30 hover:border-emerald-400/50 active:scale-[0.98]'
              : 'bg-surface-container-highest/20 border-white/5 opacity-50'
      }`}
    >
      {/* Glow for unlocked */}
      {skill.unlocked && (
        <div className="absolute inset-0 rounded-xl bg-amber-500/5 animate-breathe" />
      )}

      {/* Unlock particles */}
      {justUnlocked && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full animate-particle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                backgroundColor: ['#fbbf24', '#f59e0b', '#10b981'][i % 3],
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-start gap-2.5">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
            justUnlocked ? 'bg-amber-500/30 scale-110' : skill.unlocked ? 'bg-amber-500/20' : isLocked ? 'bg-white/5' : 'bg-emerald-500/10'
          }`}>
            {isLocked ? '🔒' : skill.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-semibold ${
                justUnlocked ? 'text-amber-300' : skill.unlocked ? 'text-amber-400' : isLocked ? 'text-white/30' : 'text-white'
              }`}>
                {skill.name}
              </span>
              <span
                className="text-[9px] px-1 py-0.5 rounded"
                style={{ backgroundColor: catInfo.color + '20', color: catInfo.color + (isLocked ? '60' : '') }}
              >
                T{skill.tier}
              </span>
              {skill.unlocked && <span className="text-[9px] text-amber-400">✓ 적용 중</span>}
            </div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">{skill.description}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[10px] text-amber-400/60">⚡ {skill.passive}</span>
            </div>
          </div>
        </div>

        {isLocked && (
          <div className="mt-2 text-[10px] text-on-surface-variant/60">
            Lv.{skill.requiredLevel} 필요 {skill.requires.length > 0 && `+ 선행 스킬 ${skill.requires.length}개`}
          </div>
        )}
        {canUnlock && !justUnlocked && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
            <span className="animate-pulse">✦</span> 탭하여 해금!
          </div>
        )}
        {justUnlocked && (
          <div className="mt-2 text-[10px] text-amber-400 font-bold animate-slideUp">
            ⚡ 해금 완료! 패시브 효과 적용됨
          </div>
        )}
      </div>
    </button>
  );
}

export default function SkillTreeScreen({ character, skills, onUnlockSkill, onBack }: Props) {
  const tiers = [1, 2, 3, 4] as const;
  const unlockedCount = skills.filter(s => s.unlocked).length;

  return (
    <div className="min-h-[100dvh] p-4 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-on-surface-variant hover:text-white transition-colors text-lg">←</button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">스킬 트리</h1>
          <p className="text-xs text-on-surface-variant">루틴으로 능력을 해금하세요</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-amber-400">{unlockedCount}/{skills.length}</div>
          <div className="text-[10px] text-on-surface-variant">해금됨</div>
        </div>
      </div>

      {/* Skill Tree by Tier */}
      <div className="space-y-6">
        {tiers.map(tier => {
          const tierSkills = skills.filter(s => s.tier === tier);
          const tierLabel = tier === 1 ? '초급' : tier === 2 ? '중급' : tier === 3 ? '고급' : '전설';
          const tierColor = tier === 1 ? 'text-green-400' : tier === 2 ? 'text-blue-400' : tier === 3 ? 'text-purple-400' : 'text-amber-400';
          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`text-xs font-semibold ${tierColor}`}>
                  {'★'.repeat(tier)} Tier {tier} — {tierLabel}
                </div>
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-on-surface-variant">
                  Lv.{tier === 1 ? 2 : tier === 2 ? 4 : tier === 3 ? 7 : 10}+
                </span>
              </div>

              {tier > 1 && (
                <div className="flex justify-center mb-2">
                  <div className="w-px h-4 bg-white/10" />
                </div>
              )}

              <div className="grid grid-cols-1 gap-2">
                {tierSkills.map(skill => (
                  <SkillCard key={skill.id} skill={skill} character={character} onUnlock={onUnlockSkill} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-3 rounded-xl bg-surface-container-highest/30 border border-white/5">
        <div className="text-[10px] text-on-surface-variant space-y-1">
          <div>🟡 해금됨 — 패시브 효과 적용 중</div>
          <div>🟢 해금 가능 — 탭하여 해금</div>
          <div>🔒 잠김 — 레벨/선행 스킬 필요</div>
        </div>
      </div>
    </div>
  );
}
