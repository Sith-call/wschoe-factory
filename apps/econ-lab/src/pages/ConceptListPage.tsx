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

  let fileNumber = 1;

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-10">
      <header className="space-y-2">
        <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary tracking-[0.2em] uppercase">
          Research Archive
        </span>
        <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight text-left">
          아카이브
        </h2>
        <p className="text-on-surface-variant text-sm text-left">
          연구 파일 {concepts.length}건
        </p>
      </header>

      {groupedConcepts.map(group => (
        <section key={group.category} className="space-y-4">
          <h3 className="font-headline font-bold text-base text-primary flex items-center gap-2 text-left">
            <span className="w-1.5 h-5 bg-secondary"></span>
            {group.category}
          </h3>
          <div className="space-y-3">
            {group.items.map((concept, idx) => {
              const isViewed = progress.conceptsViewed.includes(concept.id);
              const isExperimented = progress.experimentsCompleted.includes(concept.id);
              const difficulty = conceptDifficulty[concept.id] || '입문';
              const diffBadgeClass = difficulty === '입문'
                ? 'bg-[#1a6b50]/10 text-[#1a6b50]'
                : difficulty === '중급'
                ? 'bg-[#d4a24e]/10 text-[#d4a24e]'
                : 'bg-[#ba1a1a]/10 text-[#ba1a1a]';
              const currentFileNum = fileNumber++;

              return (
                <div
                  key={concept.id}
                  onClick={() => onNavigateConcept(concept.id)}
                  className={`p-5 bg-surface-container-lowest rounded-lg border cursor-pointer hover:shadow-md transition-shadow text-left ${
                    idx === 0 ? 'border-secondary/20 shadow-sm' : 'border-outline-variant/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-['Space_Grotesk'] text-[10px] font-bold text-on-surface-variant/40 tracking-widest">
                          FILE-{String(currentFileNum).padStart(3, '0')}
                        </span>
                        <span className={`font-label text-[10px] font-bold px-2 py-0.5 rounded ${diffBadgeClass}`}>
                          {difficulty}
                        </span>
                        {isExperimented ? (
                          <span className="font-label text-[10px] bg-secondary-container/30 text-secondary font-bold px-2 py-0.5 rounded">
                            COMPLETED
                          </span>
                        ) : isViewed ? (
                          <span className="font-label text-[10px] bg-surface-container text-on-surface-variant font-bold px-2 py-0.5 rounded">
                            VIEWED
                          </span>
                        ) : null}
                      </div>
                      <h3 className="font-bold text-primary font-body text-base">{concept.title}</h3>
                      <p className="text-sm text-on-surface-variant mt-1 leading-snug">
                        {concept.description.slice(0, 70)}...
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/30 text-lg mt-1">
                      chevron_right
                    </span>
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
