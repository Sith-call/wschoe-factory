import React from 'react';
import type { SkinKeyword } from '../types';
import { ALL_KEYWORDS, KEYWORD_LABELS } from '../types';

interface Props {
  selected: SkinKeyword[];
  onChange: (keywords: SkinKeyword[]) => void;
}

export function KeywordChips({ selected, onChange }: Props) {
  const toggle = (kw: SkinKeyword) => {
    if (selected.includes(kw)) {
      onChange(selected.filter(k => k !== kw));
    } else {
      onChange([...selected, kw]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {ALL_KEYWORDS.map(kw => {
        const isSelected = selected.includes(kw);
        return (
          <button
            key={kw}
            onClick={() => toggle(kw)}
            className={`px-5 py-2 rounded-full text-sm font-body transition-all active:scale-95 ${
              isSelected
                ? 'bg-primary text-white'
                : 'bg-surface-container-highest/50 text-on-surface-variant'
            }`}
          >
            {KEYWORD_LABELS[kw]}
          </button>
        );
      })}
    </div>
  );
}
