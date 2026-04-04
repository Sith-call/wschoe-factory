import React from 'react';
import { ArrowLeft, HelpCircle, FlaskConical, Lock } from 'lucide-react';
import { AppState, CategoryId, Category, Term, Screen } from '../types';
import { getProgress, getMastery, isTermUnlocked, catProgress } from '../store';
import { MasteryIcon } from './MasteryIcon';

interface TermListScreenProps {
  state: AppState;
  categoryId: CategoryId;
  categories: Category[];
  terms: Term[];
  navigate: (s: Screen) => void;
  goBack?: () => void;
}

function statusText(mastery: number, quizPassed: boolean, labCompleted: boolean, hasLab: boolean): string {
  if (mastery === 0) return '미학습';
  if (mastery === 1) return '읽기 완료';
  if (mastery === 2) return quizPassed ? (hasLab ? '퀴즈 통과' : '마스터') : '읽기 완료';
  return '마스터';
}

export function TermListScreen({ state, categoryId, categories, terms, navigate, goBack }: TermListScreenProps) {
  const category = categories.find((c) => c.id === categoryId);
  const catTerms = terms.filter((t) => t.category === categoryId);
  const progress = catProgress(state, catTerms.map((t) => t.id));

  if (!category) return null;

  return (
    <div className="pb-24 px-4 max-w-screen-md mx-auto">
      {/* Header */}
      <div className="pt-6 pb-4">
        <button
          onClick={() => goBack ? goBack() : navigate({ type: 'categories' })}
          className="flex items-center gap-1 text-sm text-primary font-medium mb-3"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          카테고리
        </button>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-ink">{category.name}</h1>
          <span className="text-sm text-ink-secondary">{progress.read}/{catTerms.length}</span>
        </div>
      </div>

      {/* Term List */}
      <div className="bg-surface-card border border-border rounded-lg divide-y divide-border">
        {catTerms.map((term) => {
          const p = getProgress(state, term.id);
          const mastery = getMastery(p, term.hasLab);
          const unlocked = isTermUnlocked(state, term.prerequisites);
          const status = statusText(mastery, p.quizPassed, p.labCompleted, term.hasLab);

          return (
            <button
              key={term.id}
              onClick={() => navigate({ type: 'termCard', termId: term.id })}
              className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
            >
              <MasteryIcon level={mastery} locked={false} size={24} />
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-ink">
                  {term.korean}
                </p>
                {true ? (
                  <p className="text-sm text-ink-secondary mt-0.5">{status}</p>
                ) : (
                  <p className="text-sm text-ink-secondary mt-0.5">{status}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {p.readAt && !p.quizPassed && (
                  <HelpCircle size={16} strokeWidth={1.5} className="text-secondary" />
                )}
                {term.hasLab && (
                  <FlaskConical size={16} strokeWidth={1.5} className={p.labCompleted ? 'text-success' : 'text-info'} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
