import React from 'react';
import { SCORE_LABELS } from '../types';

interface ScoreSelectorProps {
  value: number | null;
  onChange: (score: 1 | 2 | 3 | 4 | 5) => void;
}

const SCORE_COLORS: Record<number, string> = {
  1: '#e8a0a0',
  2: '#e8c4a0',
  3: '#e8dca0',
  4: '#a0d4a0',
  5: '#7ac27a',
};

export function ScoreSelector({ value, onChange }: ScoreSelectorProps) {
  return (
    <div className="flex justify-between gap-2">
      {([1, 2, 3, 4, 5] as const).map(score => {
        const isSelected = value === score;
        return (
          <button
            key={score}
            onClick={() => onChange(score)}
            className="flex flex-col items-center gap-1"
            aria-label={`${score}점 ${SCORE_LABELS[score]}`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-number text-xl transition-transform duration-100 ${
                isSelected ? 'text-white scale-105' : 'border border-sd-border bg-white text-sd-text-secondary'
              }`}
              style={isSelected ? { backgroundColor: SCORE_COLORS[score] } : undefined}
            >
              {score}
            </div>
            <span className="font-body text-[0.8125rem] text-sd-text-secondary">
              {SCORE_LABELS[score]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
