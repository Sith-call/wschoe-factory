import React, { useState } from 'react';
import type { SkinKeyword, MorningLog, SkinRecord, TroubleArea } from '../types';
import { getToday, formatDate } from '../utils/date';
import { ScoreSelector } from '../components/ScoreSelector';
import { KeywordChips } from '../components/KeywordChips';
import { TroubleAreaMap } from '../components/TroubleAreaMap';

interface Props {
  records: Record<string, SkinRecord>;
  onSave: (date: string, log: MorningLog) => void;
  onClose: () => void;
  editDate?: string | null;
}

export function MorningLogPage({ records, onSave, onClose, editDate }: Props) {
  const date = editDate || getToday();
  const existing = records[date]?.morningLog;

  const [score, setScore] = useState<number | null>(existing?.score || null);
  const [keywords, setKeywords] = useState<SkinKeyword[]>(existing?.keywords || []);
  const [troubleAreas, setTroubleAreas] = useState<TroubleArea[]>(existing?.troubleAreas || []);
  const [memo, setMemo] = useState(existing?.memo || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (score === null) return;

    const morningLog: MorningLog = {
      score: score as 1 | 2 | 3 | 4 | 5,
      keywords,
      troubleAreas: troubleAreas.length > 0 ? troubleAreas : undefined,
      memo: memo.trim() || undefined,
      loggedAt: new Date().toISOString(),
    };
    onSave(date, morningLog);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 bg-surface flex justify-center">
        <main className="w-full max-w-[430px] bg-surface min-h-screen flex flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center gap-6">
            <span
              className="material-symbols-outlined text-primary text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <h2 className="font-headline text-2xl font-medium text-on-surface">아침 기록 완료!</h2>
            <p className="text-sm text-on-surface-variant text-center leading-relaxed">
              오늘도 좋은 하루 보내세요
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 rounded-full bg-primary text-white font-body font-semibold active:scale-95 transition-transform"
            >
              닫기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-surface flex justify-center">
      <div className="w-full max-w-[430px] bg-surface min-h-screen relative pb-32">
        {/* Header */}
        <header className="w-full top-0 sticky z-50 bg-background flex items-center px-6 py-4">
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={onClose}
              className="active:scale-95 transition-transform text-primary"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="font-headline text-lg tracking-tight font-semibold text-primary">
                아침 기록
              </h1>
              <span className="text-[10px] font-body text-on-surface-variant tracking-wider uppercase opacity-70">
                {formatDate(date)}
              </span>
            </div>
          </div>
        </header>

        <main className="px-6 space-y-12 mt-6">
          {/* Score */}
          <section className="space-y-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-headline text-xl text-on-surface">오늘 피부 점수</h2>
              <span className="font-body text-xs text-primary font-medium tracking-widest">STEP 01</span>
            </div>
            <ScoreSelector value={score} onChange={setScore} />
          </section>

          {/* Keywords */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-headline text-xl text-on-surface">피부 키워드</h2>
              <span className="font-body text-xs text-primary font-medium tracking-widest">STEP 02</span>
            </div>
            <KeywordChips selected={keywords} onChange={setKeywords} />
          </section>

          {/* Trouble Areas */}
          <section className="space-y-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <h2 className="font-headline text-xl text-on-surface">트러블 부위</h2>
                <span className="font-body text-xs text-primary font-medium tracking-widest">STEP 03</span>
              </div>
              <p className="text-xs text-on-surface-variant/60 font-body">
                트러블이 있는 부위를 선택하세요 (선택사항)
              </p>
            </div>
            <TroubleAreaMap selected={troubleAreas} onChange={setTroubleAreas} />
          </section>

          {/* Memo */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-headline text-xl text-on-surface">한줄 메모</h2>
              <span className="font-body text-xs text-primary font-medium tracking-widest">FINAL</span>
            </div>
            <div className="relative">
              <textarea
                value={memo}
                onChange={e => setMemo(e.target.value)}
                className="w-full h-24 bg-transparent border-2 border-dashed border-outline-variant/30 rounded-2xl p-4 font-body text-sm focus:ring-0 focus:border-primary-container transition-colors resize-none placeholder:text-on-surface-variant/40"
                placeholder="오늘 아침, 당신의 기분이나 특별한 점을 적어보세요."
              />
              <div className="absolute bottom-3 right-4">
                <span className="material-symbols-outlined text-primary/40 text-sm">edit</span>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Action */}
        <div className="fixed bottom-0 w-full px-6 pb-10 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent z-40 max-w-[430px] left-1/2 -translate-x-1/2">
          <button
            onClick={handleSave}
            disabled={score === null}
            className={`w-full py-4 rounded-full font-body font-semibold text-base shadow-xl active:scale-[0.98] transition-all ${
              score !== null
                ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-primary/20'
                : 'bg-surface-container-highest text-on-surface-variant/40 shadow-none cursor-not-allowed'
            }`}
          >
            기록 완료
          </button>
        </div>
      </div>
    </div>
  );
}
