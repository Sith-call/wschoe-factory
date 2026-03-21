import React, { useState } from 'react';
import type { Product, Variable, NightLog, SkinRecord, ProductCategory } from '../types';
import { getToday, getPrevDate } from '../utils/date';
import { CloseIcon } from '../components/Icons';
import { ProductSelector } from '../components/ProductSelector';
import { VariableChips } from '../components/VariableChips';

interface NightLogPageProps {
  products: Product[];
  records: Record<string, SkinRecord>;
  onSave: (date: string, nightLog: NightLog) => void;
  onClose: () => void;
  onAddProduct: (name: string, category: ProductCategory) => void;
  editDate?: string | null;
}

export function NightLogPage({ products, records, onSave, onClose, onAddProduct, editDate }: NightLogPageProps) {
  const targetDate = editDate || getToday();
  const existingLog = records[targetDate]?.nightLog;

  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    existingLog?.products || []
  );
  const [selectedVariables, setSelectedVariables] = useState<Variable[]>(
    existingLog?.variables || []
  );
  const [memo, setMemo] = useState(existingLog?.memo || '');

  const prevDate = getPrevDate(targetDate);
  const prevLog = records[prevDate]?.nightLog;

  const handleCopyPrevious = () => {
    if (prevLog) {
      setSelectedProducts([...prevLog.products]);
      setSelectedVariables([...prevLog.variables]);
    }
  };

  const handleSave = () => {
    onSave(targetDate, {
      products: selectedProducts,
      variables: selectedVariables,
      memo: memo.trim() || undefined,
      loggedAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleClose = () => {
    const hasChanges = selectedProducts.length > 0 || selectedVariables.length > 0;
    if (hasChanges && !existingLog) {
      if (confirm('저장하지 않고 나갈까요?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-sd-bg overflow-y-auto">
      <div className="max-w-[430px] mx-auto min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sd-border">
          <button onClick={handleClose} aria-label="닫기" className="text-sd-text">
            <CloseIcon size={22} />
          </button>
          <span className="font-heading text-lg text-sd-text">밤 기록</span>
          <div className="w-[22px]" />
        </div>

        <div className="flex-1 px-5 py-6 space-y-6">
          {/* Quick copy */}
          {prevLog && (
            <button
              onClick={handleCopyPrevious}
              className="w-full border border-sd-primary text-sd-primary rounded-xl px-5 py-2.5 font-body font-medium text-sm"
            >
              어젯밤과 동일
            </button>
          )}

          {/* Products section */}
          <div>
            <h2 className="font-heading text-lg text-sd-text mb-4">오늘 밤 뭘 발랐어?</h2>
            <ProductSelector
              products={products}
              selected={selectedProducts}
              onChange={setSelectedProducts}
              onAddProduct={onAddProduct}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-sd-border" />

          {/* Variables section */}
          <div>
            <h2 className="font-heading text-lg text-sd-text mb-4">오늘 하루 어땠어?</h2>
            <VariableChips
              selected={selectedVariables}
              onChange={setSelectedVariables}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-sd-border" />

          {/* Memo section */}
          <div>
            <h2 className="font-heading text-lg text-sd-text mb-4">메모</h2>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="오늘 밤 루틴에 대해 메모할 게 있다면 적어봐"
              className="w-full border border-sd-border rounded-xl px-4 py-3 font-body text-sm text-sd-text bg-white resize-none focus:outline-none focus:border-sd-primary"
              rows={3}
            />
          </div>
        </div>

        {/* Save button */}
        <div className="px-5 pb-8 pt-4">
          <button
            onClick={handleSave}
            className="w-full bg-sd-primary text-white rounded-xl px-5 py-3 font-body font-medium"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
