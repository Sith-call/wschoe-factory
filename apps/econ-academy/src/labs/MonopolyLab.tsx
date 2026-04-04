import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function MonopolyLab({ onComplete, completed }: Props) {
  const [price, setPrice] = useState(50);
  const [foundMax, setFoundMax] = useState(false);
  const maxProfitRef = useRef(0);

  const W = 320, H = 260, PAD = 45;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;
  const toX = (q: number) => PAD + (q / 100) * plotW;
  const toY = (p: number) => PAD + ((100 - p) / 100) * plotH;

  // Demand: P = 100 - Q => Q = 100 - P
  // MR = 100 - 2Q
  // MC = 10 + 0.5Q (upward sloping)
  const q = Math.max(0, 100 - price);
  const mc = 10 + 0.5 * q;
  const mr = 100 - 2 * q;
  const totalRevenue = price * q;
  const totalCost = 10 * q + 0.25 * q * q; // integral of MC
  const profit = totalRevenue - totalCost;

  // Optimal: MR = MC => 100 - 2Q = 10 + 0.5Q => 90 = 2.5Q => Q* = 36, P* = 64
  const optimalProfit = 64 * 36 - (10 * 36 + 0.25 * 36 * 36);

  useEffect(() => {
    if (profit > maxProfitRef.current) {
      maxProfitRef.current = profit;
      if (Math.abs(profit - optimalProfit) < 50) setFoundMax(true);
    }
  }, [profit, optimalProfit]);

  const canComplete = foundMax;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        독점기업 이윤 극대화
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        독점기업의 가격을 설정하세요. 수요곡선(파랑), 한계수입(보라), 한계비용(빨강)을 보고
        이윤이 최대가 되는 가격을 찾으세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <text x={PAD - 10} y={PAD - 8} fontSize={10} fill="#78716C">P</text>
          <text x={W - PAD + 8} y={H - PAD + 12} fontSize={10} fill="#78716C">Q</text>

          {/* Demand curve: P = 100 - Q */}
          <line x1={toX(0)} y1={toY(100)} x2={toX(100)} y2={toY(0)} stroke="#2563EB" strokeWidth={2} />
          <text x={toX(90)} y={toY(10) - 6} fontSize={10} fill="#2563EB" fontWeight={600}>D</text>

          {/* MR: P = 100 - 2Q */}
          <line x1={toX(0)} y1={toY(100)} x2={toX(50)} y2={toY(0)} stroke="#7C3AED" strokeWidth={2} strokeDasharray="4" />
          <text x={toX(45)} y={toY(10) + 14} fontSize={10} fill="#7C3AED" fontWeight={600}>MR</text>

          {/* MC: P = 10 + 0.5Q */}
          <line x1={toX(0)} y1={toY(10)} x2={toX(100)} y2={toY(60)} stroke="#DC2626" strokeWidth={2} />
          <text x={toX(85)} y={toY(52.5) - 6} fontSize={10} fill="#DC2626" fontWeight={600}>MC</text>

          {/* Profit rectangle */}
          {q > 0 && profit > 0 && (
            <rect
              x={toX(0)} y={toY(price)}
              width={toX(q) - toX(0)} height={toY(mc) - toY(price)}
              fill="#0D9488" fillOpacity={0.15} stroke="#0D9488" strokeWidth={1}
            />
          )}
          {q > 0 && profit > 0 && (
            <text x={(toX(0) + toX(q)) / 2} y={(toY(price) + toY(mc)) / 2 + 4} fontSize={10} fill="#0D9488" textAnchor="middle" fontWeight={600}>
              이윤
            </text>
          )}

          {/* Current point */}
          {q > 0 && (
            <>
              <circle cx={toX(q)} cy={toY(price)} r={5} fill="#2563EB" />
              <line x1={toX(q)} y1={toY(price)} x2={toX(q)} y2={toY(0)} stroke="#78716C" strokeWidth={1} strokeDasharray="3" />
              <line x1={PAD} y1={toY(price)} x2={toX(q)} y2={toY(price)} stroke="#78716C" strokeWidth={1} strokeDasharray="3" />
            </>
          )}

          {/* MR=MC intersection */}
          <circle cx={toX(36)} cy={toY(28)} r={4} fill="#D97706" stroke="white" strokeWidth={1.5} />
          <text x={toX(36) + 8} y={toY(28) - 6} fontSize={9} fill="#D97706">MR=MC</text>
        </svg>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">독점 가격</span>
          <span className="font-display font-semibold text-ink">{price}원</span>
        </div>
        <input
          type="range" min={15} max={95} step={1} value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">판매량</p>
          <p className="font-display text-sm font-semibold text-ink">{Math.round(q)}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">총수입</p>
          <p className="font-display text-sm font-semibold text-blue-600">{Math.round(totalRevenue)}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">이윤</p>
          <p className={`font-display text-sm font-semibold ${profit > 0 ? 'text-success' : 'text-error'}`}>{Math.round(profit)}</p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {Math.abs(price - 64) <= 3 ? (
          <p><strong>이윤 극대화 가격!</strong> MR=MC인 수량에서 수요곡선 위의 가격을 설정하면 이윤이 최대입니다.</p>
        ) : price > 64 ? (
          <p>가격이 너무 높습니다. 판매량이 줄어 총이윤이 감소합니다. MR과 MC가 만나는 점을 찾아보세요.</p>
        ) : (
          <p>가격이 낮습니다. 판매량은 많지만 단위당 마진이 작습니다. 가격을 올려보세요.</p>
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
          {canComplete ? '실험 완료' : '이윤이 최대가 되는 가격을 찾으세요'}
        </button>
      )}
    </div>
  );
}
