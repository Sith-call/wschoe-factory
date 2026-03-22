import React, { useEffect } from 'react';
import { Concept } from '../types';
import { TermChip } from '../components/TermChip';
import { QuizSection } from '../components/QuizSection';
import { concepts, conceptQuizzes, conceptDifficulty, conceptOneLiner, conceptNewsConnections } from '../data/concepts';
import { useProgress } from '../hooks/useProgress';

interface ConceptDetailPageProps {
  concept: Concept;
  onBack: () => void;
  onNavigateLab: (conceptId: string) => void;
  onNavigateConcept: (conceptId: string) => void;
}

const ConceptDiagram: React.FC<{ modelId: string; title: string }> = ({ modelId, title }) => {
  return (
    <div className="bg-white rounded-lg p-8 border border-outline-variant/15 flex flex-col items-center justify-center relative aspect-square overflow-hidden shadow-sm">
      {/* Grid Lines Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#1a2332 1px, transparent 1px), linear-gradient(90deg, #1a2332 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {modelId === 'supply-demand' && (
        <div className="relative w-full h-full border-l-2 border-b-2 border-primary-container/20">
          <span className="absolute -left-8 top-0 font-label text-xs font-bold text-on-surface-variant">가격(P)</span>
          <span className="absolute -right-2 -bottom-6 font-label text-xs font-bold text-on-surface-variant">수량(Q)</span>
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <line stroke="#040d1b" strokeWidth="2.5" x1="10%" x2="90%" y1="90%" y2="10%" />
            <text className="font-label text-[10px] font-bold" fill="#040d1b" x="85%" y="5%">S</text>
          </svg>
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <line stroke="#ba1a1a" strokeWidth="2.5" x1="10%" x2="90%" y1="10%" y2="90%" />
            <text className="font-label text-[10px] font-bold" fill="#ba1a1a" x="85%" y="95%">D</text>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-secondary rounded-full border-2 border-white ring-4 ring-secondary/10"></div>
            <span className="font-label text-[11px] font-bold text-secondary mt-1">균형점(E)</span>
          </div>
          <div className="absolute top-1/2 left-0 right-1/2 h-[1px] border-t border-dashed border-outline-variant"></div>
          <div className="absolute top-1/2 left-1/2 bottom-0 w-[1px] border-l border-dashed border-outline-variant"></div>
        </div>
      )}

      {modelId === 'elasticity' && (
        <div className="relative w-full h-full border-l-2 border-b-2 border-primary-container/20">
          <span className="absolute -left-8 top-0 font-label text-xs font-bold text-on-surface-variant">가격(P)</span>
          <span className="absolute -right-2 -bottom-6 font-label text-xs font-bold text-on-surface-variant">수량(Q)</span>
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <line stroke="#ba1a1a" strokeWidth="2.5" x1="40%" x2="55%" y1="10%" y2="90%" />
            <text className="font-label text-[10px] font-bold" fill="#ba1a1a" x="56%" y="92%">비탄력적</text>
            <line stroke="#1a6b50" strokeWidth="2.5" x1="10%" x2="90%" y1="25%" y2="75%" />
            <text className="font-label text-[10px] font-bold" fill="#1a6b50" x="75%" y="78%">탄력적</text>
          </svg>
          <div className="absolute top-[35%] left-[45%] flex flex-col items-center">
            <div className="w-3 h-3 bg-secondary rounded-full border-2 border-white ring-4 ring-secondary/10"></div>
          </div>
        </div>
      )}

      {modelId === 'gdp' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-3">
          <h3 className="font-headline font-bold text-sm text-primary mb-2">{title}</h3>
          <svg viewBox="0 0 300 200" className="w-full max-w-[280px]">
            <rect x="20" y="30" width="160" height="35" rx="4" fill="#ba1a1a" opacity="0.8" />
            <text x="30" y="53" fill="white" fontSize="12" fontWeight="bold">C (소비) 55%</text>
            <rect x="20" y="75" width="60" height="35" rx="4" fill="#1a2332" opacity="0.8" />
            <text x="30" y="98" fill="white" fontSize="12" fontWeight="bold">I 20%</text>
            <rect x="20" y="120" width="60" height="35" rx="4" fill="#d4a24e" opacity="0.8" />
            <text x="30" y="143" fill="white" fontSize="12" fontWeight="bold">G 20%</text>
            <rect x="20" y="165" width="15" height="25" rx="4" fill="#1a6b50" opacity="0.8" />
            <text x="42" y="183" fill="#1a6b50" fontSize="11" fontWeight="bold">NX 5%</text>
          </svg>
          <p className="font-label text-xs text-on-surface-variant font-bold">GDP = C + I + G + NX</p>
        </div>
      )}

      {modelId === 'inflation' && (
        <div className="relative w-full h-full border-l-2 border-b-2 border-primary-container/20">
          <span className="absolute -left-8 top-0 font-label text-xs font-bold text-on-surface-variant">물가(P)</span>
          <span className="absolute -right-2 -bottom-6 font-label text-xs font-bold text-on-surface-variant">통화량(M)</span>
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <line stroke="#ba1a1a" strokeWidth="2.5" x1="10%" x2="90%" y1="85%" y2="15%" />
            <text className="font-label text-[10px] font-bold" fill="#ba1a1a" x="70%" y="12%">P = MV/Y</text>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-secondary rounded-full border-2 border-white ring-4 ring-secondary/10"></div>
            <span className="font-label text-[11px] font-bold text-secondary mt-1">현재</span>
          </div>
        </div>
      )}

      {modelId === 'ppf' && (
        <div className="relative w-full h-full border-l-2 border-b-2 border-primary-container/20">
          <span className="absolute -left-8 top-0 font-label text-xs font-bold text-on-surface-variant">재화B</span>
          <span className="absolute -right-2 -bottom-6 font-label text-xs font-bold text-on-surface-variant">재화A</span>
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* PPF concave curve */}
            <path d="M 10% 15% Q 20% 75%, 85% 90%" stroke="#ba1a1a" strokeWidth="2.5" fill="none" />
            <text className="font-label text-[10px] font-bold" fill="#ba1a1a" x="72%" y="85%">PPF</text>
            {/* Operating point */}
          </svg>
          <div className="absolute top-[45%] left-[40%] flex flex-col items-center">
            <div className="w-3 h-3 bg-secondary rounded-full border-2 border-white ring-4 ring-secondary/10"></div>
            <span className="font-label text-[10px] font-bold text-secondary mt-1">현재 생산</span>
          </div>
          {/* Inefficient point */}
          <div className="absolute top-[60%] left-[25%] flex flex-col items-center">
            <div className="w-2 h-2 bg-on-surface-variant/30 rounded-full"></div>
            <span className="font-label text-[9px] text-on-surface-variant/50 mt-1">비효율</span>
          </div>
        </div>
      )}

      {modelId === 'comparative-advantage' && (
        <div className="relative w-full h-full border-l-2 border-b-2 border-primary-container/20">
          <span className="absolute -left-8 top-0 font-label text-xs font-bold text-on-surface-variant">재화2</span>
          <span className="absolute -right-2 -bottom-6 font-label text-xs font-bold text-on-surface-variant">재화1</span>
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Country A PPF */}
            <line stroke="#ba1a1a" strokeWidth="2" x1="10%" x2="75%" y1="35%" y2="90%" />
            <text className="font-label text-[10px] font-bold" fill="#ba1a1a" x="68%" y="88%">A국</text>
            {/* Country B PPF */}
            <line stroke="#1a6b50" strokeWidth="2" x1="10%" x2="40%" y1="10%" y2="90%" />
            <text className="font-label text-[10px] font-bold" fill="#1a6b50" x="35%" y="88%">B국</text>
            {/* Trade line */}
            <line stroke="#d4a24e" strokeWidth="2" strokeDasharray="6 3" x1="10%" x2="75%" y1="10%" y2="90%" />
            <text className="font-label text-[10px] font-bold" fill="#d4a24e" x="60%" y="50%">무역 후</text>
          </svg>
        </div>
      )}

      {modelId === 'multiplier' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
          <h3 className="font-headline font-bold text-sm text-primary mb-2">승수 효과</h3>
          <svg viewBox="0 0 300 200" className="w-full max-w-[280px]">
            {/* Decreasing bars showing rounds */}
            <rect x="20" y="20" width="40" height="150" rx="4" fill="#ba1a1a" opacity="0.9" />
            <text x="40" y="185" textAnchor="middle" fill="#45474c" fontSize="10" fontWeight="bold">1차</text>
            <rect x="70" y="50" width="40" height="120" rx="4" fill="#d4a24e" opacity="0.8" />
            <text x="90" y="185" textAnchor="middle" fill="#45474c" fontSize="10" fontWeight="bold">2차</text>
            <rect x="120" y="80" width="40" height="90" rx="4" fill="#d4a24e" opacity="0.7" />
            <text x="140" y="185" textAnchor="middle" fill="#45474c" fontSize="10" fontWeight="bold">3차</text>
            <rect x="170" y="105" width="40" height="65" rx="4" fill="#c5c6cc" opacity="0.7" />
            <text x="190" y="185" textAnchor="middle" fill="#45474c" fontSize="10" fontWeight="bold">4차</text>
            <rect x="220" y="125" width="40" height="45" rx="4" fill="#c5c6cc" opacity="0.5" />
            <text x="240" y="185" textAnchor="middle" fill="#45474c" fontSize="10" fontWeight="bold">5차</text>
            <text x="270" y="145" fill="#818a9d" fontSize="16" fontWeight="bold">...</text>
          </svg>
          <p className="font-label text-xs text-on-surface-variant font-bold">승수 = 1 / (1 - MPC)</p>
        </div>
      )}

      {modelId === 'is-lm' && (
        <div className="relative w-full h-full border-l-2 border-b-2 border-primary-container/20">
          <span className="absolute -left-8 top-0 font-label text-xs font-bold text-on-surface-variant">이자율(r)</span>
          <span className="absolute -right-2 -bottom-6 font-label text-xs font-bold text-on-surface-variant">국민소득(Y)</span>
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* IS curve (downward sloping) */}
            <line stroke="#ba1a1a" strokeWidth="2.5" x1="10%" x2="85%" y1="15%" y2="85%" />
            <text className="font-label text-[12px] font-bold" fill="#ba1a1a" x="80%" y="82%">IS</text>
            {/* LM curve (upward sloping) */}
            <line stroke="#1a6b50" strokeWidth="2.5" x1="10%" x2="85%" y1="80%" y2="20%" />
            <text className="font-label text-[12px] font-bold" fill="#1a6b50" x="80%" y="17%">LM</text>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-secondary rounded-full border-2 border-white ring-4 ring-secondary/10"></div>
            <span className="font-label text-[11px] font-bold text-secondary mt-1">균형 (Y*, r*)</span>
          </div>
          <div className="absolute top-1/2 left-0 right-1/2 h-[1px] border-t border-dashed border-outline-variant"></div>
          <div className="absolute top-1/2 left-1/2 bottom-0 w-[1px] border-l border-dashed border-outline-variant"></div>
        </div>
      )}
    </div>
  );
};

export const ConceptDetailPage: React.FC<ConceptDetailPageProps> = ({
  concept,
  onBack,
  onNavigateLab,
  onNavigateConcept,
}) => {
  const { markViewed } = useProgress();
  const quizzes = conceptQuizzes[concept.id] || [];
  const difficulty = conceptDifficulty[concept.id] || '입문';
  const oneLiner = conceptOneLiner[concept.id] || '';
  const newsItems = conceptNewsConnections[concept.id] || [];

  const difficultyColor = difficulty === '입문'
    ? 'bg-[#1a6b50]/10 text-[#1a6b50] border-[#1a6b50]/20'
    : difficulty === '중급'
    ? 'bg-[#d4a24e]/10 text-[#d4a24e] border-[#d4a24e]/20'
    : 'bg-[#ba1a1a]/10 text-[#ba1a1a] border-[#ba1a1a]/20';

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
          <div className="flex items-center gap-2">
            <span className={`font-['Manrope'] font-bold text-[11px] px-3 py-1 border rounded-full ${difficultyColor}`}>
              {difficulty}
            </span>
            <span className="font-['Manrope'] font-semibold text-[11px] px-3 py-1 border border-secondary text-secondary rounded-full">
              {concept.category}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[430px] mx-auto pb-32 px-6 pt-4 space-y-10">
        {/* One-liner Summary */}
        {oneLiner && (
          <section className="bg-[#d4a24e]/8 border border-[#d4a24e]/15 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="font-headline font-extrabold text-[#d4a24e] text-lg leading-none mt-0.5">''</span>
              <div>
                <span className="font-label text-[11px] font-bold text-[#d4a24e] tracking-wider uppercase">한마디로</span>
                <p className="font-body font-semibold text-primary text-[15px] leading-relaxed mt-1">
                  {oneLiner}
                </p>
              </div>
            </div>
          </section>
        )}

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

        {/* Visual Section: Concept-specific static diagram */}
        <section className="space-y-4">
          <ConceptDiagram modelId={concept.modelConfig.id} title={concept.title} />
          <p className="text-center font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
            {concept.title}
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

        {/* News Connection Section */}
        {newsItems.length > 0 && (
          <section>
            <h2 className="font-headline font-bold text-lg text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">newspaper</span>
              뉴스에서 보면
            </h2>
            <div className="space-y-4">
              {newsItems.map((news, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 overflow-hidden">
                  <div className="px-5 pt-4 pb-3 border-b border-outline-variant/5">
                    <p className="font-body font-bold text-primary text-[14px] leading-snug">
                      {news.headline}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-label text-[10px] text-on-surface-variant/60 font-medium">{news.source}</span>
                      <span className="w-1 h-1 rounded-full bg-on-surface-variant/30"></span>
                      <span className="font-label text-[10px] text-on-surface-variant/60 font-medium">{news.date}</span>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-primary-container/5">
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      {news.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <button
          onClick={() => onNavigateLab(concept.id)}
          className="w-full bg-[#d4a24e] hover:bg-secondary text-white font-headline font-extrabold py-5 rounded-lg flex items-center justify-center gap-3 shadow-lg shadow-secondary/20 transition-all active:translate-y-0.5"
        >
          직접 실험해보기
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        {/* Section 4: Quiz */}
        {quizzes.length > 0 && (
          <QuizSection questions={quizzes} conceptTitle={concept.title} />
        )}

        {/* Section 5: Related Concepts */}
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
