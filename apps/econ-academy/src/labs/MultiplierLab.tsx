import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function MultiplierLab({ onComplete, completed }: Props) {
  const [mpc, setMpc] = useState(0.8); // marginal propensity to consume
  const [govSpending, setGovSpending] = useState(100);
  const [changes, setChanges] = useState(0);

  const W = 320, H = 260, PAD = 30;

  const multiplier = 1 / (1 - mpc);
  const totalEffect = govSpending * multiplier;
  const rounds = 8;

  // Each round: spending * mpc^round
  const roundValues = Array.from({ length: rounds }, (_, i) => govSpending * Math.pow(mpc, i));
  const cumulative = roundValues.reduce<number[]>((acc, v) => {
    acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + v);
    return acc;
  }, []);

  const maxCum = totalEffect;
  const barAreaW = W - PAD * 2;
  const barW = barAreaW / rounds - 6;
  const maxBarH = H - PAD * 2 - 40;
  const barBase = H - PAD - 15;

  function handleMpcChange(val: number) {
    setMpc(val);
    setChanges(prev => prev + 1);
  }

  const canComplete = changes >= 4;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        재정승수 효과 시뮬레이션
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        한계소비성향(MPC)을 조절하여 정부지출이 경제에 미치는 승수 효과를 관찰하세요.
        각 라운드에서 소비가 재소비를 낳는 과정을 봅니다.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Title */}
          <text x={W / 2} y={18} fontSize={10} fill="#78716C" textAnchor="middle">
            정부지출 {govSpending}원의 파급 효과 (승수 = {multiplier.toFixed(1)})
          </text>

          {/* Cascading round bars */}
          {roundValues.map((v, i) => {
            const x = PAD + i * (barAreaW / rounds) + 3;
            const h = Math.max(2, (v / govSpending) * maxBarH * 0.6);
            const cumH = Math.max(2, (cumulative[i] / maxCum) * maxBarH);
            const opacity = 1 - i * 0.08;

            return (
              <React.Fragment key={i}>
                {/* Cumulative bar (background) */}
                <rect x={x} y={barBase - cumH} width={barW} height={cumH} rx={2} fill="#0D9488" fillOpacity={0.1} />

                {/* Round spending bar */}
                <rect x={x} y={barBase - h} width={barW} height={h} rx={2} fill="#2563EB" fillOpacity={opacity} />

                {/* Arrow between rounds */}
                {i < rounds - 1 && (
                  <line
                    x1={x + barW} y1={barBase - h / 2}
                    x2={x + barW + 6} y2={barBase - h / 2}
                    stroke="#78716C" strokeWidth={1} markerEnd="url(#mArrow)"
                  />
                )}

                {/* Round label */}
                <text x={x + barW / 2} y={barBase + 12} fontSize={8} fill="#78716C" textAnchor="middle">R{i + 1}</text>

                {/* Value */}
                {(i === 0 || i === rounds - 1) && (
                  <text x={x + barW / 2} y={barBase - h - 4} fontSize={8} fill="#2563EB" textAnchor="middle" fontWeight={600}>
                    {Math.round(v)}
                  </text>
                )}

                {/* Cumulative label on last */}
                {i === rounds - 1 && (
                  <text x={x + barW / 2} y={barBase - cumH - 4} fontSize={8} fill="#0D9488" textAnchor="middle" fontWeight={600}>
                    누적 {Math.round(cumulative[i])}
                  </text>
                )}
              </React.Fragment>
            );
          })}

          {/* Total effect line */}
          <line x1={PAD} y1={barBase - maxBarH} x2={W - PAD} y2={barBase - maxBarH} stroke="#0D9488" strokeWidth={1} strokeDasharray="4" />
          <text x={W - PAD} y={barBase - maxBarH - 4} fontSize={9} fill="#0D9488" textAnchor="end" fontWeight={600}>
            총효과 = {Math.round(totalEffect)}
          </text>

          <defs>
            <marker id="mArrow" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
              <path d="M0,0 L6,2 L0,4" fill="#78716C" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-0.5">
            <span className="text-ink-secondary">한계소비성향 (MPC)</span>
            <span className="font-display font-semibold text-ink">{mpc.toFixed(2)}</span>
          </div>
          <input type="range" min={0.3} max={0.95} step={0.05} value={mpc} onChange={e => handleMpcChange(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-ink-secondary mt-0.5">
            <span>저축 선호 (0.3)</span>
            <span>소비 선호 (0.95)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">승수</p>
          <p className="font-display text-lg font-bold text-primary">{multiplier.toFixed(1)}배</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">초기 지출</p>
          <p className="font-display text-lg font-bold text-ink">{govSpending}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">총효과</p>
          <p className="font-display text-lg font-bold text-success">{Math.round(totalEffect)}</p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {mpc > 0.8 ? (
          <p>MPC가 높아 승수 효과가 큽니다. 소비 성향이 높은 경제에서는 정부지출의 <strong>파급 효과</strong>가 강합니다.</p>
        ) : mpc < 0.5 ? (
          <p>MPC가 낮아 승수 효과가 작습니다. 저축 성향이 높으면 소비의 연쇄 반응이 빠르게 줄어듭니다.</p>
        ) : (
          <p><strong>승수 = 1/(1-MPC)</strong>. 정부가 1원 쓰면 연쇄 소비를 통해 총 {multiplier.toFixed(1)}원의 경제효과를 만듭니다.</p>
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
          {canComplete ? '실험 완료' : `MPC를 다양하게 변경하세요 (${Math.min(changes, 4)}/4)`}
        </button>
      )}
    </div>
  );
}
