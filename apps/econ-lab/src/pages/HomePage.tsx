import React from 'react';
import { concepts } from '../data/concepts';
import { ConceptCard } from '../components/ConceptCard';
import { useProgress } from '../hooks/useProgress';

interface HomePageProps {
  onNavigateConcept: (conceptId: string) => void;
  onNavigateLab: (conceptId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateConcept, onNavigateLab }) => {
  const { progress, conceptsViewedCount } = useProgress();
  const featuredConcept = concepts[0]; // 수요와 공급

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-16">
      {/* Hero Section: 오늘의 발견 */}
      <section className="relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-8">
            <header className="space-y-2">
              <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary tracking-[0.2em] uppercase">
                Today's Discovery
              </span>
              <h2 className="font-headline font-extrabold text-5xl md:text-6xl text-primary leading-[1.1] tracking-tight">
                {featuredConcept.title}
              </h2>
            </header>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
              {featuredConcept.description}
            </p>
            <button
              onClick={() => onNavigateLab(featuredConcept.id)}
              className="bg-secondary-container text-on-secondary-container px-8 py-4 font-bold tracking-tight hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 shadow-sm"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              바로 실험하기
            </button>
          </div>
          <div className="lg:col-span-5">
            <div className="relative bg-surface-container-low p-8 rounded-lg aspect-square border border-outline-variant/10 shadow-sm overflow-hidden group">
              {/* Abstract Supply/Demand Curve UI */}
              <div className="absolute inset-0 p-12 flex flex-col justify-between opacity-40">
                <div className="h-px w-full bg-primary/10"></div>
                <div className="h-px w-full bg-primary/10"></div>
                <div className="h-px w-full bg-primary/10"></div>
                <div className="h-px w-full bg-primary/10"></div>
              </div>
              <svg className="relative z-10 w-full h-full drop-shadow-lg" viewBox="0 0 400 400">
                {/* Demand Curve (Red) */}
                <path d="M 50 50 L 350 350" fill="none" stroke="#ba1a1a" strokeLinecap="round" strokeWidth="4" />
                {/* Supply Curve (Blue) */}
                <path d="M 50 350 L 350 50" fill="none" stroke="#1a2332" strokeLinecap="round" strokeWidth="4" />
                {/* Equilibrium Point */}
                <circle className="animate-pulse" cx="200" cy="200" fill="#7e5703" r="8" />
              </svg>
              <div className="absolute bottom-6 right-6 font-label text-[10px] text-primary/40 tracking-widest uppercase">
                Exhibit ID: SD-041
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Economy News Card */}
      <section>
        <div
          onClick={() => onNavigateConcept('inflation')}
          className="bg-[#1a2332] rounded-lg p-6 cursor-pointer hover:bg-[#1a2332]/90 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#d4a24e] text-lg">newspaper</span>
            <span className="font-label text-[11px] font-bold text-[#d4a24e] tracking-wider uppercase">
              오늘의 경제 뉴스 한줄
            </span>
          </div>
          <p className="font-body font-bold text-white text-[15px] leading-relaxed mb-3">
            "한국은행, 기준금리 3.5% 동결" — 물가는 아직 높고, 경기는 약하고
          </p>
          <div className="flex items-center justify-between">
            <span className="font-label text-[11px] text-white/50">
              이게 무슨 뜻일까?
            </span>
            <span className="font-label text-[12px] text-[#d4a24e] font-bold flex items-center gap-1">
              인플레이션 개념 보기
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </div>
      </section>

      {/* Recent Learning Section */}
      <section className="space-y-10">
        <div className="flex items-end justify-between">
          <h3 className="font-headline font-bold text-3xl text-primary">최근 학습</h3>
          <span className="font-label text-sm text-secondary font-bold flex items-center gap-1">
            {conceptsViewedCount}/{concepts.length} 학습 완료
          </span>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar -mx-6 px-6">
          {concepts.map(concept => {
            const isViewed = progress.conceptsViewed.includes(concept.id);
            const isExperimented = progress.experimentsCompleted.includes(concept.id);
            const pct = isExperimented ? 100 : isViewed ? 50 : 0;
            return (
              <ConceptCard
                key={concept.id}
                concept={concept}
                completionPercent={pct}
                onClick={() => onNavigateConcept(concept.id)}
              />
            );
          })}
        </div>
      </section>

      {/* Popular Experiments Section */}
      <section className="space-y-10">
        <h3 className="font-headline font-bold text-3xl text-primary">인기 실험</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Experiment Card 1 */}
          <div
            onClick={() => onNavigateLab('supply-demand')}
            className="bg-primary-container text-on-primary rounded-lg overflow-hidden group flex flex-col md:flex-row shadow-xl cursor-pointer"
          >
            <div className="p-8 flex flex-col justify-between flex-1">
              <div>
                <span className="font-label text-[10px] text-on-primary-container font-bold tracking-widest mb-4 block uppercase">
                  Simulation Alpha
                </span>
                <h4 className="font-headline font-bold text-2xl text-white mb-4">수요곡선 이동 실험</h4>
              </div>
              <button className="flex items-center gap-2 text-secondary-fixed-dim font-bold text-sm hover:translate-x-1 transition-transform">
                실험 시작하기 <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
              </button>
            </div>
            <div className="md:w-1/3 bg-white/5 p-6 flex items-center justify-center">
              <div className="relative w-full h-full flex flex-col justify-around">
                <div className="h-1 w-full bg-secondary-container/20 rounded-full"></div>
                <div className="h-1 w-3/4 bg-secondary-container/60 rounded-full translate-x-4"></div>
                <div className="h-1 w-full bg-secondary-container/40 rounded-full -translate-x-2"></div>
              </div>
            </div>
          </div>

          {/* Experiment Card 2 */}
          <div
            onClick={() => onNavigateLab('gdp')}
            className="bg-surface-container-high rounded-lg overflow-hidden flex flex-col md:flex-row shadow-sm cursor-pointer"
          >
            <div className="p-8 flex flex-col justify-between flex-1">
              <div>
                <span className="font-label text-[10px] text-primary/40 font-bold tracking-widest mb-4 block uppercase">
                  Decomposition Tool
                </span>
                <h4 className="font-headline font-bold text-2xl text-primary mb-4">GDP 구성요소 분해</h4>
              </div>
              <button className="flex items-center gap-2 text-secondary font-bold text-sm hover:translate-x-1 transition-transform">
                데이터 탐색 <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
              </button>
            </div>
            <div className="md:w-1/3 bg-primary/5 p-6 flex flex-col justify-center gap-2">
              <div className="h-4 bg-primary/10 rounded w-full"></div>
              <div className="h-4 bg-primary/20 rounded w-5/6"></div>
              <div className="h-4 bg-primary/30 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
