import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function InflationLab({ onComplete, completed }: Props) {
  const [inflationRate, setInflationRate] = useState(3);
  const [changes, setChanges] = useState(0);
  const [lastRate, setLastRate] = useState(3);

  const W = 320, H = 220, PAD = 30;
  const barAreaW = W - PAD * 2;
  const years = 10;
  const barW = barAreaW / (years + 1) - 4;

  // Purchasing power each year: 100 / (1 + rate)^year
  const values = Array.from({ length: years + 1 }, (_, y) =>
    100 / Math.pow(1 + inflationRate / 100, y)
  );

  const toX = (y: number) => PAD + y * (barAreaW / (years + 1)) + 2;
  const maxH = H - PAD * 2 - 20;
  const barBase = H - PAD;

  function handleChange(val: number) {
    setInflationRate(val);
    if (Math.abs(val - lastRate) > 2) {
      setChanges(prev => prev + 1);
      setLastRate(val);
    }
  }

  const canComplete = changes >= 4;
  const finalPower = values[years];
  const lostPct = 100 - finalPower;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        구매력 침식 시뮬레이션
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        인플레이션율을 설정하면 100만원의 실질 구매력이 10년간 어떻게 줄어드는지 확인하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Bars */}
          {values.map((v, i) => {
            const h = (v / 100) * maxH;
            const color = v > 80 ? '#0D9488' : v > 60 ? '#D97706' : '#DC2626';
            return (
              <React.Fragment key={i}>
                <rect
                  x={toX(i)} y={barBase - h}
                  width={barW} height={h}
                  rx={2} fill={color} fillOpacity={0.7}
                />
                {/* Lost portion (ghost) */}
                <rect
                  x={toX(i)} y={barBase - maxH}
                  width={barW} height={maxH - h}
                  rx={2} fill="#DC2626" fillOpacity={0.06}
                />
                {/* Year label */}
                <text x={toX(i) + barW / 2} y={barBase + 12} fontSize={8} fill="#78716C" textAnchor="middle">
                  {i}년
                </text>
                {/* Value on top */}
                {(i === 0 || i === 5 || i === years) && (
                  <text x={toX(i) + barW / 2} y={barBase - h - 4} fontSize={9} fill={color} textAnchor="middle" fontWeight={600}>
                    {Math.round(v)}만
                  </text>
                )}
              </React.Fragment>
            );
          })}

          {/* 100 line */}
          <line x1={PAD} y1={barBase - maxH} x2={W - PAD} y2={barBase - maxH} stroke="#78716C" strokeWidth={0.5} strokeDasharray="4" />
          <text x={PAD - 2} y={barBase - maxH - 4} fontSize={8} fill="#78716C">100만</text>

          {/* Erosion arrow */}
          {lostPct > 5 && (
            <>
              <line x1={toX(years) + barW + 8} y1={barBase - maxH} x2={toX(years) + barW + 8} y2={barBase - (finalPower / 100) * maxH} stroke="#DC2626" strokeWidth={1.5} />
              <text x={toX(years) + barW + 12} y={barBase - maxH / 2} fontSize={9} fill="#DC2626" fontWeight={600} writingMode="tb">
                -{Math.round(lostPct)}%
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">연간 인플레이션율</span>
          <span className="font-display font-semibold text-ink">{inflationRate}%</span>
        </div>
        <input
          type="range" min={0} max={20} step={0.5} value={inflationRate}
          onChange={e => handleChange(Number(e.target.value))}
          className="w-full accent-secondary"
        />
        <div className="flex justify-between text-xs text-ink-secondary mt-1">
          <span>0%</span>
          <span>10%</span>
          <span>20%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">10년 후 구매력</p>
          <p className={`font-display text-xl font-bold ${finalPower > 70 ? 'text-success' : finalPower > 50 ? 'text-warning' : 'text-error'}`}>
            {Math.round(finalPower)}만원
          </p>
        </div>
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">구매력 감소</p>
          <p className="font-display text-xl font-bold text-error">-{Math.round(lostPct)}%</p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {inflationRate > 10 ? (
          <p><strong>높은 인플레이션</strong>: 10년 후 구매력이 절반 이하로 떨어집니다. 현금 보유는 실질적 손실을 의미합니다.</p>
        ) : inflationRate > 5 ? (
          <p>연 {inflationRate}% 인플레이션은 10년간 구매력을 {Math.round(lostPct)}% 감소시킵니다. <strong>복리 효과</strong>로 손실이 가속됩니다.</p>
        ) : inflationRate > 0 ? (
          <p>온건한 인플레이션({inflationRate}%)도 장기적으로는 구매력을 상당히 줄입니다. 저축 시 실질수익률을 고려해야 합니다.</p>
        ) : (
          <p>인플레이션이 0%면 구매력이 유지됩니다. 하지만 현실에서는 약간의 인플레이션이 경제에 건전합니다.</p>
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
          {canComplete ? '실험 완료' : `다양한 인플레이션율을 테스트하세요 (${changes}/4)`}
        </button>
      )}
    </div>
  );
}
