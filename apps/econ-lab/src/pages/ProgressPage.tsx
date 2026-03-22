import React from 'react';
import { useProgress } from '../hooks/useProgress';
import { concepts, getConceptById } from '../data/concepts';

export const ProgressPage: React.FC = () => {
  const { progress, conceptsViewedCount, experimentsCount, discoveriesCount, totalMinutes } = useProgress();

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-10">
      <header className="space-y-2">
        <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary tracking-[0.2em] uppercase">
          Research Journal
        </span>
        <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight text-left">
          연구 일지
        </h2>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/5">
          <p className="font-['Space_Grotesk'] font-bold text-2xl text-primary">{conceptsViewedCount}/{concepts.length}</p>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">연구 파일 열람</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/5">
          <p className="font-['Space_Grotesk'] font-bold text-2xl text-primary">{experimentsCount}/{concepts.length}</p>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">실험 완료</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/5">
          <p className="font-['Space_Grotesk'] font-bold text-2xl text-primary">{discoveriesCount}</p>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">발견 기록</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/5">
          <p className="font-['Space_Grotesk'] font-bold text-2xl text-primary">{totalMinutes}m</p>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">연구 시간</p>
        </div>
      </div>

      {/* Discoveries List */}
      <section className="space-y-4">
        <h3 className="font-headline font-bold text-lg text-primary flex items-center gap-2 text-left">
          <span className="w-1.5 h-6 bg-secondary"></span>
          발견 목록
        </h3>
        {progress.discoveries.length > 0 ? (
          <div className="space-y-3">
            {progress.discoveries.map((discovery, i) => {
              const concept = getConceptById(discovery.conceptId);
              return (
                <div
                  key={discovery.id}
                  className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/5 text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-['Space_Grotesk'] text-[10px] font-bold text-secondary tracking-widest">
                      #{i + 1}
                    </span>
                    <span className="font-label text-[10px] text-on-surface-variant/50">
                      {concept?.title || discovery.conceptId}
                    </span>
                    <span className={`font-label text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      discovery.result.startsWith('correct') ? 'bg-[#1a6b50]/10 text-[#1a6b50]' : 'bg-[#d4a24e]/10 text-[#d4a24e]'
                    }`}>
                      {discovery.result.startsWith('correct') ? 'CORRECT' : 'LEARNED'}
                    </span>
                  </div>
                  <p className="font-body text-sm text-primary font-semibold">{discovery.hypothesis}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/5 text-left">
            <p className="font-body text-on-surface-variant text-sm">
              아직 발견하지 못한 법칙이 있습니다. 실험동에서 가설을 세우고 시뮬레이션을 실행해보세요.
            </p>
          </div>
        )}
      </section>

      {/* Concept Progress List */}
      <section className="space-y-4">
        <h3 className="font-headline font-bold text-lg text-primary flex items-center gap-2 text-left">
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
              className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-['Space_Grotesk'] text-[10px] font-bold text-on-surface-variant/30 tracking-widest w-12">
                  FILE-{String(i + 1).padStart(3, '0')}
                </span>
                <div>
                  <p className="font-body font-bold text-primary text-sm">{concept.title}</p>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
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
