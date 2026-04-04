import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function ConsumerSurplusLab({ onComplete, completed }: Props) {
  const [marketPrice, setMarketPrice] = useState(50);
  const [pricesTested, setPricesTested] = useState(0);
  const [lastPrice, setLastPrice] = useState(50);

  const W = 320, H = 240, PAD = 45;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;

  const toX = (q: number) => PAD + (q / 100) * plotW;
  const toY = (p: number) => PAD + ((100 - p) / 100) * plotH;

  // Demand: P = 90 - Q
  const demandP = (q: number) => 90 - q;
  const demandQ = (p: number) => 90 - p;

  const qAtPrice = Math.max(0, demandQ(marketPrice));
  const surplusArea = qAtPrice > 0 ? (90 - marketPrice) * qAtPrice / 2 : 0;

  function handlePriceChange(p: number) {
    setMarketPrice(p);
    if (Math.abs(p - lastPrice) > 15) {
      setPricesTested(prev => prev + 1);
      setLastPrice(p);
    }
  }

  const canComplete = pricesTested >= 3;

  // Surplus triangle path
  const surplusPath = qAtPrice > 0
    ? `M ${toX(0)} ${toY(90)} L ${toX(qAtPrice)} ${toY(marketPrice)} L ${toX(0)} ${toY(marketPrice)} Z`
    : '';

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        소비자잉여 시각화
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        시장 가격을 변경하여 소비자잉여(초록 영역)가 어떻게 변하는지 관찰하세요.
        소비자잉여 = 지불 의사 금액 - 실제 지불 금액의 합.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <text x={PAD - 10} y={PAD - 8} fontSize={10} fill="#78716C">P</text>
          <text x={W - PAD + 8} y={H - PAD + 12} fontSize={10} fill="#78716C">Q</text>

          {/* Consumer surplus triangle */}
          {surplusPath && (
            <path d={surplusPath} fill="#0D9488" fillOpacity={0.25} stroke="#0D9488" strokeWidth={1} />
          )}

          {/* Demand curve */}
          <line x1={toX(0)} y1={toY(90)} x2={toX(90)} y2={toY(0)} stroke="#2563EB" strokeWidth={2.5} />
          <text x={toX(80)} y={toY(demandP(80)) - 8} fontSize={11} fill="#2563EB" fontWeight={600}>D</text>

          {/* Market price line */}
          <line x1={PAD} y1={toY(marketPrice)} x2={W - PAD} y2={toY(marketPrice)} stroke="#D97706" strokeWidth={2} strokeDasharray="6 3" />
          <text x={W - PAD + 4} y={toY(marketPrice) + 4} fontSize={10} fill="#D97706" fontWeight={600}>
            P={marketPrice}
          </text>

          {/* Quantity point */}
          {qAtPrice > 0 && (
            <>
              <circle cx={toX(qAtPrice)} cy={toY(marketPrice)} r={5} fill="#2563EB" />
              <line x1={toX(qAtPrice)} y1={toY(marketPrice)} x2={toX(qAtPrice)} y2={toY(0)} stroke="#2563EB" strokeWidth={1} strokeDasharray="3" />
              <text x={toX(qAtPrice)} y={toY(0) + 14} fontSize={10} fill="#2563EB" textAnchor="middle">Q={Math.round(qAtPrice)}</text>
            </>
          )}

          {/* Surplus label */}
          {surplusArea > 0 && (
            <text x={toX(qAtPrice / 3)} y={toY((90 + marketPrice) / 2)} fontSize={11} fill="#0D9488" fontWeight={600} textAnchor="middle">
              CS
            </text>
          )}
        </svg>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">시장 가격</span>
          <span className="font-display font-semibold text-secondary">{marketPrice}원</span>
        </div>
        <input
          type="range" min={5} max={85} step={1} value={marketPrice}
          onChange={e => handlePriceChange(Number(e.target.value))}
          className="w-full accent-secondary"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">소비자잉여</p>
          <p className="font-display text-xl font-bold text-primary">{Math.round(surplusArea)}</p>
        </div>
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">거래량</p>
          <p className="font-display text-xl font-bold text-ink">{Math.round(qAtPrice)}</p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {marketPrice < 30 ? (
          <p>가격이 매우 낮아 소비자잉여가 큽니다. 소비자들은 지불 의사 금액보다 훨씬 적게 지불하고 있습니다.</p>
        ) : marketPrice > 70 ? (
          <p>가격이 높아 소비자잉여가 작습니다. 소비자 중 일부만 구매하고, 잉여도 적습니다.</p>
        ) : (
          <p>가격이 변하면 소비자잉여(초록 삼각형)의 크기가 변합니다. 가격이 낮을수록 잉여가 커집니다.</p>
        )}
      </div>

      {completed ? (
        <p className="text-sm text-success font-medium">실험 완료! 마스터 달성</p>
      ) : (
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`w-full rounded-md px-5 py-3 font-medium transition-colors ${
            canComplete ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-stone-200 text-ink-disabled cursor-not-allowed'
          }`}
        >
          {canComplete ? '실험 완료' : `가격을 다양하게 변경해보세요 (${pricesTested}/3)`}
        </button>
      )}
    </div>
  );
}
