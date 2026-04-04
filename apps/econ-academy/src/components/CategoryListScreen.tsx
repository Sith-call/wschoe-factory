import React from 'react';
import { Search, Lock, ChevronRight } from 'lucide-react';
import { AppState, Category, Term, Screen, CategoryId } from '../types';
import { catProgress, isCatUnlocked } from '../store';
import { CategoryIcon } from './CategoryIcon';

interface CategoryListScreenProps {
  state: AppState;
  categories: Category[];
  terms: Term[];
  navigate: (s: Screen) => void;
}

function getPrereqTermIds(categories: Category[], terms: Term[], prereqCats: CategoryId[]): string[][] {
  return prereqCats.map((catId) =>
    terms.filter((t) => t.category === catId).map((t) => t.id)
  );
}

export function CategoryListScreen({ state, categories, terms, navigate }: CategoryListScreenProps) {
  return (
    <div className="pb-24 px-4 max-w-screen-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">카테고리</h1>
        <button
          onClick={() => navigate({ type: 'search' })}
          className="p-2 text-ink-secondary"
        >
          <Search size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {categories
          .sort((a, b) => a.order - b.order)
          .map((cat) => {
            const catTerms = terms.filter((t) => t.category === cat.id);
            const catTermIds = catTerms.map((t) => t.id);
            const prereqTermIds = getPrereqTermIds(categories, terms, cat.prerequisiteCategories);
            const unlocked = isCatUnlocked(state, prereqTermIds);
            const progress = catProgress(state, catTermIds);
            const pct = catTerms.length > 0 ? Math.round((progress.read / catTerms.length) * 100) : 0;

            const prereqNames = cat.prerequisiteCategories
              .map((pid) => categories.find((c) => c.id === pid)?.name)
              .filter(Boolean);

            return (
              <button
                key={cat.id}
                onClick={() => navigate({ type: 'termList', categoryId: cat.id })}
                className="w-full text-left bg-surface-card border border-border rounded-lg p-4 flex items-start gap-3 cursor-pointer"
                style={{
                  borderLeftWidth: '3px',
                  borderLeftColor: '#0D9488',
                }}
              >
                <div className="mt-0.5">
                  <CategoryIcon name={cat.icon} size={24} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-ink-secondary font-display">{cat.order}.</span>
                    <span className="text-base font-medium text-ink">{cat.name}</span>
                  </div>
                  <p className="text-sm text-ink-secondary mt-0.5">{cat.description}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-ink-secondary mb-1">
                      <span>{progress.read}/{catTerms.length}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full">
                      <div
                        className="h-1.5 bg-primary rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} strokeWidth={1.5} className="text-ink-disabled mt-1" />
              </button>
            );
          })}
      </div>
    </div>
  );
}
