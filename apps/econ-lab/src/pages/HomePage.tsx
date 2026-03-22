import React from 'react';
import { concepts } from '../data/concepts';
import { useProgress } from '../hooks/useProgress';

interface HomePageProps {
  onNavigateConcept: (conceptId: string) => void;
  onNavigateLab: (conceptId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateConcept, onNavigateLab }) => {
  const { progress, conceptsViewedCount, discoveriesCount } = useProgress();
  const featuredConcept = concepts[0]; // 수요와 공급

  // Find a concept user hasn't tried yet for recommendation
  const nextConcept = concepts.find(c => !progress.experimentsCompleted.includes(c.id)) || concepts[0];

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-16">
      {/* Hero Section: Research Lab Bulletin */}
      <section className="relative">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <header className="space-y-2">
              <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary tracking-[0.2em] uppercase">
                Research Briefing
              </span>
              <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-primary leading-[1.1] tracking-tight text-left">
                {featuredConcept.title}
              </h2>
            </header>
            <p className="text-on-surface-variant text-base leading-relaxed max-w-xl text-left">
              {featuredConcept.description}
            </p>
            <button
              onClick={() => onNavigateLab(featuredConcept.id)}
              className="bg-secondary-container text-on-secondary-container px-8 py-4 font-bold tracking-tight hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 shadow-sm"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              실험 시작하기
            </button>
          </div>
          <div className="lg:col-span-5">
            <div className="relative bg-surface-container-low p-8 rounded-lg aspect-square border border-outline-variant/10 shadow-sm overflow-hidden">
              <div className="absolute inset-0 p-12 flex flex-col justify-between opacity-40">
                <div className="h-px w-full bg-primary/10"></div>
                <div className="h-px w-full bg-primary/10"></div>
                <div className="h-px w-full bg-primary/10"></div>
                <div className="h-px w-full bg-primary/10"></div>
              </div>
              <svg className="relative z-10 w-full h-full drop-shadow-lg" viewBox="0 0 400 400">
                <path d="M 50 50 L 350 350" fill="none" stroke="#ba1a1a" strokeLinecap="round" strokeWidth="4" />
                <path d="M 50 350 L 350 50" fill="none" stroke="#1a2332" strokeLinecap="round" strokeWidth="4" />
                <circle className="animate-pulse" cx="200" cy="200" fill="#7e5703" r="8" />
              </svg>
              <div className="absolute bottom-6 right-6 font-label text-[10px] text-primary/40 tracking-widest uppercase">
                File No. SD-001
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
              Research Bulletin
            </span>
          </div>
          <p className="font-body font-bold text-white text-[15px] leading-relaxed mb-3 text-left">
            "한국은행, 기준금리 3.5% 동결" -- 물가는 아직 높고, 경기는 약하고
          </p>
          <div className="flex items-center justify-between">
            <span className="font-label text-[11px] text-white/50">
              이게 무슨 뜻일까?
            </span>
            <span className="font-label text-[12px] text-[#d4a24e] font-bold flex items-center gap-1">
              인플레이션 연구 파일
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </div>
      </section>

      {/* Research Status */}
      <section className="space-y-6">
        <h3 className="font-headline font-bold text-2xl text-primary text-left">연구 현황</h3>
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/5">
            <p className="font-['Space_Grotesk'] font-bold text-3xl text-primary tracking-tight">{conceptsViewedCount}<span className="text-base text-on-surface-variant/40">/{concepts.length}</span></p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">연구 파일</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/5">
            <p className="font-['Space_Grotesk'] font-bold text-3xl text-primary tracking-tight">{progress.experimentsCompleted.length}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">실험 완료</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/5">
            <p className="font-['Space_Grotesk'] font-bold text-3xl text-primary tracking-tight">{discoveriesCount}</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">발견 기록</p>
          </div>
        </div>
      </section>

      {/* Next Experiment Recommendation */}
      {nextConcept && (
        <section className="space-y-6">
          <h3 className="font-headline font-bold text-2xl text-primary text-left">다음 실험 추천</h3>
          <div
            onClick={() => onNavigateLab(nextConcept.id)}
            className="bg-primary-container text-on-primary rounded-lg overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="p-8">
              <span className="font-['Space_Grotesk'] text-[10px] text-on-primary-container font-bold tracking-widest mb-3 block uppercase">
                {nextConcept.titleEn}
              </span>
              <h4 className="font-headline font-bold text-2xl text-white mb-3">{nextConcept.title}</h4>
              <p className="text-sm text-on-primary-container font-medium mb-4 text-left">
                {nextConcept.description.slice(0, 60)}...
              </p>
              <span className="flex items-center gap-2 text-secondary-fixed-dim font-bold text-sm">
                실험 시작하기 <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Popular Experiments */}
      <section className="space-y-6">
        <h3 className="font-headline font-bold text-2xl text-primary text-left">인기 실험</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            onClick={() => onNavigateLab('supply-demand')}
            className="bg-primary-container text-on-primary rounded-lg overflow-hidden group flex flex-col md:flex-row shadow-xl cursor-pointer"
          >
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <span className="font-label text-[10px] text-on-primary-container font-bold tracking-widest mb-3 block uppercase">
                  Simulation Alpha
                </span>
                <h4 className="font-headline font-bold text-xl text-white mb-3">수요곡선 이동 실험</h4>
              </div>
              <span className="flex items-center gap-2 text-secondary-fixed-dim font-bold text-sm hover:translate-x-1 transition-transform">
                실험 시작하기 <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
              </span>
            </div>
          </div>

          <div
            onClick={() => onNavigateLab('gdp')}
            className="bg-surface-container-high rounded-lg overflow-hidden flex flex-col md:flex-row shadow-sm cursor-pointer"
          >
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <span className="font-label text-[10px] text-primary/40 font-bold tracking-widest mb-3 block uppercase">
                  Decomposition Tool
                </span>
                <h4 className="font-headline font-bold text-xl text-primary mb-3">GDP 구성요소 분해</h4>
              </div>
              <span className="flex items-center gap-2 text-secondary font-bold text-sm hover:translate-x-1 transition-transform">
                데이터 탐색 <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
