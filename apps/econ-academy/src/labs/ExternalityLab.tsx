import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function ExternalityLab({ onComplete, completed }: Props) {
  const [tax, setTax] = useState(0);
  const [foundOptimal, setFoundOptimal] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const W = 320, H = 260, PAD = 45;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;
  const toX = (q: number) => PAD + (q / 100) * plotW;
  const toY = (p: number) => PAD + ((100 - p) / 100) * plotH;

  // Demand: P = 80 - Q
  // Private MC: P = 10 + 0.5Q
  // Social MC: P = 10 + 0.5Q + 20 (pollution cost = 20)
  // With tax: Effective MC = 10 + 0.5Q + tax
  const pollutionCost = 20;
  const optimalTax = pollutionCost;

  // Market Q without tax: 80 - Q = 10 + 0.5Q => 70 = 1.5Q => Q = 46.7
  // Market Q with tax:  80 - Q = 10 + 0.5Q + tax => Q = (70 - tax) / 1.5
  // Social optimum: 80 - Q = 30 + 0.5Q => 50 = 1.5Q => Q = 33.3
  const qMarket = Math.max(0, (70 - tax) / 1.5);
  const qSocial = 50 / 1.5;
  const qNoTax = 70 / 1.5;

  const deadweightLoss = 0.5 * Math.abs(qMarket - qSocial) * pollutionCost;
  const maxDWL = 0.5 * Math.abs(qNoTax - qSocial) * pollutionCost;

  function handleCheck() {
    setAttempts(prev => prev + 1);
    if (Math.abs(tax - optimalTax) <= 2) setFoundOptimal(true);
  }

  const canComplete = foundOptimal;

  // DWL triangle points
  const dMin = Math.min(qMarket, qSocial);
  const dMax = Math.max(qMarket, qSocial);

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        외부효과와 피구세 시뮬레이션
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        오염세(피구세)를 조절하여 사적비용을 사회적비용에 일치시키세요. 경제적 손실(노란 삼각형)이 사라지는 세율을 찾으세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <text x={PAD - 10} y={PAD - 8} fontSize={10} fill="#78716C">P</text>
          <text x={W - PAD + 8} y={H - PAD + 12} fontSize={10} fill="#78716C">Q</text>

          {/* DWL triangle */}
          {deadweightLoss > 5 && (
            <polygon
              points={`${toX(qSocial)},${toY(80 - qSocial)} ${toX(qMarket)},${toY(80 - qMarket)} ${toX(qSocial)},${toY(30 + 0.5 * qSocial)}`}
              fill="#EAB308" fillOpacity={0.3} stroke="#EAB308" strokeWidth={1}
            />
          )}

          {/* Demand */}
          <line x1={toX(0)} y1={toY(80)} x2={toX(80)} y2={toY(0)} stroke="#2563EB" strokeWidth={2} />
          <text x={toX(75)} y={toY(5) - 6} fontSize={10} fill="#2563EB" fontWeight={600}>D</text>

          {/* Private MC */}
          <line x1={toX(0)} y1={toY(10)} x2={toX(80)} y2={toY(50)} stroke="#DC2626" strokeWidth={2} />
          <text x={toX(75)} y={toY(47.5) - 6} fontSize={10} fill="#DC2626" fontWeight={500}>사적MC</text>

          {/* Social MC */}
          <line x1={toX(0)} y1={toY(30)} x2={toX(80)} y2={toY(70)} stroke="#7C3AED" strokeWidth={2} strokeDasharray="4" />
          <text x={toX(70)} y={toY(65) - 6} fontSize={10} fill="#7C3AED" fontWeight={500}>사회적MC</text>

          {/* Effective MC with tax */}
          {tax > 0 && (
            <>
              <line x1={toX(0)} y1={toY(10 + tax)} x2={toX(80)} y2={toY(50 + tax)} stroke="#0D9488" strokeWidth={2.5} />
              <text x={toX(60)} y={toY(40 + tax) - 6} fontSize={10} fill="#0D9488" fontWeight={600}>MC+세금</text>
            </>
          )}

          {/* Market point */}
          <circle cx={toX(qMarket)} cy={toY(80 - qMarket)} r={5} fill="#0D9488" />

          {/* Social optimum marker */}
          <circle cx={toX(qSocial)} cy={toY(80 - qSocial)} r={4} fill="#7C3AED" stroke="white" strokeWidth={1.5} />
          <text x={toX(qSocial) - 4} y={toY(80 - qSocial) - 10} fontSize={9} fill="#7C3AED">최적</text>

          {/* DWL label */}
          {deadweightLoss > 20 && (
            <text x={toX((qMarket + qSocial) / 2)} y={toY(50)} fontSize={9} fill="#92400E" textAnchor="middle" fontWeight={600}>
              DWL
            </text>
          )}
        </svg>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">오염세 (피구세)</span>
          <span className="font-display font-semibold text-ink">{tax}원</span>
        </div>
        <input
          type="range" min={0} max={40} step={1} value={tax}
          onChange={e => setTax(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">경제적 손실 (DWL)</p>
          <p className={`font-display text-xl font-bold ${deadweightLoss < 10 ? 'text-success' : 'text-warning'}`}>
            {Math.round(deadweightLoss)}
          </p>
        </div>
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">시장 거래량</p>
          <p className="font-display text-xl font-bold text-ink">{Math.round(qMarket)}</p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {Math.abs(tax - optimalTax) <= 2 ? (
          <p><strong>최적 피구세!</strong> 세금이 외부비용과 같아져 사적비용이 사회적비용에 일치합니다. 경제적 손실이 제거됩니다.</p>
        ) : tax < optimalTax ? (
          <p>세금이 부족합니다. 기업이 오염 비용을 부담하지 않아 과다 생산이 발생합니다. 세금을 올려보세요.</p>
        ) : (
          <p>세금이 과도합니다. 생산이 사회적 최적 수준 이하로 줄어들어 새로운 비효율이 생깁니다.</p>
        )}
      </div>

      {!foundOptimal && (
        <button
          onClick={handleCheck}
          className="w-full mb-3 rounded-md px-5 py-2 font-medium border border-primary text-primary hover:bg-primary-light transition-colors"
        >
          최적세율 확인 (시도 {attempts}회)
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
          {canComplete ? '실험 완료' : 'DWL을 0에 가깝게 만드세요'}
        </button>
      )}
    </div>
  );
}
