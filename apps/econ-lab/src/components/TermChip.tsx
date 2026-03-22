import React, { useState } from 'react';
import { KeyTerm } from '../types';

interface TermChipProps {
  term: KeyTerm;
}

export const TermChip: React.FC<TermChipProps> = ({ term }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        onClick={() => setShowTooltip(!showTooltip)}
        className="px-4 py-2 bg-surface-container-high rounded-full font-body text-sm font-semibold text-primary transition-colors hover:bg-secondary-container/20 cursor-pointer"
      >
        {term.term}
      </span>
      {showTooltip && (
        <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary-container text-on-primary-container text-xs p-3 rounded-lg shadow-lg min-w-[200px] max-w-[280px]">
          <p className="font-body font-semibold text-white text-sm mb-1">{term.term}</p>
          <p className="font-body text-on-primary-container text-xs leading-relaxed">{term.definition}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-primary-container rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
};
