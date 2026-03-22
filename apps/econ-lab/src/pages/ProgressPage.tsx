import React from 'react';
import { useProgress } from '../hooks/useProgress';
import { concepts, getConceptById } from '../data/concepts';

export const ProgressPage: React.FC = () => {
  const { progress, conceptsViewedCount, experimentsCount, discoveriesCount, totalMinutes } = useProgress();

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-12">
      <header className="space-y-3">
        <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary tracking-[0.2em] uppercase">
          Research Journal
        </span>
        <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight text-left">
          연구 일지
        </h2>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/5">
          <p className="font-['Space_Grotesk'] font-bold text-3xl text-primary tracking-tight">{conceptsViewedCount}/{concepts.length}</p>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">연구 파일 열람</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/5">
          <p className="font-['Space_Grotesk'] font-bold text-3xl text-primary tracking-tight">{experimentsCount}/{concepts.length}</p>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">실험 완료</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/5">
          <p className="font-['Space_Grotesk'] font-bold text-3xl text-primary tracking-tight">{discoveriesCount}</p>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">발견 기록</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/5">
          <p className="font-['Space_Grotesk'] font-bold text-3xl text-primary tracking-tight">{totalMinutes}<span className="text-lg text-on-surface-variant/50 ml-0.5">m</span></p>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">연구 시간</p>
        </div>
      </div>

      {/* Discoveries — Research Notes */}
      <section className="space-y-5">
        <h3 className="font-headline font-bold text-xl text-primary flex items-center gap-2 text-left">
          <span className="w-1.5 h-6 bg-secondary"></span>
          연구 노트
        </h3>
        {progress.discoveries.length > 0 ? (
          <div className="space-y-4">
            {progress.discoveries.map((discovery, i) => {
              const concept = getConceptById(discovery.conceptId);
              const isCorrect = discovery.result.startsWith('correct');
              const dateStr = discovery.timestamp
                ? new Date(discovery.timestamp).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
                : '';
              // Extract the experiment scenario and result
              const hypothesisParts = discovery.hypothesis.split(' → ');
              const scenario = hypothesisParts[0] || discovery.hypothesis;
              const prediction = hypothesisParts[1] || '';
              // Extract insight from result (after "correct: " or "wrong: ")
              const insight = discovery.result.replace(/^(correct|wrong):\s*/, '');

              return (
                <div
                  key={discovery.id}
                  className="bg-surface-container-lowest rounded-lg border border-outline-variant/5 overflow-hidden text-left"
                >
                  {/* Note header */}
                  <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-outline-variant/5">
                    <div className="flex items-center gap-3">
                      <span className="font-['Space_Grotesk'] text-[11px] font-bold text-on-surface-variant/40 tracking-widest">
                        NOTE-{String(i + 1).padStart(3, '0')}
                      </span>
                      <span className="font-label text-[11px] text-on-surface-variant/50 font-medium">
                        {concept?.title || discovery.conceptId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {dateStr && (
                        <span className="font-label text-[10px] text-on-surface-variant/40">{dateStr}</span>
                      )}
                      <span className={`font-label text-[9px] font-bold px-2 py-0.5 rounded ${
                        isCorrect ? 'bg-[#1a6b50]/10 text-[#1a6b50]' : 'bg-[#d4a24e]/10 text-[#d4a24e]'
                      }`}>
                        {isCorrect ? 'CORRECT' : 'LEARNED'}
                      </span>
                    </div>
                  </div>
                  {/* Note body */}
                  <div className="px-5 py-4 space-y-3">
                    {/* The experiment scenario */}
                    <p className="font-body text-sm text-primary font-semibold leading-snug">
                      {scenario.length > 60 ? scenario.slice(0, 60) + '...' : scenario}
                    </p>
                    {/* Insight in one sentence */}
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      {insight}
                    </p>
                    {/* Mini graph thumbnail */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-12 h-8 bg-primary-container/30 rounded flex items-center justify-center overflow-hidden">
                        <svg viewBox="0 0 48 32" className="w-full h-full" fill="none">
                          <line x1="4" y1="4" x2="44" y2="28" stroke="#ba1a1a" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="4" y1="28" x2="44" y2="4" stroke="#1a2332" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx={isCorrect ? 24 : 28} cy={16} r="2.5" fill="#ffc971" />
                        </svg>
                      </div>
                      {prediction && (
                        <span className="font-label text-[10px] text-on-surface-variant/50">
                          예측: {prediction}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/5 text-left overflow-hidden">
            <div className="p-8 space-y-4">
              {/* Empty state illustration */}
              <div className="w-16 h-16 bg-primary-container/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl">edit_note</span>
              </div>
              <div className="space-y-2">
                <p className="font-headline font-bold text-primary text-base">
                  아직 비어있는 연구 노트
                </p>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed">
                  첫 실험을 시작해보세요. 실험동에서 가설을 세우고 시뮬레이션을 실행하면, 여기에 발견이 기록됩니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Concept Progress List */}
      <section className="space-y-5">
        <h3 className="font-headline font-bold text-xl text-primary flex items-center gap-2 text-left">
          <span className="w-1.5 h-6 bg-secondary"></span>
          연구 파일 진도
        </h3>
        {concepts.map((concept, i) => {
          const viewed = progress.conceptsViewed.includes(concept.id);
          const experimented = progress.experimentsCompleted.includes(concept.id);
          const status = experimented ? 'completed' : viewed ? 'viewed' : 'not-started';

          return (
            <div
              key={concept.id}
              className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-lg border border-outline-variant/5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-['Space_Grotesk'] text-[10px] font-bold text-on-surface-variant/30 tracking-widest w-12">
                  FILE-{String(i + 1).padStart(3, '0')}
                </span>
                <div>
                  <p className="font-body font-bold text-primary text-sm">{concept.title}</p>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
                    {concept.category}
                  </p>
                </div>
              </div>
              <span
                className={`font-label text-[10px] font-bold px-2 py-1 rounded ${
                  status === 'completed'
                    ? 'bg-secondary-container/30 text-secondary'
                    : status === 'viewed'
                      ? 'bg-surface-container text-on-surface-variant'
                      : 'bg-surface-variant text-on-surface-variant/50'
                }`}
              >
                {status === 'completed' ? 'COMPLETED' : status === 'viewed' ? 'VIEWED' : 'NOT STARTED'}
              </span>
            </div>
          );
        })}
      </section>
    </main>
  );
};
