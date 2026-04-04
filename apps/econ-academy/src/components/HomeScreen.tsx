import React from 'react';
import { Search, BookOpen, ChevronRight, Flame, RotateCcw } from 'lucide-react';
import { AppState, Term, Screen } from '../types';
import { getProgress, getReviewIds, getMastery, catProgress } from '../store';
import { MasteryIcon } from './MasteryIcon';

interface HomeScreenProps {
  state: AppState;
  terms: Term[];
  navigate: (s: Screen) => void;
}

export function HomeScreen({ state, terms, navigate }: HomeScreenProps) {
  const allIds = terms.map((t) => t.id);
  const progress = catProgress(state, allIds);
  const reviewIds = getReviewIds(state);
  const percentage = terms.length > 0 ? Math.round((progress.master / terms.length) * 100) : 0;

  const nextTerm = terms.find((t) => {
    const p = getProgress(state, t.id);
    return !p.readAt && (t.prerequisites.length === 0 || t.prerequisites.every((pid) => getProgress(state, pid).readAt));
  });

  const reviewTerms = reviewIds
    .map((id) => terms.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 5) as Term[];

  const recentTerms = Object.values(state.progress)
    .filter((p) => p.readAt)
    .sort((a, b) => (b.lastReviewAt ?? '').localeCompare(a.lastReviewAt ?? ''))
    .slice(0, 5)
    .map((p) => terms.find((t) => t.id === p.termId))
    .filter(Boolean) as Term[];

  const isEmpty = progress.read === 0;

  return (
    <div className="pb-24 px-4 max-w-screen-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">경제 아카데미</h1>
        <button
          onClick={() => navigate({ type: 'search' })}
          className="p-2 text-ink-secondary"
        >
          <Search size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-surface-card border border-border rounded-lg p-4 mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-display text-lg font-semibold text-ink">
            전체 진도 {progress.master}/{terms.length}
          </span>
          <span className="text-sm text-ink-secondary">{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-stone-100 rounded-full mb-3">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex gap-4 text-sm text-ink-secondary">
          <span>읽기 {progress.read}</span>
          <span>퀴즈 {progress.quiz}</span>
          <span>마스터 {progress.master}</span>
        </div>
        {state.streak > 0 && (
          <div className="flex items-center gap-1 mt-2 text-sm text-secondary">
            <Flame size={16} strokeWidth={1.5} />
            <span>{state.streak}일 연속 학습</span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {isEmpty && (
        <div className="bg-surface-card border border-border rounded-lg p-8 mb-4 text-center">
          <BookOpen size={32} strokeWidth={1.5} className="text-ink-disabled mx-auto mb-3" />
          <p className="text-base text-ink-secondary mb-4">아직 학습한 용어가 없습니다</p>
          <button
            onClick={() => {
              if (nextTerm) navigate({ type: 'termCard', termId: nextTerm.id });
              else navigate({ type: 'categories' });
            }}
            className="bg-primary text-white font-medium px-5 py-2.5 rounded-lg hover:bg-primary-dark"
          >
            첫 용어 학습하기
          </button>
        </div>
      )}

      {/* Next Recommended */}
      {!isEmpty && nextTerm && (
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-ink mb-2">다음 학습 추천</h2>
          <button
            onClick={() => navigate({ type: 'termCard', termId: nextTerm.id })}
            className="w-full bg-surface-card border border-border rounded-lg p-4 text-left flex items-center justify-between"
          >
            <div>
              <p className="text-base font-medium text-ink">{nextTerm.korean}</p>
              <p className="text-sm text-ink-secondary mt-0.5">{nextTerm.english}</p>
            </div>
            <ChevronRight size={20} strokeWidth={1.5} className="text-ink-secondary" />
          </button>
        </div>
      )}

      {/* Review Due */}
      {reviewTerms.length > 0 && (
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-ink mb-2 flex items-center gap-2">
            <RotateCcw size={18} strokeWidth={1.5} className="text-secondary" />
            오늘의 복습
          </h2>
          <div className="bg-surface-card border border-border rounded-lg divide-y divide-border">
            {reviewTerms.map((term) => {
              const p = getProgress(state, term.id);
              const mastery = getMastery(p, term.hasLab);
              return (
                <button
                  key={term.id}
                  onClick={() => navigate({ type: 'termCard', termId: term.id })}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <MasteryIcon level={mastery} size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-ink truncate">{term.korean}</p>
                  </div>
                  <ChevronRight size={16} strokeWidth={1.5} className="text-ink-disabled" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Study */}
      {recentTerms.length > 0 && (
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-ink mb-2">최근 학습</h2>
          <div className="bg-surface-card border border-border rounded-lg divide-y divide-border">
            {recentTerms.map((term) => {
              const p = getProgress(state, term.id);
              const mastery = getMastery(p, term.hasLab);
              return (
                <button
                  key={term.id}
                  onClick={() => navigate({ type: 'termCard', termId: term.id })}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <MasteryIcon level={mastery} size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-ink truncate">{term.korean}</p>
                    <p className="text-sm text-ink-secondary truncate">{term.english}</p>
                  </div>
                  <ChevronRight size={16} strokeWidth={1.5} className="text-ink-disabled" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
