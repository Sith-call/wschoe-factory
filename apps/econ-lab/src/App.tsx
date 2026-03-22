import React, { useState, useCallback } from 'react';
import { TabId } from './types';
import { TabBar } from './components/TabBar';
import { HomePage } from './pages/HomePage';
import { ConceptListPage } from './pages/ConceptListPage';
import { ConceptDetailPage } from './pages/ConceptDetailPage';
import { InteractiveLabPage } from './pages/InteractiveLabPage';
import { ProgressPage } from './pages/ProgressPage';
import { concepts, getConceptById } from './data/concepts';
import { useProgress } from './hooks/useProgress';

type View =
  | { type: 'tab'; tab: TabId }
  | { type: 'concept-detail'; conceptId: string }
  | { type: 'lab'; conceptId: string };

function App() {
  const [view, setView] = useState<View>({ type: 'tab', tab: 'home' });
  const { conceptsViewedCount } = useProgress();

  const handleTabChange = useCallback((tab: TabId) => {
    setView({ type: 'tab', tab });
  }, []);

  const handleNavigateConcept = useCallback((conceptId: string) => {
    setView({ type: 'concept-detail', conceptId });
  }, []);

  const handleNavigateLab = useCallback((conceptId: string) => {
    setView({ type: 'lab', conceptId });
  }, []);

  const handleBack = useCallback(() => {
    setView({ type: 'tab', tab: 'home' });
  }, []);

  // Render lab page (no tab bar, full screen)
  if (view.type === 'lab') {
    const concept = getConceptById(view.conceptId);
    if (!concept) {
      setView({ type: 'tab', tab: 'home' });
      return null;
    }
    return <InteractiveLabPage concept={concept} onBack={handleBack} />;
  }

  // Render concept detail (no tab bar, full screen)
  if (view.type === 'concept-detail') {
    const concept = getConceptById(view.conceptId);
    if (!concept) {
      setView({ type: 'tab', tab: 'home' });
      return null;
    }
    return (
      <ConceptDetailPage
        concept={concept}
        onBack={handleBack}
        onNavigateLab={handleNavigateLab}
        onNavigateConcept={handleNavigateConcept}
      />
    );
  }

  // Tab-based views
  const activeTab = view.tab;

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#fbf9f6] dark:bg-slate-900 border-b border-[#040d1b]/5">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#040d1b] dark:text-slate-100">science</span>
            <h1 className="font-['Epilogue'] font-extrabold text-[#040d1b] dark:text-slate-100 text-xl tracking-tight">
              경제 연구소
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-['Space_Grotesk'] text-[10px] font-bold text-secondary uppercase tracking-widest">
                Research
              </span>
              <span className="font-['Space_Grotesk'] text-xs font-medium text-primary">
                {conceptsViewedCount}/{concepts.length} 파일 열람
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-xl">person</span>
            </div>
          </div>
        </div>
        <div className="bg-[#f2f0ed] dark:bg-slate-800 h-px w-full"></div>
      </header>

      {/* Page Content */}
      {activeTab === 'home' && (
        <HomePage onNavigateConcept={handleNavigateConcept} onNavigateLab={handleNavigateLab} />
      )}
      {activeTab === 'concepts' && (
        <ConceptListPage onNavigateConcept={handleNavigateConcept} />
      )}
      {activeTab === 'lab' && (
        <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-10">
          <header className="space-y-2">
            <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary tracking-[0.2em] uppercase">
              Lab Wing
            </span>
            <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight text-left">
              실험동
            </h2>
            <p className="text-on-surface-variant text-base leading-relaxed max-w-xl text-left">
              경제 모델을 직접 조작하고 결과를 실시간으로 관찰하세요.
            </p>
          </header>
          <div className="space-y-4">
            {concepts.map((concept, i) => (
              <div
                key={concept.id}
                onClick={() => handleNavigateLab(concept.id)}
                className={`bg-primary-container text-on-primary overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow text-left ${
                  i === 0 ? 'rounded-lg p-8' : 'rounded-lg p-6'
                }`}
              >
                <span className="font-['Space_Grotesk'] text-[10px] text-on-primary-container font-bold tracking-widest mb-2 block uppercase">
                  Experiment {String(i + 1).padStart(2, '0')} / {concept.titleEn}
                </span>
                <h4 className={`font-headline font-bold text-white mb-2 ${i === 0 ? 'text-2xl' : 'text-lg'}`}>
                  {concept.title}
                </h4>
                <p className="text-sm text-on-primary-container font-medium mb-4">
                  {concept.description.slice(0, i === 0 ? 80 : 50)}...
                </p>
                <span className="flex items-center gap-2 text-secondary-fixed-dim font-bold text-sm hover:translate-x-1 transition-transform">
                  실험 시작하기 <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                </span>
              </div>
            ))}
          </div>
        </main>
      )}
      {activeTab === 'progress' && <ProgressPage />}

      {/* Bottom Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
}

export default App;
