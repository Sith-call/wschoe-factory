import { useState, useMemo } from 'react';
import type { DreamEntry, DreamEmotionKey } from '../types';
import { EMOTIONS } from '../data';

interface Props {
  dreams: DreamEntry[];
  onViewDream: (entry: DreamEntry) => void;
  onGoPattern: () => void;
  onBack: () => void;
  onStartDream: () => void;
}

type FilterKey = 'all' | 'week' | DreamEmotionKey;

const GRADIENT_CLASS: Record<string, string> = {
  peace: 'gradient-peace',
  fear: 'gradient-fear',
  joy: 'gradient-joy',
  sorrow: 'gradient-sorrow',
  surprise: 'gradient-surprise',
  longing: 'gradient-longing',
  confusion: 'gradient-confusion',
  anger: 'gradient-anger',
};

export default function GalleryScreen({ dreams, onViewDream, onGoPattern, onBack, onStartDream }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filteredDreams = useMemo(() => {
    if (filter === 'all') return dreams;
    if (filter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return dreams.filter(d => new Date(d.date) >= oneWeekAgo);
    }
    return dreams.filter(d => d.emotions.includes(filter as DreamEmotionKey));
  }, [dreams, filter]);

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'week', label: '이번 주' },
    ...EMOTIONS.slice(0, 3).map(e => ({ key: e.key as FilterKey, label: e.label })),
  ];

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-surface text-on-surface font-body">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-surface-dim to-transparent shadow-[0_20px_40px_rgba(195,192,255,0.08)] max-w-[430px]">
        <div className="flex items-center justify-between px-6 h-16 w-full">
          <span className="material-symbols-outlined text-indigo-400 hover:opacity-80 transition-opacity active:scale-95 duration-200 cursor-pointer" onClick={onBack}>auto_awesome</span>
          <h1 className="font-headline text-lg font-bold text-white tracking-widest">꿈 갤러리</h1>
          <span className="material-symbols-outlined text-indigo-400 hover:opacity-80 transition-opacity active:scale-95 duration-200 cursor-pointer">account_circle</span>
        </div>
      </header>

      <main className="mt-16 px-5 flex flex-col gap-8">
        {/* Tab Navigation */}
        <nav className="flex justify-center items-center gap-8 pt-6">
          <button className="pb-2 text-lg font-headline font-bold text-white active-tab-underline tracking-wide">갤러리</button>
          <button onClick={onGoPattern} className="pb-2 text-lg font-headline font-medium text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity">패턴 분석</button>
        </nav>

        {/* Filter Chips Section */}
        <section className="flex overflow-x-auto pb-2 gap-3 no-scrollbar -mx-5 px-5">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-primary-container text-white'
                  : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {f.label}
            </button>
          ))}
        </section>

        {/* Masonry-style Grid Area */}
        {filteredDreams.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">nights_stay</span>
            <p className="text-on-surface-variant text-sm mb-4">아직 기록한 꿈이 없어요.<br />첫 번째 꿈을 기록해보세요!</p>
            <button onClick={onStartDream} className="px-6 py-2.5 rounded-full bg-primary-container text-white text-sm font-medium">
              꿈 기록하기
            </button>
          </div>
        ) : (
          <section className="masonry-grid pb-12">
            {filteredDreams.map((dream, idx) => {
              const dateStr = new Date(dream.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
              const gradientCls = GRADIENT_CLASS[dream.gradientType] || 'gradient-peace';
              const isOddColumn = idx % 2 === 1;
              return (
                <article
                  key={dream.id}
                  onClick={() => onViewDream(dream)}
                  className={`glass-card-subtle dream-card-shadow card-radius overflow-hidden flex flex-col transition-transform active:scale-[0.98] cursor-pointer ${
                    isOddColumn ? 'mt-4' : ''
                  }`}
                >
                  <div className={`h-1.5 w-full ${gradientCls}`}></div>
                  <div className="p-5 flex flex-col gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-primary-fixed-dim font-bold">
                      {EMOTIONS.find(e => e.key === dream.gradientType)?.label || ''}
                    </span>
                    <h2 className="font-headline text-lg leading-tight text-white">{dream.interpretation.title}</h2>
                    <p className="font-label text-xs text-on-surface-variant">{dateStr}</p>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={onStartDream}
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full gradient-joy flex items-center justify-center shadow-[0_10px_40px_rgba(236,72,153,0.3)] z-[60] active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-white text-3xl font-bold">add</span>
      </button>

      {/* BottomNavBar — consistent 기록/갤러리/통계 */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-8 pb-8 pt-4 bg-indigo-950/60 backdrop-blur-xl z-50 rounded-t-[40px] border-t border-white/10 shadow-[0_-8px_32px_rgba(79,70,229,0.15)] max-w-[430px]">
        <button onClick={onStartDream} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">edit_note</span>
          <span className="font-label text-[10px] tracking-wider">기록</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-indigo-500/20 text-indigo-100 rounded-full px-6 py-2 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1 icon-fill">auto_stories</span>
          <span className="font-label text-[10px] tracking-wider">갤러리</span>
        </button>
        <button onClick={onGoPattern} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">insights</span>
          <span className="font-label text-[10px] tracking-wider">통계</span>
        </button>
      </nav>
    </div>
  );
}
