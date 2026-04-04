import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function OpportunityCostLab({ onComplete, completed }: Props) {
  const [allocation, setAllocation] = useState(50);
  const [changes, setChanges] = useState(0);
  const [lastAlloc, setLastAlloc] = useState(50);

  const budget = 1000;
  const priceA = 10;
  const priceB = 50;

  const spendA = Math.round(budget * allocation / 100);
  const spendB = budget - spendA;
  const qtyA = Math.floor(spendA / priceA);
  const qtyB = Math.floor(spendB / priceB);
  const ocA = (priceA / priceB).toFixed(1);
  const ocB = (priceB / priceA);

  function handleChange(val: number) {
    setAllocation(val);
    if (Math.abs(val - lastAlloc) > 20) {
      setChanges(prev => prev + 1);
      setLastAlloc(val);
    }
  }

  const canComplete = changes >= 3;

  return (
    <div>
      <p className="text-base text-ink-secondary mb-6">
        예산 <span className="font-display font-semibold text-ink">{budget.toLocaleString()}원</span>을 식사와 책에 배분하세요.
        한쪽에 더 쓰면 다른 쪽을 반드시 포기해야 합니다.
      </p>

      {/* Visual allocation */}
      <div className="mb-6">
        {/* Allocation bar */}
        <div className="flex rounded-lg overflow-hidden h-14 mb-3">
          <div
            className="flex items-center justify-center transition-all duration-200"
            style={{ width: `${Math.max(allocation, 8)}%`, backgroundColor: '#0D9488' }}
          >
            <span className="text-white font-display font-bold text-sm whitespace-nowrap">
              식사 {qtyA}끼
            </span>
          </div>
          <div
            className="flex items-center justify-center transition-all duration-200"
            style={{ width: `${Math.max(100 - allocation, 8)}%`, backgroundColor: '#2563EB' }}
          >
            <span className="text-white font-display font-bold text-sm whitespace-nowrap">
              책 {qtyB}권
            </span>
          </div>
        </div>

        {/* Slider */}
        <input
          type="range" min={0} max={100} step={5} value={allocation}
          onChange={e => handleChange(Number(e.target.value))}
          className="w-full accent-primary h-2"
        />
        <div className="flex justify-between text-xs text-ink-secondary mt-1">
          <span>전부 책</span>
          <span className="font-display font-semibold text-ink">{allocation}%</span>
          <span>전부 식사</span>
        </div>
      </div>

      {/* Trade-off cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-lg p-4" style={{ backgroundColor: '#F0FDFA' }}>
          <p className="text-xs text-ink-secondary mb-1">식사에 투자</p>
          <p className="font-display text-2xl font-bold" style={{ color: '#0D9488' }}>{spendA.toLocaleString()}원</p>
          <p className="font-display text-sm font-semibold text-ink mt-1">{qtyA}끼</p>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: '#EFF6FF' }}>
          <p className="text-xs text-ink-secondary mb-1">책에 투자</p>
          <p className="font-display text-2xl font-bold" style={{ color: '#2563EB' }}>{spendB.toLocaleString()}원</p>
          <p className="font-display text-sm font-semibold text-ink mt-1">{qtyB}권</p>
        </div>
      </div>

      {/* Opportunity cost highlight */}
      <div className="border border-border rounded-lg p-4 mb-6">
        <p className="font-display text-sm font-semibold text-ink mb-3">기회비용</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#0D9488' }} />
            <span className="text-sm text-ink">
              식사 1끼를 더 먹으면 → 책 <span className="font-display font-bold text-error">{ocA}권</span> 포기
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#2563EB' }} />
            <span className="text-sm text-ink">
              책 1권을 더 사면 → 식사 <span className="font-display font-bold text-error">{ocB}끼</span> 포기
            </span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="border-l-2 border-primary pl-4 text-sm text-ink leading-relaxed mb-6">
        {allocation > 70 ? (
          <p>식사에 집중하여 책을 <strong>{qtyB}권만</strong> 살 수 있습니다. 식사 1끼의 기회비용은 책 {ocA}권 — 매번 선택할 때마다 이 대가를 치르고 있습니다.</p>
        ) : allocation < 30 ? (
          <p>책에 집중하여 식사를 <strong>{qtyA}끼로</strong> 줄였습니다. 지식 투자를 선택한 대가로 식사를 포기하는 것, 이것이 기회비용입니다.</p>
        ) : (
          <p>슬라이더를 양 극단으로 움직여 보세요. <strong>"공짜 점심은 없다"</strong> — 한쪽을 늘리면 반드시 다른 쪽이 줄어드는 것을 직접 확인하세요.</p>
        )}
      </div>

      {completed ? (
        <div className="flex items-center gap-2 text-success font-medium text-sm p-3 rounded-lg bg-green-50">
          실험 완료! 기회비용의 개념을 체험했습니다.
        </div>
      ) : (
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3.5 font-medium text-sm transition-colors ${
            canComplete ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'
          }`}
        >
          {canComplete ? '실험 완료' : `배분을 다양하게 바꿔보세요 (${changes}/3)`}
        </button>
      )}
    </div>
  );
}
