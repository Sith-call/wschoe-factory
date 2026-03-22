import React, { useState } from 'react';
import type { Product, NightLog, SkinRecord, ProductCategory, CustomVariable } from '../types';
import { getToday, getPrevDate, formatDate } from '../utils/date';
import { ProductSelector } from '../components/ProductSelector';
import { VariableChips } from '../components/VariableChips';

interface Props {
  products: Product[];
  records: Record<string, SkinRecord>;
  pinnedVariables: string[];
  customVariables: CustomVariable[];
  onSave: (date: string, log: NightLog) => void;
  onClose: () => void;
  onAddProduct: (name: string, category: ProductCategory) => void;
  onAddCustomVariable?: (label: string) => void;
  editDate?: string | null;
  showMorningNudge?: boolean;
}

export function NightLogPage({
  products,
  records,
  pinnedVariables,
  customVariables,
  onSave,
  onClose,
  onAddProduct,
  onAddCustomVariable,
  editDate,
  showMorningNudge = true,
}: Props) {
  const date = editDate || getToday();
  const existing = records[date]?.nightLog;
  const prevDate = getPrevDate(date);
  const prevNightLog = records[prevDate]?.nightLog;

  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    existing?.products || []
  );
  const [selectedVariables, setSelectedVariables] = useState<string[]>(
    existing?.variables || []
  );
  const [memo, setMemo] = useState(existing?.memo || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const nightLog: NightLog = {
      products: selectedProducts,
      variables: selectedVariables,
      memo: memo.trim() || undefined,
      loggedAt: new Date().toISOString(),
    };
    onSave(date, nightLog);
    setSaved(true);
  };

  const handleCopyLastNight = () => {
    if (prevNightLog) {
      setSelectedProducts(prevNightLog.products);
      setSelectedVariables(prevNightLog.variables);
    }
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
            <h2 className="font-headline text-2xl font-medium text-on-surface">기록 완료!</h2>
            {showMorningNudge && (
              <div className="bg-primary-fixed/50 rounded-2xl px-6 py-4 flex items-center gap-3 mt-2">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  wb_sunny
                </span>
                <p className="text-sm text-on-surface text-left leading-relaxed">
                  내일 아침에 피부 점수도<br/>기록해봐요
                </p>
              </div>
            )}
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
      <main className="w-full max-w-[430px] bg-surface min-h-screen flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="w-full top-0 sticky z-50 bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={onClose}
              className="active:scale-95 duration-200 hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-primary text-2xl">arrow_back</span>
            </button>
            <h1 className="font-noto-serif text-2xl font-medium tracking-tight text-primary">
              밤 기록
            </h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Date Header */}
        <div className="px-6 pt-2 pb-6 flex flex-col items-center">
          <span className="font-noto-serif text-lg text-on-surface-variant italic opacity-80">
            {formatDate(date)}
          </span>
          <div className="w-12 h-[1px] bg-outline-variant mt-3 opacity-30" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 space-y-10 pb-32 no-scrollbar">
          {/* Products */}
          <section>
            <ProductSelector
              products={products}
              selected={selectedProducts}
              onChange={setSelectedProducts}
              onAddProduct={onAddProduct}
              lastNightProducts={prevNightLog?.products}
              onCopyLastNight={handleCopyLastNight}
            />
          </section>

          {/* Variables */}
          <section className="space-y-4">
            <h2 className="font-noto-serif text-xl font-medium text-on-surface">오늘의 생활 변수</h2>
            <VariableChips
              selected={selectedVariables}
              onChange={setSelectedVariables}
              pinnedVariables={pinnedVariables}
              customVariables={customVariables}
              onAddCustomVariable={onAddCustomVariable}
            />
          </section>

          {/* Memo */}
          <section className="space-y-4">
            <h2 className="font-noto-serif text-xl font-medium text-on-surface">한줄 메모</h2>
            <div className="relative">
              <textarea
                value={memo}
                onChange={e => setMemo(e.target.value)}
                className="w-full min-h-[140px] bg-white rounded-2xl p-6 border-none shadow-inner focus:ring-1 focus:ring-primary-container/30 font-noto-serif text-on-surface placeholder:text-on-surface-variant/40 resize-none leading-relaxed journal-paper"
                placeholder="오늘 피부에 대해 한마디..."
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-on-surface-variant/30 font-manrope">
                STORYTELLING MOMENT
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 flex flex-col justify-center items-center px-6 pb-10 pt-4 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent -z-10 h-full" />
          <div className="w-full flex flex-col items-center gap-3 pointer-events-auto">
            <button
              onClick={handleSave}
              className="flex items-center justify-center w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white shadow-lg active:scale-[0.98] transition-transform"
            >
              <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="font-manrope font-bold uppercase tracking-widest text-sm">기록 완료</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
