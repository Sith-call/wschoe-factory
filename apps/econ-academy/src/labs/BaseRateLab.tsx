import React, { useState, useEffect } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function BaseRateLab({ onComplete, completed }: Props) {
  const [baseRate, setBaseRate] = useState(3.0);
  const [animStep, setAnimStep] = useState(0);
  const [changes, setChanges] = useState(0);
  const [lastRate, setLastRate] = useState(3.0);

  const W = 320, H = 280;

  // Transmission: base rate -> market rate -> lending -> investment -> GDP
  const marketRate = baseRate + 1.5;
  const lending = Math.max(0, 100 - baseRate * 8);
  const investment = Math.max(0, 80 - baseRate * 6);
  const gdpGrowth = Math.max(-2, 5 - baseRate * 0.8);

  const stages = [
    { label: '기준금리', value: `${baseRate.toFixed(1)}%`, color: '#2563EB', x: 40 },
    { label: '시장금리', value: `${marketRate.toFixed(1)}%`, color: '#7C3AED', x: 100 },
    { label: '대출', value: `${Math.round(lending)}조`, color: '#D97706', x: 160 },
    { label: '투자', value: `${Math.round(investment)}조`, color: '#0D9488', x: 220 },
    { label: 'GDP성장', value: `${gdpGrowth.toFixed(1)}%`, color: gdpGrowth >= 0 ? '#16A34A' : '#DC2626', x: 280 },
  ];

  useEffect(() => {
    if (animStep < stages.length) {
      const timer = setTimeout(() => setAnimStep(prev => prev + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [animStep, baseRate]);

  function handleChange(val: number) {
    setBaseRate(val);
    setAnimStep(0);
    if (Math.abs(val - lastRate) > 1) {
      setChanges(prev => prev + 1);
      setLastRate(val);
    }
  }

  const canComplete = changes >= 3;

  const nodeR = 22;
  const nodeY = 80;
  const barY = 140;
  const barMaxH = 80;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        기준금리 전달 경로
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        기준금리를 변경하면 시장금리 → 대출 → 투자 → GDP로 효과가 전달됩니다. 각 단계의 변화를 관찰하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Flow nodes */}
          {stages.map((s, i) => {
            const visible = i <= animStep;
            return (
              <React.Fragment key={i}>
                {/* Connection arrow */}
                {i > 0 && (
                  <line
                    x1={stages[i - 1].x + nodeR} y1={nodeY}
                    x2={s.x - nodeR} y2={nodeY}
                    stroke={i <= animStep ? s.color : '#D6D3D1'}
                    strokeWidth={2}
                    markerEnd={`url(#flowArrow${i})`}
                    opacity={i <= animStep ? 1 : 0.3}
                  />
                )}
                <defs>
                  <marker id={`flowArrow${i}`} markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill={i <= animStep ? s.color : '#D6D3D1'} />
                  </marker>
                </defs>

                {/* Node circle */}
                <circle
                  cx={s.x} cy={nodeY} r={nodeR}
                  fill={visible ? s.color : '#E7E5E4'}
                  fillOpacity={visible ? 0.15 : 0.5}
                  stroke={visible ? s.color : '#D6D3D1'}
                  strokeWidth={2}
                />
                <text x={s.x} y={nodeY + 4} fontSize={9} fill={visible ? s.color : '#A8A29E'} textAnchor="middle" fontWeight={600}>
                  {visible ? s.value : '?'}
                </text>

                {/* Label below */}
                <text x={s.x} y={nodeY + nodeR + 14} fontSize={9} fill="#78716C" textAnchor="middle">
                  {s.label}
                </text>
              </React.Fragment>
            );
          })}

          {/* Bar chart section */}
          <text x={W / 2} y={barY} fontSize={10} fill="#78716C" textAnchor="middle" fontWeight={600}>전달 효과 비교</text>

          {[
            { label: '대출', val: lending / 100, color: '#D97706' },
            { label: '투자', val: investment / 80, color: '#0D9488' },
            { label: 'GDP', val: (gdpGrowth + 2) / 7, color: gdpGrowth >= 0 ? '#16A34A' : '#DC2626' },
          ].map((bar, i) => {
            const bx = 60 + i * 90;
            const bh = Math.max(2, bar.val * barMaxH);
            return (
              <React.Fragment key={i}>
                <rect x={bx - 20} y={barY + 15 + barMaxH - bh} width={40} height={bh} rx={3} fill={bar.color} fillOpacity={0.7} />
                <text x={bx} y={barY + 15 + barMaxH + 14} fontSize={9} fill="#78716C" textAnchor="middle">{bar.label}</text>
                <text x={bx} y={barY + 15 + barMaxH - bh - 4} fontSize={9} fill={bar.color} textAnchor="middle" fontWeight={600}>
                  {bar.label === '대출' ? `${Math.round(lending)}조` : bar.label === '투자' ? `${Math.round(investment)}조` : `${gdpGrowth.toFixed(1)}%`}
                </text>
              </React.Fragment>
            );
          })}
        </svg>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">기준금리</span>
          <span className="font-display font-semibold text-ink">{baseRate.toFixed(1)}%</span>
        </div>
        <input
          type="range" min={0.5} max={7} step={0.25} value={baseRate}
          onChange={e => handleChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-ink-secondary mt-1">
          <span>저금리 (0.5%)</span>
          <span>고금리 (7%)</span>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {baseRate < 2 ? (
          <p><strong>저금리 정책</strong>: 시장금리가 낮아져 대출이 활발해지고 투자가 증가합니다. 경기 부양 효과가 있습니다.</p>
        ) : baseRate > 5 ? (
          <p><strong>고금리 정책</strong>: 대출 비용이 높아져 투자와 소비가 위축됩니다. 인플레이션 억제에 효과적입니다.</p>
        ) : (
          <p>기준금리 변경은 <strong>시장금리 → 대출 → 투자 → GDP</strong> 순으로 전달됩니다. 이를 통화정책 전달 경로라 합니다.</p>
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
          {canComplete ? '실험 완료' : `금리를 다양하게 변경하세요 (${changes}/3)`}
        </button>
      )}
    </div>
  );
}
