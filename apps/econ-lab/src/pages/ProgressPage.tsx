import React from 'react';
import { useProgress } from '../hooks/useProgress';
import { ProgressBadge } from '../components/ProgressBadge';
import { concepts } from '../data/concepts';

export const ProgressPage: React.FC = () => {
  const { progress, conceptsViewedCount, experimentsCount, totalMinutes } = useProgress();

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-10">
      <header className="space-y-2">
        <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary tracking-[0.2em] uppercase">
          Learning Progress
        </span>
        <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight">
          학습 진도
        </h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ProgressBadge
          label="개념 학습"
          value={conceptsViewedCount}
          total={concepts.length}
          icon="menu_book"
        />
        <ProgressBadge
          label="실험 완료"
          value={experimentsCount}
          total={concepts.length}
          icon="science"
        />
        <ProgressBadge
          label="학습 시간 (분)"
          value={totalMinutes}
          total={Math.max(totalMinutes, 60)}
          icon="schedule"
        />
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/5 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
            </div>
            <div>
              <p className="font-headline font-bold text-lg text-primary">
                {progress.lastVisit ? new Date(progress.lastVisit).toLocaleDateString('ko-KR') : '-'}
              </p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">마지막 학습</p>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Progress List */}
      <section className="space-y-4">
        <h3 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
          <span className="w-1.5 h-6 bg-secondary"></span>
          개념별 진도
        </h3>
        {concepts.map(concept => {
          const viewed = progress.conceptsViewed.includes(concept.id);
          const experimented = progress.experimentsCompleted.includes(concept.id);
          const status = experimented ? 'completed' : viewed ? 'viewed' : 'not-started';

          return (
            <div
              key={concept.id}
              className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-container text-lg">
                    {concept.icon}
                  </span>
                </div>
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
