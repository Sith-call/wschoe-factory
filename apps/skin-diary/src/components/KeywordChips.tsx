import React from 'react';
import type { SkinKeyword } from '../types';
import { ALL_KEYWORDS, KEYWORD_LABELS } from '../types';

interface KeywordChipsProps {
  selected: SkinKeyword[];
  onChange: (keywords: SkinKeyword[]) => void;
}

export function KeywordChips({ selected, onChange }: KeywordChipsProps) {
  const toggle = (keyword: SkinKeyword) => {
    if (selected.includes(keyword)) {
      onChange(selected.filter(k => k !== keyword));
    } else {
      onChange([...selected, keyword]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_KEYWORDS.map(keyword => {
        const isSelected = selected.includes(keyword);
        return (
          <button
            key={keyword}
            onClick={() => toggle(keyword)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-body ${
              isSelected
                ? 'border border-sd-primary text-white bg-sd-primary'
                : 'border border-sd-border text-sd-text-secondary bg-white'
            }`}
            aria-label={KEYWORD_LABELS[keyword]}
            aria-pressed={isSelected}
          >
            {KEYWORD_LABELS[keyword]}
          </button>
        );
      })}
    </div>
  );
}
