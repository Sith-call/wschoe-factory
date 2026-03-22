import React, { useEffect } from 'react';
import { Concept } from '../types';
import { TermChip } from '../components/TermChip';
import { concepts } from '../data/concepts';
import { useProgress } from '../hooks/useProgress';

interface ConceptDetailPageProps {
  concept: Concept;
  onBack: () => void;
  onNavigateLab: (conceptId: string) => void;
  onNavigateConcept: (conceptId: string) => void;
}

export const ConceptDetailPage: React.FC<ConceptDetailPageProps> = ({
  concept,
  onBack,
  onNavigateLab,
  onNavigateConcept,
}) => {
  const { markViewed } = useProgress();

  useEffect(() => {
    markViewed(concept.id);
  }, [concept.id, markViewed]);

  const relatedConcepts = concept.relatedConceptIds
    .map(id => concepts.find(c => c.id === id))
    .filter(Boolean);

  return (
    <>
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-[#fbf9f6] dark:bg-[#040d1b] transition-colors">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="active:scale-95 duration-200 hover:bg-[#f5f3f0]/50 dark:hover:bg-[#1a2332]/50 transition-colors p-1">
              <span className="material-symbols-outlined text-[#1a2332] dark:text-[#fbf9f6]">arrow_back</span>
            </button>
            <h1 className="font-['Epilogue'] font-extrabold text-2xl tracking-tight text-[#1a2332] dark:text-[#fbf9f6]">
              {concept.title}
            </h1>
          </div>
          <span className="font-['Manrope'] font-semibold text-[11px] px-3 py-1 border border-secondary text-secondary rounded-full">
            {concept.category}
          </span>
        </div>
      </header>

      <main className="max-w-[430px] mx-auto pb-32 px-6 pt-4 space-y-10">
        {/* Card 1: Core Concept */}
        <section className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_20px_40px_rgba(27,28,26,0.03)] border border-outline-variant/10">
          <h2 className="font-headline font-bold text-lg text-primary mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-secondary"></span>
            핵심 개념
          </h2>
          <p className="font-body text-on-surface-variant leading-relaxed text-base">
            {concept.coreExplanation}
          </p>
        </section>

        {/* Visual Section: Supply/Demand Curve (static preview) */}
        <section className="space-y-4">
          <div className="bg-white rounded-lg p-8 border border-outline-variant/15 flex flex-col items-center justify-center relative aspect-square overflow-hidden shadow-sm">
            {/* Grid Lines Background */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(#1a2332 1px, transparent 1px), linear-gradient(90deg, #1a2332 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <div className="relative w-full h-full border-l-2 border-b-2 border-primary-container/20">
              {/* Price Axis Label */}
              <span className="absolute -left-8 top-0 font-label text-xs font-bold text-on-surface-variant">가격(P)</span>
              {/* Quantity Axis Label */}
              <span className="absolute -right-2 -bottom-6 font-label text-xs font-bold text-on-surface-variant">수량(Q)</span>
              {/* Supply Curve (S) */}
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                <line stroke="#040d1b" strokeWidth="2.5" x1="10%" x2="90%" y1="90%" y2="10%" />
                <text className="font-label text-[10px] font-bold" fill="#040d1b" x="85%" y="5%">
                  공급곡선(S)
                </text>
              </svg>
              {/* Demand Curve (D) */}
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                <line stroke="#040d1b" strokeWidth="2.5" x1="10%" x2="90%" y1="10%" y2="90%" />
                <text className="font-label text-[10px] font-bold" fill="#040d1b" x="85%" y="95%">
                  수요곡선(D)
                </text>
              </svg>
              {/* Equilibrium Point (E) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-3 h-3 bg-secondary rounded-full border-2 border-white ring-4 ring-secondary/10"></div>
                <span className="font-label text-[11px] font-bold text-secondary mt-1">균형점(E)</span>
              </div>
              {/* Dashed Lines to Axes */}
              <div className="absolute top-1/2 left-0 right-1/2 h-[1px] border-t border-dashed border-outline-variant"></div>
              <div className="absolute top-1/2 left-1/2 bottom-0 w-[1px] border-l border-dashed border-outline-variant"></div>
            </div>
          </div>
          <p className="text-center font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
            Static Curator Diagram Model 1.0
          </p>
        </section>

        {/* Section 2: Key Terms */}
        <section>
          <h2 className="font-headline font-bold text-lg text-primary mb-6">알아야 할 용어</h2>
          <div className="flex flex-wrap gap-2">
            {concept.keyTerms.map(term => (
              <TermChip key={term.term} term={term} />
            ))}
          </div>
        </section>

        {/* Section 3: Real Life Examples */}
        <section>
          <h2 className="font-headline font-bold text-lg text-primary mb-6">실생활 예시</h2>
          <div className="space-y-4">
            {concept.realWorldExamples.map((example, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-surface-container-lowest rounded-lg border border-outline-variant/5">
                <div className="w-12 h-12 rounded bg-primary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary-container">{example.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary font-body">{example.title}</h3>
                  <p className="text-sm text-on-surface-variant mt-1 leading-snug">{example.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <button
          onClick={() => onNavigateLab(concept.id)}
          className="w-full bg-[#d4a24e] hover:bg-secondary text-white font-headline font-extrabold py-5 rounded-lg flex items-center justify-center gap-3 shadow-lg shadow-secondary/20 transition-all active:translate-y-0.5"
        >
          직접 실험해보기
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        {/* Section 4: Related Concepts */}
        {relatedConcepts.length > 0 && (
          <section>
            <h2 className="font-headline font-bold text-lg text-primary mb-4">연관 개념</h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 -mx-2 px-2">
              {relatedConcepts.map((related, i) => (
                <div
                  key={related!.id}
                  onClick={() => onNavigateConcept(related!.id)}
                  className="flex-shrink-0 w-32 aspect-[3/4] bg-primary-container rounded-lg p-4 flex flex-col justify-end cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <span className="font-label text-[10px] text-secondary-container font-bold mb-1 uppercase tracking-tighter">
                    Related {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="font-body font-bold text-white text-sm">{related!.title}</h4>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
};
