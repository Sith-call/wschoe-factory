import { useState } from 'react';
import type { DreamEntry } from '../types';
import DreamIconComposition from './DreamIconComposition';

interface Props {
  entry: DreamEntry;
  isViewMode: boolean;
  onSave: () => void;
  onShare: () => void;
  onRestart: () => void;
  onBack: () => void;
  onUpdateJournalMemo: (id: string, memo: string) => void;
}

export default function InterpretationScreen({
  entry, isViewMode, onSave, onShare, onRestart, onBack, onUpdateJournalMemo,
}: Props) {
  const [showMemo, setShowMemo] = useState(false);
  const [journalMemo, setJournalMemo] = useState(entry.journalMemo || '');

  const handleSaveMemo = () => {
    onUpdateJournalMemo(entry.id, journalMemo);
    setShowMemo(false);
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-dim max-w-[430px]">
        <button onClick={onBack} className="text-primary hover:text-tertiary transition-colors duration-600">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline text-lg tracking-[0.2em] text-primary">꿈 해석</h1>
        <button className="text-primary hover:text-tertiary transition-colors duration-600">
          <span className="material-symbols-outlined">auto_awesome</span>
        </button>
      </header>

      {/* Celestial Background Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_30%,_var(--color-primary-container)_0%,_transparent_70%)]"></div>

      {/* Main Canvas */}
      <main className="flex-grow pt-24 pb-32 px-6 flex flex-col items-center max-w-[430px] mx-auto w-full overflow-y-auto">
        {/* The Tarot Interpretation Card */}
        <div className="relative w-full max-w-sm aspect-[2/3.2] card-radius p-[1px] bg-gradient-to-b from-tertiary/30 to-transparent shadow-[0_0_40px_rgba(79,70,229,0.2)] card-reveal ease-out-expo">
          <div className="h-full w-full card-radius overflow-hidden flex flex-col relative"
            style={{
              background: `linear-gradient(180deg, transparent 0%, #1a1739 35%, #120e31 100%)`,
            }}
          >
            {/* Icon Art Illustration */}
            <div className="relative -mx-0 shrink-0">
              <DreamIconComposition
                place={entry.scene.place}
                weather={entry.scene.weather}
                objects={entry.scene.objects}
                emotion={entry.gradientType}
                size="medium"
              />
            </div>

            {/* Card Content */}
            <div className="relative z-10 flex flex-col flex-1 px-8 pb-8 -mt-4">
              {/* Card Title */}
              <h2 className="font-headline text-2xl text-white text-center leading-relaxed tracking-tight mb-3">
                {entry.interpretation.title}
              </h2>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {entry.interpretation.keywords.map((k, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-surface-container-low/40 backdrop-blur-md text-primary text-[10px] font-label tracking-widest uppercase">
                    #{k}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="w-16 h-[1px] bg-tertiary/30 mx-auto mb-6"></div>

              {/* Poetic Interpretation */}
              <div className="flex-grow overflow-y-auto">
                <p className="font-headline text-white/90 text-[15px] leading-relaxed text-center mb-8">
                  {entry.interpretation.text}
                </p>

                {/* Symbol Explanation */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-label tracking-[0.2em] text-tertiary uppercase text-center opacity-80 mb-4">상징 해설</h3>
                  {entry.interpretation.symbolReadings.map((sr, i) => (
                    <div key={i} className="flex justify-between items-center text-white/80 text-[13px] border-b border-white/5 pb-2">
                      <span>{sr.symbol}</span>
                      <span className="text-white/40">{sr.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quote */}
              <p className="font-dream-quote italic text-white/60 text-center text-sm pt-6 border-t border-white/10 mt-6 leading-tight">
                "{entry.interpretation.fortune}"
              </p>

              {/* Personal Insight */}
              {entry.interpretation.personalInsight && (
                <div className="mt-6 p-4 rounded-xl bg-tertiary/10 border border-tertiary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-tertiary text-sm icon-fill">auto_awesome</span>
                    <span className="text-[10px] font-label tracking-[0.2em] text-tertiary uppercase">나만의 인사이트</span>
                  </div>
                  <p className="text-white/80 text-[13px] leading-relaxed">
                    {entry.interpretation.personalInsight}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Cluster */}
        <div className="w-full mt-10 space-y-4 flex flex-col items-center">
          {isViewMode ? (
            <>
              <button
                onClick={() => setShowMemo(true)}
                className="w-full py-4 bg-transparent border border-outline-variant text-on-surface rounded-full font-label tracking-widest uppercase hover:bg-surface-container-high transition-all duration-300"
              >
                {entry.journalMemo ? '메모 수정' : '메모 추가'}
              </button>
              <button onClick={onBack} className="pt-2 text-tertiary-fixed-dim text-xs font-label tracking-widest uppercase hover:underline">
                갤러리로 돌아가기
              </button>
            </>
          ) : (
            <>
              {/* Primary Save Button */}
              <button
                onClick={onSave}
                className="w-full py-4 bg-primary-container text-white rounded-full font-label tracking-widest uppercase shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                저장하기
              </button>
              {/* Secondary Share Button */}
              <button
                onClick={onShare}
                className="w-full py-4 bg-transparent border border-outline-variant text-on-surface rounded-full font-label tracking-widest uppercase hover:bg-surface-container-high transition-all duration-300"
              >
                공유하기
              </button>
              {/* Text Link */}
              <button onClick={onRestart} className="pt-2 text-tertiary-fixed-dim text-xs font-label tracking-widest uppercase hover:underline">
                다시 꾸기
              </button>
            </>
          )}
        </div>

        {/* Memo display */}
        {entry.memo && (
          <div className="w-full mt-6 p-4 rounded-xl bg-surface-container-low/40 backdrop-blur-md border-l-2 border-tertiary">
            <p className="text-on-surface-variant text-xs mb-1">기록 메모</p>
            <p className="text-on-surface text-sm">{entry.memo}</p>
          </div>
        )}
        {entry.journalMemo && !showMemo && (
          <div className="w-full mt-4 p-4 rounded-xl bg-surface-container-low/40 backdrop-blur-md border-l-2 border-secondary">
            <p className="text-on-surface-variant text-xs mb-1">추가 메모</p>
            <p className="text-on-surface text-sm">{entry.journalMemo}</p>
          </div>
        )}
      </main>

      {/* BottomNavBar — consistent 기록/갤러리/통계 */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-8 pb-8 pt-4 bg-indigo-950/60 backdrop-blur-xl rounded-t-[40px] border-t border-white/10 shadow-[0_-8px_32px_rgba(79,70,229,0.15)] max-w-[430px]">
        <button onClick={onRestart} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">edit_note</span>
          <span className="font-label text-[10px] tracking-wider">기록</span>
        </button>
        <button onClick={onBack} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">auto_stories</span>
          <span className="font-label text-[10px] tracking-wider">갤러리</span>
        </button>
        <button className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">insights</span>
          <span className="font-label text-[10px] tracking-wider">통계</span>
        </button>
      </nav>

      {/* Memo bottom sheet */}
      {showMemo && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end justify-center">
          <div className="bg-surface-container w-full max-w-[430px] rounded-t-[2rem] p-6 fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline text-lg text-on-surface">꿈 일기 메모</h3>
              <button onClick={() => setShowMemo(false)} className="text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <textarea
              value={journalMemo}
              onChange={e => setJournalMemo(e.target.value.slice(0, 200))}
              placeholder="이 꿈에 대해 더 기록하고 싶은 것이 있나요?"
              maxLength={200}
              rows={4}
              className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-on-surface font-headline text-lg py-4 placeholder:text-on-surface-variant/40 resize-none"
            />
            <p className="text-on-surface-variant text-[10px] text-right mb-4 mt-1">{journalMemo.length}/200</p>
            <button
              onClick={handleSaveMemo}
              className="w-full py-4 bg-primary-container text-white rounded-full font-label tracking-widest uppercase shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
