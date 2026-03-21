import React, { useState, useEffect } from 'react';
import { QuizResult } from '../types';
import { questions } from '../data/questions';

interface ResultScreenProps {
  result: QuizResult;
  onRestart: () => void;
}

function getTitle(score: number): { title: string; emoji: string; description: string } {
  if (score <= 150) return { title: '인턴 체험단', emoji: '😅', description: '아직 성장 중! 가능성은 무한대' };
  if (score <= 250) return { title: '사회초년생', emoji: '🌱', description: '시작이 반이다. 나머지 반은 야근' };
  if (score <= 350) return { title: '중견 실무자', emoji: '💼', description: '회사의 중추. 없으면 돌아가긴 하는데 삐걱거림' };
  if (score <= 420) return { title: '핵심 인재', emoji: '⭐', description: '헤드헌터 전화 올 때 안 받는 척 하세요' };
  return { title: '전설의 S급', emoji: '👑', description: '연봉 부르는 게 값. 회사가 당신을 면접봐야 함' };
}

function formatWorth(score: number): string {
  const manwon = score * 15;
  return manwon.toLocaleString('ko-KR');
}

function getCategoryScores(result: QuizResult) {
  const categories: Record<string, { total: number; max: number }> = {
    자기관리: { total: 0, max: 0 },
    업무능력: { total: 0, max: 0 },
    사회성: { total: 0, max: 0 },
    재테크감각: { total: 0, max: 0 },
    성장가능성: { total: 0, max: 0 },
  };

  result.answers.forEach(({ questionId, optionIndex }) => {
    const q = questions.find((qq) => qq.id === questionId);
    if (!q) return;
    const cat = q.category;
    if (categories[cat]) {
      categories[cat].total += q.options[optionIndex].value;
      const maxVal = Math.max(...q.options.map((o) => o.value));
      categories[cat].max += maxVal;
    }
  });

  return categories;
}

function getStars(ratio: number): string {
  const filled = Math.round(ratio * 5);
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  const [opacity, setOpacity] = useState(0);
  const { title, emoji, description } = getTitle(result.totalWorth);
  const categories = getCategoryScores(result);
  const worthDisplay = formatWorth(result.totalWorth);

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    const shareText = `나의 몸값은 ₩${worthDisplay}만원! ${title} ${emoji} — 몸값 계산기에서 확인해보세요`;
    if (navigator.share) {
      try {
        await navigator.share({ title: '몸값 계산기 결과', text: shareText });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('결과가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div
      className="min-h-screen px-5 py-8"
      style={{
        backgroundColor: '#f8f9fc',
        opacity,
        transition: 'opacity 600ms ease-out',
      }}
    >
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <h2 className="text-lg font-semibold text-center mb-6" style={{ color: '#1a1d29' }}>
          당신의 몸값은?
        </h2>

        {/* Worth card with gradient background */}
        <div
          className="rounded-xl p-6 text-center mb-6"
          style={{
            background: 'linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <p
            className="text-4xl font-bold text-white mb-1"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '56px', lineHeight: '1.2' }}
          >
            ₩ {worthDisplay}
            <span className="text-lg font-semibold ml-1" style={{ fontFamily: 'Pretendard Variable, sans-serif' }}>
              만원
            </span>
          </p>
          <p className="text-sm text-white" style={{ opacity: 0.8 }}>
            예상 연봉
          </p>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-2 block">{emoji}</span>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#1a1d29' }}>
            {title}
          </h3>
          <p className="text-sm" style={{ color: '#6b7084' }}>
            {description}
          </p>
        </div>

        {/* Category breakdown */}
        <div
          className="rounded-xl border p-5 mb-8"
          style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
        >
          <h4 className="text-sm font-semibold mb-4" style={{ color: '#1a1d29' }}>
            분야별 평가
          </h4>
          <div className="space-y-3">
            {Object.entries(categories).map(([cat, { total, max }]) => {
              const ratio = max > 0 ? total / max : 0;
              return (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#1a1d29' }}>
                    {cat}
                  </span>
                  <span className="text-sm" style={{ color: '#4f46e5', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {getStars(ratio)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-3.5 rounded-lg text-white font-semibold text-base"
            style={{ backgroundColor: '#4f46e5', minHeight: '48px' }}
          >
            결과 공유하기
          </button>
          <button
            onClick={onRestart}
            className="w-full py-3.5 rounded-lg font-semibold text-base border"
            style={{ color: '#4f46e5', borderColor: '#4f46e5', backgroundColor: 'transparent', minHeight: '48px' }}
          >
            다시 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
