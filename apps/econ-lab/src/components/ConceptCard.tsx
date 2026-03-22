import React from 'react';
import { Concept } from '../types';

interface ConceptCardProps {
  concept: Concept;
  completionPercent?: number;
  onClick: () => void;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ concept, completionPercent = 0, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex-none w-72 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] group hover:shadow-md transition-shadow cursor-pointer text-left"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="font-['Space_Grotesk'] text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">
          Research File
        </span>
        <span className="font-label text-[10px] bg-secondary-container/30 text-secondary font-bold px-2 py-1 rounded">
          {completionPercent}%
        </span>
      </div>
      <h4 className="font-headline font-bold text-xl text-primary mb-2">{concept.title}</h4>
      <p className="text-sm text-on-surface-variant font-medium">{concept.description.slice(0, 40)}...</p>
    </div>
  );
};
