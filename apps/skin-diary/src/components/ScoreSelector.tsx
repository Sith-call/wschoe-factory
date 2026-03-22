import React from 'react';
import { SCORE_LABELS } from '../types';

interface Props {
  value: number | null;
  onChange: (score: 1 | 2 | 3 | 4 | 5) => void;
}

export function ScoreSelector({ value, onChange }: Props) {
  return (
    <div className="flex justify-between items-end px-2">
      {[1, 2, 3, 4, 5].map(score => {
        const isSelected = value === score;
        return (
          <button
            key={score}
            onClick={() => onChange(score as 1 | 2 | 3 | 4 | 5)}
            className={`flex flex-col items-center ${isSelected ? 'gap-3' : 'gap-2 group'}`}
          >
            {isSelected && (
              <span className="text-[10px] font-bold text-primary tracking-tighter">
                {SCORE_LABELS[score]}
              </span>
            )}
            <div
              className={`rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? 'w-16 h-16 bg-primary-container shadow-lg shadow-primary-container/20 scale-110'
                  : 'w-12 h-12 bg-surface-container-low border border-outline-variant/15 group-active:scale-90'
              }`}
            >
              <span
                className={`font-headline ${
                  isSelected
                    ? 'text-2xl text-white'
                    : 'text-lg text-on-surface-variant'
                }`}
              >
                {score}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
