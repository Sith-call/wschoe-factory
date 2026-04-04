import React from 'react';
import { FlaskConical, Check } from 'lucide-react';
import { AppState, Term, Category, Screen } from '../types';
import { getProgress } from '../store';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  state: AppState;
  terms: Term[];
  categories: Category[];
  navigate: (s: Screen) => void;
}

export function LabListScreen({ state, terms, categories, navigate }: Props) {
  // Get all terms that have labs (hasLab: true in data OR have a lab component)
  const labTerms = terms.filter(t => t.hasLab);

  // Group by category
  const grouped = categories
    .sort((a, b) => a.order - b.order)
    .map(cat => ({
      category: cat,
      labs: labTerms.filter(t => t.category === cat.id),
    }))
    .filter(g => g.labs.length > 0);

  const totalLabs = labTerms.length;
  const completedLabs = labTerms.filter(t => getProgress(state, t.id).labCompleted).length;

  return (
    <div className="pb-24 px-4 max-w-screen-md mx-auto">
      <div className="pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">실험실</h1>
        <p className="text-sm text-ink-secondary mt-1">
          인터랙티브 시뮬레이션으로 경제 개념을 체험하세요
        </p>
      </div>

      {/* Progress */}
      <div className="bg-surface-card border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-secondary">실험 완료</span>
          <span className="font-display font-semibold text-ink">{completedLabs}/{totalLabs}</span>
        </div>
        <div className="w-full h-2 bg-stone-100 rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${totalLabs > 0 ? (completedLabs / totalLabs) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Lab list grouped by category */}
      {grouped.map(({ category, labs }) => (
        <div key={category.id} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CategoryIcon name={category.icon} size={16} className="text-ink-secondary" />
            <h2 className="font-display text-sm font-semibold text-ink-secondary uppercase tracking-wider">
              {category.name}
            </h2>
          </div>

          <div className="bg-surface-card border border-border rounded-lg divide-y divide-border">
            {labs.map(term => {
              const p = getProgress(state, term.id);
              const done = p.labCompleted;

              return (
                <button
                  key={term.id}
                  onClick={() => navigate({ type: 'lab', termId: term.id })}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-stone-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    done ? 'bg-green-50' : 'bg-primary-light'
                  }`}>
                    {done ? (
                      <Check size={16} strokeWidth={2} className="text-success" />
                    ) : (
                      <FlaskConical size={16} strokeWidth={1.5} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-ink">{term.korean}</p>
                    <p className="text-sm text-ink-secondary truncate">{term.english}</p>
                  </div>
                  {done && (
                    <span className="text-xs text-success font-medium">완료</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
