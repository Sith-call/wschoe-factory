import { useState } from 'react';
import { Category } from '../types';
import { getStats, getUnansweredQuestions, getAnsweredQuestions } from '../store';
import { CATEGORIES, CATEGORY_ICONS } from '../data/questions';

interface Props {
  onStart: (category: Category | '전체') => void;
  onShowResults: () => void;
}

export default function HomeScreen({ onStart, onShowResults }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | '전체'>('전체');
  const stats = getStats();
  const unanswered = getUnansweredQuestions(selectedCategory);
  const answered = getAnsweredQuestions();
  const hasAnswered = answered.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-particle pointer-events-none"
          style={{
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            background: i % 2 === 0 ? '#fbbc00' : '#6366f1',
            opacity: 0.2,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Title */}
      <div className="animate-fade-in-down text-center mb-2">
        <h1 className="font-headline text-5xl font-extrabold text-gradient mb-3">
          밸런스 게임
        </h1>
        <p className="text-on-surface-variant text-lg">당신의 선택은?</p>
      </div>

      {/* VS Graphic */}
      <div className="my-10 animate-scale-in">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full animate-pulse-custom"
            style={{
              background: 'radial-gradient(circle, rgba(251,188,0,0.15) 0%, transparent 70%)',
            }}
          />
          <div className="absolute inset-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
            }}
          />
          <span
            className="text-6xl font-headline font-extrabold animate-neon-glow"
            style={{ color: '#fbbc00' }}
          >
            VS
          </span>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in-up max-w-sm">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = cat === '전체'
            ? getUnansweredQuestions('전체').length
            : getUnansweredQuestions(cat as Category).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category | '전체')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {CATEGORY_ICONS[cat]}
              </span>
              {cat}
              <span className={`text-xs ${isActive ? 'text-on-primary/70' : 'text-outline'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={() => onStart(selectedCategory)}
        disabled={unanswered.length === 0}
        className="btn-gradient text-on-primary font-bold text-lg px-10 py-4 rounded-2xl
          shadow-lg shadow-primary/20 hover:shadow-primary/40
          transition-all hover:scale-105 active:scale-95
          disabled:opacity-40 disabled:hover:scale-100 animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        {unanswered.length === 0 ? '모든 질문 완료!' : '시작하기'}
      </button>

      {/* Stats */}
      {hasAnswered && (
        <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <p className="text-on-surface-variant text-sm mb-3">
            <span className="text-primary font-bold">{stats.totalAnswered}</span>개의 선택 완료
          </p>
          <button
            onClick={onShowResults}
            className="text-sm text-secondary underline underline-offset-2 hover:text-primary transition-colors"
          >
            결과 보기
          </button>
        </div>
      )}

      {/* Reset if all done */}
      {unanswered.length === 0 && hasAnswered && (
        <p className="mt-2 text-xs text-outline animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          결과 화면에서 다시 시작할 수 있어요
        </p>
      )}
    </div>
  );
}
