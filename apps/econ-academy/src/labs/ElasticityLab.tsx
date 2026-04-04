import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

// Interactive elasticity: adjust price and see quantity response
export function ElasticityLab({ onComplete, completed }: Props) {
  const [elasticity, setElasticity] = useState(1.0);
  const [price, setPrice] = useState(50);
  const [testedElasticities, setTestedElasticities] = useState<Set<string>>(new Set());

  const W = 320, H = 240, PAD = 45;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;

  const baseQ = 50;
  const baseP = 50;
  // Q = baseQ * (baseP / P)^elasticity
  const getQ = (p: number) => baseQ * Math.pow(baseP / Math.max(1, p), elasticity);
  const pctChangeP = ((price - baseP) / baseP * 100);
  const currentQ = getQ(price);
  const pctChangeQ = ((currentQ - baseQ) / baseQ * 100);
  const measuredElasticity = pctChangeP !== 0 ? Math.abs(pctChangeQ / pctChangeP) : 0;

  const revenue = price * currentQ;
  const baseRevenue = baseP * baseQ;

  const toX = (q: number) => PAD + (q / 120) * plotW;
  const toY = (p: number) => PAD + ((100 - p) / 100) * plotH;

  // Generate demand curve
  const curvePoints = Array.from({ length: 50 }, (_, i) => {
    const p = 5 + (i / 49) * 90;
    const q = getQ(p);
    if (q > 120) return null;
    return `${toX(q)},${toY(p)}`;
  }).filter(Boolean).join(' ');

  function handleElasticityChange(e: number) {
    setElasticity(e);
    const label = e < 0.5 ? 'very-inelastic' : e < 1 ? 'inelastic' : e === 1 ? 'unit' : e < 2 ? 'elastic' : 'very-elastic';
    setTestedElasticities(prev => new Set(prev).add(label));
  }

  const canComplete = testedElasticities.size >= 3;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        수요탄력성 실험
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        탄력성 값과 가격을 조절하여 수요곡선의 모양과 매출(가격×수량) 변화를 관찰하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <text x={PAD - 10} y={PAD - 8} fontSize={10} fill="#78716C">P</text>
          <text x={W - PAD + 8} y={H - PAD + 12} fontSize={10} fill="#78716C">Q</text>

          {/* Demand curve */}
          <polyline points={curvePoints} fill="none" stroke="#2563EB" strokeWidth={2.5} />

          {/* Revenue rectangle */}
          <rect
            x={toX(0)} y={toY(price)}
            width={toX(currentQ) - toX(0)} height={toY(0) - toY(price)}
            fill="#0D9488" fillOpacity={0.1} stroke="#0D9488" strokeWidth={1} strokeDasharray="3"
          />
          <text
            x={(toX(0) + toX(currentQ)) / 2} y={(toY(price) + toY(0)) / 2 + 4}
            fontSize={10} fill="#0D9488" textAnchor="middle" fontWeight={600}
          >
            매출 {Math.round(revenue)}
          </text>

          {/* Current point */}
          <circle cx={toX(currentQ)} cy={toY(price)} r={6} fill="#2563EB" />
          <line x1={toX(currentQ)} y1={toY(price)} x2={toX(currentQ)} y2={toY(0)} stroke="#2563EB" strokeWidth={1} strokeDasharray="3" />
          <line x1={toX(0)} y1={toY(price)} x2={toX(currentQ)} y2={toY(price)} stroke="#2563EB" strokeWidth={1} strokeDasharray="3" />

          {/* Base point */}
          <circle cx={toX(baseQ)} cy={toY(baseP)} r={4} fill="#A8A29E" />
          <text x={toX(baseQ) + 8} y={toY(baseP) - 6} fontSize={9} fill="#A8A29E">기준점</text>
        </svg>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ink-secondary">탄력성 (ε)</span>
            <span className="font-display font-semibold text-ink">{elasticity.toFixed(1)}</span>
          </div>
          <input
            type="range" min={0.1} max={3} step={0.1} value={elasticity}
            onChange={e => handleElasticityChange(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-ink-secondary mt-1">
            <span>비탄력적 (0.1)</span>
            <span>단위탄력적 (1.0)</span>
            <span>탄력적 (3.0)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ink-secondary">가격</span>
            <span className="font-display font-semibold text-ink">{price}원</span>
          </div>
          <input
            type="range" min={10} max={90} step={1} value={price}
            onChange={e => setPrice(Number(e.target.value))}
            className="w-full accent-secondary"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">가격 변화</p>
          <p className={`font-display text-sm font-semibold ${pctChangeP > 0 ? 'text-error' : pctChangeP < 0 ? 'text-success' : 'text-ink'}`}>
            {pctChangeP > 0 ? '+' : ''}{pctChangeP.toFixed(0)}%
          </p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">수요량 변화</p>
          <p className={`font-display text-sm font-semibold ${pctChangeQ > 0 ? 'text-success' : pctChangeQ < 0 ? 'text-error' : 'text-ink'}`}>
            {pctChangeQ > 0 ? '+' : ''}{pctChangeQ.toFixed(0)}%
          </p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">매출 변화</p>
          <p className={`font-display text-sm font-semibold ${revenue > baseRevenue ? 'text-success' : revenue < baseRevenue ? 'text-error' : 'text-ink'}`}>
            {revenue > baseRevenue ? '+' : ''}{((revenue - baseRevenue) / baseRevenue * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {elasticity < 1 ? (
          <p><strong>비탄력적 수요 (ε {'<'} 1)</strong>: 가격을 올리면 매출이 증가합니다. 필수재(쌀, 의약품)가 대표적입니다.</p>
        ) : elasticity === 1 ? (
          <p><strong>단위탄력적 (ε = 1)</strong>: 가격 변화율과 수요량 변화율이 같습니다. 매출은 일정합니다.</p>
        ) : (
          <p><strong>탄력적 수요 (ε {'>'} 1)</strong>: 가격을 내리면 매출이 증가합니다. 사치재나 대체재가 많은 재화가 해당됩니다.</p>
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
          {canComplete ? '실험 완료' : `다양한 탄력성을 테스트하세요 (${testedElasticities.size}/3)`}
        </button>
      )}
    </div>
  );
}
