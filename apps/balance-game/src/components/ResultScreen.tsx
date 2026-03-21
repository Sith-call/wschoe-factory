import { useState, useEffect } from 'react';
import { getStats, getAnsweredQuestions, resetProgress } from '../store';
import { Category } from '../types';
import { CATEGORY_ICONS } from '../data/questions';

interface Props {
  onHome: () => void;
  onReplay: () => void;
}

function getPersonalityLabel(majorityPercent: number): { label: string; desc: string } {
  if (majorityPercent >= 70) {
    return { label: '현실주의자', desc: '안전한 선택을 하는 현실주의자' };
  }
  if (majorityPercent <= 30) {
    return { label: '반항아', desc: '남들과 다른 길을 가는 반항아' };
  }
  return { label: '중도파', desc: '균형 잡힌 중도파' };
}

function getMostChosenCategory(answeredList: ReturnType<typeof getAnsweredQuestions>): string {
  const counts: Record<string, number> = {};
  answeredList.forEach(({ question }) => {
    counts[question.category] = (counts[question.category] || 0) + 1;
  });
  let max = 0;
  let maxCat = '';
  for (const [cat, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      maxCat = cat;
    }
  }
  return maxCat;
}

// CSS confetti
function ConfettiParticles() {
  const colors = ['#fbbc00', '#6366f1', '#ffb77d', '#e87c8a', '#a855f7', '#22c55e', '#f0b8a0'];
  return (
    <>
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </>
  );
}

export default function ResultScreen({ onHome, onReplay }: Props) {
  const [showReview, setShowReview] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const stats = getStats();
  const answered = getAnsweredQuestions();
  const majorityPercent =
    stats.totalAnswered > 0 ? Math.round((stats.majorityCount / stats.totalAnswered) * 100) : 50;
  const personality = getPersonalityLabel(majorityPercent);
  const mostCategory = getMostChosenCategory(answered);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleReset = () => {
    resetProgress();
    onReplay();
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto relative overflow-hidden">
      {showConfetti && <ConfettiParticles />}

      {/* Header */}
      <div className="text-center mb-8 animate-fade-in-down">
        <h1 className="text-4xl font-headline font-extrabold text-gradient mb-2">
          게임 완료!
        </h1>
        <p className="text-on-surface-variant">당신의 선택을 분석했어요</p>
      </div>

      {/* Personality Card */}
      <div
        className="rounded-2xl p-6 mb-6 text-center animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, rgba(251,188,0,0.1) 0%, rgba(99,102,241,0.1) 100%)',
          border: '1px solid rgba(251,188,0,0.2)',
        }}
      >
        <p className="text-sm text-on-surface-variant mb-2">당신의 성향</p>
        <h2 className="text-3xl font-headline font-extrabold text-gradient mb-2">
          {personality.label}
        </h2>
        <p className="text-on-surface-variant text-sm">{personality.desc}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon="check_circle"
          label="총 답변"
          value={`${stats.totalAnswered}개`}
          delay={200}
        />
        <StatCard
          icon="groups"
          label="다수파 비율"
          value={`${majorityPercent}%`}
          delay={300}
        />
        <StatCard
          icon="local_fire_department"
          label="최고 연속"
          value={`${stats.bestStreak}회`}
          delay={400}
        />
        <StatCard
          icon={CATEGORY_ICONS[mostCategory] || 'category'}
          label="많이 답한 카테고리"
          value={mostCategory || '-'}
          delay={500}
        />
      </div>

      {/* Shareable card */}
      <div
        className="rounded-2xl p-5 mb-6 animate-fade-in-up"
        style={{
          animationDelay: '600ms',
          background: 'linear-gradient(135deg, #191c1f 0%, #1d2023 100%)',
          border: '1px solid #323539',
        }}
      >
        <div className="text-center">
          <p className="text-xs text-outline mb-3 tracking-wider">BALANCE GAME RESULT</p>
          <p className="text-2xl font-headline font-bold text-gradient mb-1">{personality.label}</p>
          <p className="text-sm text-on-surface-variant mb-3">
            {stats.totalAnswered}개 질문 중 {majorityPercent}% 다수파
          </p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{stats.majorityCount}</p>
              <p className="text-xs text-outline">다수파</p>
            </div>
            <div className="w-px bg-outline-variant/30" />
            <div className="text-center">
              <p className="text-lg font-bold text-indigo-400">
                {stats.totalAnswered - stats.majorityCount}
              </p>
              <p className="text-xs text-outline">소수파</p>
            </div>
          </div>
          <p className="text-xs text-outline mt-3">밸런스 게임 | balancegame.app</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <button
          onClick={handleReset}
          className="flex-1 py-3.5 rounded-2xl font-bold text-base btn-gradient text-on-primary
            shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          다시 하기
        </button>
        <button
          onClick={onHome}
          className="flex-1 py-3.5 rounded-2xl font-bold text-base bg-surface-container-high
            text-on-surface hover:bg-surface-bright transition-all"
        >
          홈으로
        </button>
      </div>

      {/* Review answers */}
      <div className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full flex items-center justify-between py-3 px-4 rounded-xl
            bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="text-sm font-medium">답변 돌아보기</span>
          <span
            className="material-symbols-outlined transition-transform duration-200"
            style={{
              fontSize: '20px',
              transform: showReview ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            expand_more
          </span>
        </button>

        {showReview && (
          <div className="mt-3 space-y-3 animate-slide-reveal">
            {answered.map(({ question, answer }, i) => {
              const majorityChoice =
                question.percentA >= question.percentB ? 'A' : 'B';
              const isMajority = answer.choice === majorityChoice;
              return (
                <div
                  key={question.id}
                  className="rounded-xl p-4 bg-surface-container-low"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant"
                    >
                      {question.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isMajority ? 'bg-primary/20 text-primary' : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {isMajority ? '다수파' : '소수파'}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div
                      className={`flex items-center justify-between text-sm rounded-lg px-3 py-2 ${
                        answer.choice === 'A'
                          ? 'option-a-bg-selected font-bold'
                          : 'bg-surface-container'
                      }`}
                    >
                      <span className="flex-1">{question.optionA}</span>
                      <span className="text-xs ml-2 text-primary">{question.percentA}%</span>
                    </div>
                    <div
                      className={`flex items-center justify-between text-sm rounded-lg px-3 py-2 ${
                        answer.choice === 'B'
                          ? 'option-b-bg-selected font-bold'
                          : 'bg-surface-container'
                      }`}
                    >
                      <span className="flex-1">{question.optionB}</span>
                      <span className="text-xs ml-2 text-indigo-400">{question.percentB}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delay,
}: {
  icon: string;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <div
      className="rounded-xl p-4 bg-surface-container-low text-center animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="material-symbols-outlined text-primary mb-1" style={{ fontSize: '24px' }}>
        {icon}
      </span>
      <p className="text-lg font-bold text-on-surface">{value}</p>
      <p className="text-xs text-on-surface-variant">{label}</p>
    </div>
  );
}
