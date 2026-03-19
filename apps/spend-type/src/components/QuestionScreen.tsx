import { useState } from 'react';
import { questions, type SpendType } from '../data';

interface QuestionScreenProps {
  onComplete: (scores: Record<SpendType, number>) => void;
}

export default function QuestionScreen({ onComplete }: QuestionScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<SpendType, number>>({
    flex: 0, value: 0, aesthetic: 0, analyst: 0,
    giver: 0, planner: 0, explorer: 0, stress: 0,
  });
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
  };

  const handleNext = () => {
    if (selectedIdx === null) return;
    const optionScores = question.options[selectedIdx].scores;
    const newScores = { ...scores };
    for (const [type, value] of Object.entries(optionScores)) {
      newScores[type as SpendType] += value!;
    }
    setScores(newScores);
    setSelectedIdx(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newScores);
    }
  };

  // All inline styles to match Stitch HTML exactly
  return (
    <div style={{
      width: '100%', minHeight: '100vh', backgroundColor: '#ffffff',
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
    }}>
      {/* Subtle top gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: 256,
        background: 'linear-gradient(to bottom, rgba(147,13,242,0.05), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Bottom decoration */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0, width: 128, height: 128,
        background: 'rgba(147,13,242,0.05)', borderTopLeftRadius: 9999,
        pointerEvents: 'none',
      }} />

      {/* Top Navigation — Stitch: p-6 pb-2, justify-between */}
      <div style={{
        position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center',
        padding: '24px 24px 8px', justifyContent: 'space-between',
      }}>
        <button style={{
          padding: 8, borderRadius: 9999, border: 'none', backgroundColor: 'transparent',
          cursor: 'pointer', color: '#0f172a', display: 'flex',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: '#0f172a' }}>
          소비 성향 테스트
        </h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Progress Section — Stitch: px-6 pt-4 */}
      <div style={{ position: 'relative', zIndex: 10, padding: '16px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>진행률</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#930df2' }}>{currentIndex + 1}/{questions.length}</span>
        </div>
        <div style={{ height: 8, width: '100%', backgroundColor: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 9999, transition: 'width 0.5s ease-out',
            width: `${progress}%`,
            background: 'linear-gradient(to right, #930df2, #b366ff)',
          }} />
        </div>
      </div>

      {/* Question Section — Stitch: px-6 pt-12 pb-8 */}
      <div style={{
        position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '48px 24px 32px',
      }}>
        {/* Q badge — Stitch: w-12 h-12 */}
        <div style={{
          width: 48, height: 48, backgroundColor: '#930df2', borderRadius: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(147,13,242,0.3)', marginBottom: 24,
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Q{question.id}</span>
        </div>

        {/* Question text — Stitch: text-2xl font-bold */}
        <h2 style={{
          fontSize: 24, fontWeight: 700, textAlign: 'center', lineHeight: 1.3,
          color: '#0f172a',
        }}>
          {question.text}
        </h2>
      </div>

      {/* Answer Options — Stitch: px-6, gap-3, grow */}
      <div style={{
        position: 'relative', zIndex: 10, padding: '0 24px',
        display: 'flex', flexDirection: 'column', gap: 12, flexGrow: 1,
      }}>
        {question.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 20, backgroundColor: isSelected ? 'rgba(147,13,242,0.05)' : '#ffffff',
                border: isSelected ? '2px solid #930df2' : '1px solid #e2e8f0',
                borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: '#0f172a', flex: 1, marginRight: 12 }}>
                {option.text}
              </span>
              {/* Radio circle — Stitch: w-6 h-6 rounded-full */}
              <div style={{
                width: 24, height: 24, borderRadius: 9999, flexShrink: 0,
                border: `2px solid ${isSelected ? '#930df2' : '#cbd5e1'}`,
                backgroundColor: isSelected ? '#930df2' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isSelected && (
                  <div style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: '#ffffff' }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Button — Stitch: p-6 pb-10 */}
      <div style={{ position: 'relative', zIndex: 10, padding: '24px 24px 40px' }}>
        <button
          onClick={handleNext}
          disabled={selectedIdx === null}
          style={{
            width: '100%', padding: '16px 0', borderRadius: 16, border: 'none',
            backgroundColor: selectedIdx !== null ? '#930df2' : 'rgba(147,13,242,0.4)',
            color: '#ffffff', fontWeight: 700, fontSize: 16, cursor: selectedIdx !== null ? 'pointer' : 'default',
            boxShadow: selectedIdx !== null ? '0 10px 25px rgba(147,13,242,0.2)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {currentIndex < questions.length - 1 ? '다음 질문' : '결과 보기'}
        </button>
      </div>
    </div>
  );
}
