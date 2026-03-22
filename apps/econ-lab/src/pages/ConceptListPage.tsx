import React from 'react';
import { concepts, conceptDifficulty } from '../data/concepts';
import { useProgress } from '../hooks/useProgress';
import { ConceptCategory } from '../types';

interface ConceptListPageProps {
  onNavigateConcept: (conceptId: string) => void;
}

const categories: ConceptCategory[] = ['미시경제', '거시경제', '국제경제', '재정/통화정책'];

export const ConceptListPage: React.FC<ConceptListPageProps> = ({ onNavigateConcept }) => {
  const { progress } = useProgress();

  const groupedConcepts = categories
    .map(cat => ({
      category: cat,
      items: concepts.filter(c => c.category === cat),
    }))
    .filter(g => g.items.length > 0);

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-10">
      <header className="space-y-2">
        <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary tracking-[0.2em] uppercase">
          Economics Glossary
        </span>
        <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight">
          경제 용어 사전
        </h2>
      </header>

      {groupedConcepts.map(group => (
        <section key={group.category} className="space-y-6">
          <h3 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
            <span className="w-1.5 h-6 bg-secondary"></span>
            {group.category}
          </h3>
          <div className="space-y-4">
            {group.items.map(concept => {
              const isViewed = progress.conceptsViewed.includes(concept.id);
              const isExperimented = progress.experimentsCompleted.includes(concept.id);
              const difficulty = conceptDifficulty[concept.id] || '입문';
              const diffBadgeClass = difficulty === '입문'
                ? 'bg-[#1a6b50]/10 text-[#1a6b50]'
                : difficulty === '중급'
                ? 'bg-[#d4a24e]/10 text-[#d4a24e]'
                : 'bg-[#ba1a1a]/10 text-[#ba1a1a]';

              return (
                <div
                  key={concept.id}
                  onClick={() => onNavigateConcept(concept.id)}
                  className="flex items-start gap-4 p-5 bg-surface-container-lowest rounded-lg border border-outline-variant/5 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary-container">
                      {concept.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-primary font-body">{concept.title}</h3>
                        <span className={`font-label text-[10px] font-bold px-2 py-0.5 rounded ${diffBadgeClass}`}>
                          {difficulty}
                        </span>
                      </div>
                      {isExperimented ? (
                        <span className="font-label text-[10px] bg-secondary-container/30 text-secondary font-bold px-2 py-1 rounded">
                          COMPLETED
                        </span>
                      ) : isViewed ? (
                        <span className="font-label text-[10px] bg-surface-container text-on-surface-variant font-bold px-2 py-1 rounded">
                          VIEWED
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-on-surface-variant mt-1 leading-snug">
                      {concept.description.slice(0, 60)}...
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
};
