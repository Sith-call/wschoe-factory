import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { AppState, Term, Screen } from '../types';
import { getProgress, getMastery } from '../store';
import { MasteryIcon } from './MasteryIcon';

interface SearchScreenProps {
  state: AppState;
  terms: Term[];
  navigate: (s: Screen) => void;
}

export function SearchScreen({ state, terms, navigate }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length > 0
    ? terms.filter(
        (t) =>
          t.korean.toLowerCase().includes(trimmed) ||
          t.english.toLowerCase().includes(trimmed) ||
          t.definition.toLowerCase().includes(trimmed)
      )
    : [];

  return (
    <div className="pb-24 px-4 max-w-screen-md mx-auto">
      {/* Header */}
      <div className="pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ type: 'home' })}
            className="p-1 text-ink-secondary shrink-0"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>
          <div className="flex-1 relative">
            <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-disabled" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="용어 검색..."
              className="w-full bg-surface-card border border-border rounded-md pl-9 pr-3 py-2.5 text-base text-ink placeholder:text-ink-disabled focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {trimmed.length > 0 && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-base text-ink-secondary">검색 결과가 없습니다</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-surface-card border border-border rounded-lg divide-y divide-border">
          {results.map((term) => {
            const p = getProgress(state, term.id);
            const mastery = getMastery(p, term.hasLab);

            return (
              <button
                key={term.id}
                onClick={() => navigate({ type: 'termCard', termId: term.id })}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <MasteryIcon level={mastery} size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-ink truncate">{term.korean}</p>
                  <p className="text-sm text-ink-secondary mt-0.5 truncate">{term.definition}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {trimmed.length === 0 && (
        <div className="text-center py-12">
          <Search size={32} strokeWidth={1.5} className="text-ink-disabled mx-auto mb-3" />
          <p className="text-base text-ink-secondary">한국어, 영어, 정의로 검색할 수 있습니다</p>
        </div>
      )}
    </div>
  );
}
