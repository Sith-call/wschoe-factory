import { useState } from 'react';
import type { WeeklyBoss, BossChallenge, DailyLog } from '../types';
import { generateBossChallenges, CATEGORY_INFO, BOSS_STORIES } from '../data';
import { BossAvatar } from './BossAvatar';

interface Props {
  boss: WeeklyBoss;
  weeklyLogs: DailyLog[];
  onDefeatBoss: () => void;
  onBack: () => void;
}

export default function BossBattleScreen({ boss, weeklyLogs, onDefeatBoss, onBack }: Props) {
  const [challenges] = useState<BossChallenge[]>(() => generateBossChallenges());
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentHp, setCurrentHp] = useState(boss.hp);
  const [attackAnim, setAttackAnim] = useState(false);
  const [defeated, setDefeated] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'battle' | 'victory'>('intro');

  const weaknessInfo = CATEGORY_INFO[boss.weakness];

  // Calculate damage from weekly performance
  const totalCompletions = weeklyLogs.reduce((sum, log) => sum + log.completions.length, 0);
  const weeklyXp = weeklyLogs.reduce((sum, log) => sum + log.totalXp, 0);
  const baseDamage = Math.floor(totalCompletions * 8);
  const answeredCount = Object.keys(answers).filter(k => answers[Number(k)]?.trim().length > 0).length;
  const reflectionDamage = answeredCount * 25;
  const totalDamage = baseDamage + reflectionDamage;

  const handleAnswer = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleAttack = () => {
    if (answeredCount < 1) return;
    setAttackAnim(true);

    setTimeout(() => {
      const newHp = Math.max(0, currentHp - totalDamage);
      setCurrentHp(newHp);
      setAttackAnim(false);

      if (newHp <= 0) {
        setTimeout(() => {
          setDefeated(true);
          setPhase('victory');
          onDefeatBoss();
        }, 600);
      }
    }, 800);
  };

  const hpPct = (currentHp / boss.maxHp) * 100;
  const hpColor = hpPct > 60 ? '#ef4444' : hpPct > 30 ? '#f59e0b' : '#10b981';

  if (phase === 'intro') {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 animate-fadeIn">
        <div className="mb-6 animate-bounce-slow">
          <BossAvatar type={boss.type} size={140} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{boss.name}</h1>
        <p className="text-sm text-on-surface-variant mb-1">약점: {weaknessInfo.emoji} {weaknessInfo.label}</p>
        <p className="text-xs text-on-surface-variant mb-4">보상: {boss.reward}</p>

        {/* Boss Story */}
        <div className="w-full max-w-xs p-4 rounded-xl bg-surface-container-highest/40 border border-white/8 mb-6">
          <p className="text-xs text-on-background/80 leading-relaxed italic">
            "{BOSS_STORIES[boss.type]?.intro}"
          </p>
        </div>

        <div className="w-full max-w-xs space-y-3 mb-8">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>이번 주 루틴 완료</span>
            <span className="text-amber-400 font-mono">{totalCompletions}회</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>획득 경험치</span>
            <span className="text-amber-400 font-mono">{weeklyXp} XP</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>기본 공격력</span>
            <span className="text-red-400 font-mono">{baseDamage} DMG</span>
          </div>
        </div>

        <button
          onClick={() => setPhase('battle')}
          className="w-full max-w-xs py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-500 transition-colors active:scale-95"
        >
          ⚔️ 전투 시작
        </button>
        <button onClick={onBack} className="mt-3 text-xs text-on-surface-variant hover:text-white">
          돌아가기
        </button>
      </div>
    );
  }

  if (phase === 'victory') {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 animate-fadeIn">
        <div className="text-6xl mb-4 animate-bounce-slow">🏆</div>
        <h1 className="text-2xl font-bold text-amber-400 mb-2">승리!</h1>
        <p className="text-sm text-white mb-1">{boss.name}을(를) 처치했습니다</p>
        <p className="text-xs text-on-surface-variant mb-4">보상: {boss.reward}</p>

        {/* Defeat Story */}
        <div className="w-full max-w-xs p-3 rounded-xl bg-surface-container-highest/40 border border-white/8 mb-2">
          <p className="text-xs text-on-background/80 leading-relaxed italic">
            "{BOSS_STORIES[boss.type]?.defeat}"
          </p>
        </div>
        <div className="w-full max-w-xs p-2 rounded-lg bg-amber-500/5 border border-amber-500/15 mb-4">
          <p className="text-[10px] text-amber-400/70 text-center">
            {BOSS_STORIES[boss.type]?.next}
          </p>
        </div>

        <div className="w-full max-w-xs p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
          <div className="text-center">
            <div className="text-sm text-amber-400 font-semibold mb-1">전투 결과</div>
            <div className="text-xs text-on-surface-variant space-y-1">
              <div>루틴 공격: {baseDamage} DMG</div>
              <div>회고 공격: {reflectionDamage} DMG</div>
              <div className="text-amber-400 font-bold">총 데미지: {totalDamage} DMG</div>
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full max-w-xs py-3 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] p-4 pb-8 animate-fadeIn">
      {/* Boss HP Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="text-on-surface-variant hover:text-white transition-colors text-lg">←</button>
          <div><BossAvatar type={boss.type} size={60} damaged={attackAnim} /></div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-white">{boss.name}</span>
              <span className="text-xs font-mono" style={{ color: hpColor }}>
                {currentHp}/{boss.maxHp} HP
              </span>
            </div>
            <div className="h-3 rounded-full bg-black/30 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${hpPct}%`, backgroundColor: hpColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Challenges */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-white mb-3">🗡️ 회고 공격 — 답변으로 데미지를 입히세요</h2>
        <div className="space-y-3">
          {challenges.map((challenge, i) => (
            <div key={i} className="p-3 rounded-xl bg-surface-container-highest/50 border border-white/8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-on-surface-variant">
                  {challenge.category === 'reflection' ? '💭 회고' : challenge.category === 'planning' ? '📋 계획' : '🙏 감사'}
                </span>
                <span className="text-xs text-amber-400">+25 DMG</span>
              </div>
              <p className="text-sm text-white mb-2">{challenge.question}</p>
              <textarea
                value={answers[i] || ''}
                onChange={e => handleAnswer(i, e.target.value)}
                placeholder="답변을 입력하세요..."
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white placeholder:text-white/20 resize-none h-16 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Attack Summary & Button */}
      <div className="sticky bottom-4">
        <div className="p-4 rounded-xl bg-surface-container-lowest/90 border border-white/10 backdrop-blur-sm">
          <div className="flex justify-between text-xs text-on-surface-variant mb-2">
            <span>루틴 {totalCompletions}회 → {baseDamage} DMG</span>
            <span>회고 {answeredCount}/3 → {reflectionDamage} DMG</span>
          </div>
          <button
            onClick={handleAttack}
            disabled={answeredCount < 1 || defeated}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              answeredCount >= 1
                ? 'bg-red-600 text-white hover:bg-red-500 active:scale-95'
                : 'bg-white/5 text-white/30'
            }`}
          >
            ⚔️ 공격! ({totalDamage} DMG)
          </button>
        </div>
      </div>
    </div>
  );
}
