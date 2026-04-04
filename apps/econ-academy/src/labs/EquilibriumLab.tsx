import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function EquilibriumLab({ onComplete, completed }: Props) {
  const [price, setPrice] = useState(30);
  const [foundEquilibrium, setFoundEquilibrium] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const W = 320, H = 260, PAD = 45;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;

  const toX = (q: number) => PAD + (q / 100) * plotW;
  const toY = (p: number) => PAD + ((100 - p) / 100) * plotH;

  // Demand: Qd = 80 - P, Supply: Qs = P - 20
  const eqPrice = 50; // equilibrium
  const qd = Math.max(0, 80 - price);
  const qs = Math.max(0, price - 20);
  const surplus = qs - qd; // positive = excess supply, negative = excess demand
  const isEq = Math.abs(price - eqPrice) <= 2;

  function handleCheck() {
    setAttempts(prev => prev + 1);
    if (isEq) setFoundEquilibrium(true);
  }

  const canComplete = foundEquilibrium;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        시장 균형 찾기
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        가격 슬라이더를 조절하여 초과공급(빨강)과 초과수요(파랑) 영역이 사라지는 균형가격을 찾으세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <text x={PAD - 10} y={PAD - 8} fontSize={10} fill="#78716C">P</text>
          <text x={W - PAD + 8} y={H - PAD + 12} fontSize={10} fill="#78716C">Q</text>

          {/* Excess supply area (red) - between supply and demand when P > eq */}
          {price > eqPrice + 2 && (
            <polygon
              points={`${toX(qd)},${toY(price)} ${toX(qs)},${toY(price)} ${toX(30)},${toY(eqPrice)}`}
              fill="#DC2626" fillOpacity={0.15} stroke="#DC2626" strokeWidth={1} strokeDasharray="3"
            />
          )}

          {/* Excess demand area (blue) - when P < eq */}
          {price < eqPrice - 2 && (
            <polygon
              points={`${toX(qs)},${toY(price)} ${toX(qd)},${toY(price)} ${toX(30)},${toY(eqPrice)}`}
              fill="#2563EB" fillOpacity={0.15} stroke="#2563EB" strokeWidth={1} strokeDasharray="3"
            />
          )}

          {/* Demand curve */}
          <line x1={toX(0)} y1={toY(80)} x2={toX(80)} y2={toY(0)} stroke="#2563EB" strokeWidth={2.5} />
          <text x={toX(72)} y={toY(8) - 6} fontSize={11} fill="#2563EB" fontWeight={600}>D</text>

          {/* Supply curve */}
          <line x1={toX(0)} y1={toY(20)} x2={toX(80)} y2={toY(100)} stroke="#DC2626" strokeWidth={2.5} />
          <text x={toX(72)} y={toY(92) - 6} fontSize={11} fill="#DC2626" fontWeight={600}>S</text>

          {/* Price line */}
          <line x1={PAD} y1={toY(price)} x2={W - PAD} y2={toY(price)} stroke="#D97706" strokeWidth={2} strokeDasharray="6 3" />

          {/* Qd and Qs markers */}
          {qd > 0 && (
            <>
              <circle cx={toX(qd)} cy={toY(price)} r={5} fill="#2563EB" />
              <text x={toX(qd)} y={toY(price) + 16} fontSize={9} fill="#2563EB" textAnchor="middle">Qd={Math.round(qd)}</text>
            </>
          )}
          {qs > 0 && (
            <>
              <circle cx={toX(qs)} cy={toY(price)} r={5} fill="#DC2626" />
              <text x={toX(qs)} y={toY(price) - 8} fontSize={9} fill="#DC2626" textAnchor="middle">Qs={Math.round(qs)}</text>
            </>
          )}

          {/* Equilibrium marker */}
          {isEq && (
            <>
              <circle cx={toX(30)} cy={toY(eqPrice)} r={8} fill="#0D9488" fillOpacity={0.8} stroke="white" strokeWidth={2} />
              <text x={toX(30) + 12} y={toY(eqPrice) - 6} fontSize={10} fill="#0D9488" fontWeight={600}>균형!</text>
            </>
          )}

          {/* Surplus/shortage label */}
          {!isEq && surplus !== 0 && (
            <text x={W / 2} y={toY(price) + (surplus > 0 ? -12 : 28)} fontSize={10} fill={surplus > 0 ? '#DC2626' : '#2563EB'} textAnchor="middle" fontWeight={600}>
              {surplus > 0 ? `초과공급 ${Math.round(Math.abs(surplus))}단위` : `초과수요 ${Math.round(Math.abs(surplus))}단위`}
            </text>
          )}
        </svg>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">가격 설정</span>
          <span className="font-display font-semibold text-secondary">{price}원</span>
        </div>
        <input
          type="range" min={5} max={95} step={1} value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="w-full accent-secondary"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">수요량</p>
          <p className="font-display text-sm font-semibold text-blue-600">{Math.round(qd)}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">공급량</p>
          <p className="font-display text-sm font-semibold text-red-600">{Math.round(qs)}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">과부족</p>
          <p className={`font-display text-sm font-semibold ${isEq ? 'text-success' : 'text-ink'}`}>
            {isEq ? '균형!' : (surplus > 0 ? `+${Math.round(surplus)}` : Math.round(surplus))}
          </p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {isEq ? (
          <p><strong>균형가격</strong>을 찾았습니다! 수요량과 공급량이 일치하여 시장이 청산됩니다.</p>
        ) : surplus > 0 ? (
          <p><strong>초과공급</strong>: 가격이 너무 높아 팔리지 않는 재고가 쌓입니다. 가격을 내려보세요.</p>
        ) : (
          <p><strong>초과수요</strong>: 가격이 너무 낮아 사려는 사람이 더 많습니다. 가격을 올려보세요.</p>
        )}
      </div>

      {!foundEquilibrium && (
        <button
          onClick={handleCheck}
          className="w-full mb-3 rounded-md px-5 py-2 font-medium border border-primary text-primary hover:bg-primary-light transition-colors"
        >
          균형 확인 (시도 {attempts}회)
        </button>
      )}

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
          {canComplete ? '실험 완료' : '균형가격을 찾아보세요'}
        </button>
      )}
    </div>
  );
}
