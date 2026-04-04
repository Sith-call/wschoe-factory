import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function RealGDPLab({ onComplete, completed }: Props) {
  const [inflation, setInflation] = useState(3);
  const [realGrowth, setRealGrowth] = useState(2);
  const [changes, setChanges] = useState(0);

  const W = 320, H = 240, PAD = 45;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;

  const years = 10;
  const baseGDP = 100;

  const nominalData: number[] = [];
  const realData: number[] = [];
  for (let y = 0; y <= years; y++) {
    const nomRate = (realGrowth + inflation) / 100;
    const realRate = realGrowth / 100;
    nominalData.push(baseGDP * Math.pow(1 + nomRate, y));
    realData.push(baseGDP * Math.pow(1 + realRate, y));
  }

  const maxVal = Math.max(...nominalData);
  const toX = (y: number) => PAD + (y / years) * plotW;
  const toY = (v: number) => PAD + ((maxVal - v) / maxVal) * plotH;

  const nominalPoints = nominalData.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const realPoints = realData.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');

  // Gap between nominal and real at year 10
  const gap = nominalData[years] - realData[years];
  const gapPct = ((nominalData[years] / realData[years]) - 1) * 100;

  function handleChange(setter: (v: number) => void, val: number) {
    setter(val);
    setChanges(prev => prev + 1);
  }

  const canComplete = changes >= 6;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        명목 GDP vs 실질 GDP
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        인플레이션율과 실질성장률을 조절하여 10년간 명목GDP(주황)와 실질GDP(파랑)의 차이를 관찰하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <text x={PAD - 8} y={PAD - 8} fontSize={10} fill="#78716C">GDP</text>
          <text x={W - PAD + 4} y={H - PAD + 12} fontSize={10} fill="#78716C">년</text>

          {/* Year labels */}
          {[0, 5, 10].map(y => (
            <text key={y} x={toX(y)} y={H - PAD + 14} fontSize={9} fill="#78716C" textAnchor="middle">{y}</text>
          ))}

          {/* Gap shading between nominal and real */}
          <polygon
            points={[
              ...nominalData.map((v, i) => `${toX(i)},${toY(v)}`),
              ...[...realData].reverse().map((v, i) => `${toX(years - i)},${toY(v)}`),
            ].join(' ')}
            fill="#D97706" fillOpacity={0.1}
          />

          {/* Nominal GDP line */}
          <polyline points={nominalPoints} fill="none" stroke="#D97706" strokeWidth={2.5} />
          {nominalData.map((v, i) => i % 2 === 0 && (
            <circle key={`n${i}`} cx={toX(i)} cy={toY(v)} r={3} fill="#D97706" />
          ))}
          <text x={toX(years) + 4} y={toY(nominalData[years]) + 4} fontSize={9} fill="#D97706" fontWeight={600}>명목</text>

          {/* Real GDP line */}
          <polyline points={realPoints} fill="none" stroke="#2563EB" strokeWidth={2.5} />
          {realData.map((v, i) => i % 2 === 0 && (
            <circle key={`r${i}`} cx={toX(i)} cy={toY(v)} r={3} fill="#2563EB" />
          ))}
          <text x={toX(years) + 4} y={toY(realData[years]) + 4} fontSize={9} fill="#2563EB" fontWeight={600}>실질</text>

          {/* Gap label */}
          {gap > 5 && (
            <>
              <line x1={toX(years) - 10} y1={toY(nominalData[years])} x2={toX(years) - 10} y2={toY(realData[years])} stroke="#DC2626" strokeWidth={1.5} markerStart="url(#arrowUp)" markerEnd="url(#arrowDown)" />
              <text x={toX(years) - 20} y={(toY(nominalData[years]) + toY(realData[years])) / 2 + 4} fontSize={9} fill="#DC2626" textAnchor="end" fontWeight={600}>
                괴리 {Math.round(gapPct)}%
              </text>
            </>
          )}
          <defs>
            <marker id="arrowUp" markerWidth={6} markerHeight={6} refX={3} refY={6} orient="auto"><path d="M0,6 L3,0 L6,6" fill="#DC2626" /></marker>
            <marker id="arrowDown" markerWidth={6} markerHeight={6} refX={3} refY={0} orient="auto"><path d="M0,0 L3,6 L6,0" fill="#DC2626" /></marker>
          </defs>
        </svg>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-0.5">
            <span className="text-ink-secondary">인플레이션율</span>
            <span className="font-display font-semibold text-secondary">{inflation}%</span>
          </div>
          <input type="range" min={0} max={15} step={0.5} value={inflation} onChange={e => handleChange(setInflation, Number(e.target.value))} className="w-full accent-secondary" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-0.5">
            <span className="text-ink-secondary">실질성장률</span>
            <span className="font-display font-semibold text-primary">{realGrowth}%</span>
          </div>
          <input type="range" min={-2} max={10} step={0.5} value={realGrowth} onChange={e => handleChange(setRealGrowth, Number(e.target.value))} className="w-full accent-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">10년후 명목GDP</p>
          <p className="font-display text-lg font-bold text-amber-600">{Math.round(nominalData[years])}</p>
        </div>
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">10년후 실질GDP</p>
          <p className="font-display text-lg font-bold text-blue-600">{Math.round(realData[years])}</p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {inflation > 8 ? (
          <p>높은 인플레이션으로 명목GDP가 크게 부풀려져 있습니다. <strong>실질GDP</strong>만이 실제 생활수준 변화를 반영합니다.</p>
        ) : inflation < 1 ? (
          <p>인플레이션이 거의 없어 명목GDP와 실질GDP가 거의 같습니다. 디플레이션 위험을 주의해야 합니다.</p>
        ) : (
          <p>명목GDP에서 물가 상승분을 제거한 것이 <strong>실질GDP</strong>입니다. 경제성장의 실체를 파악하려면 실질GDP를 봐야 합니다.</p>
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
          {canComplete ? '실험 완료' : `다양한 설정을 시도하세요 (${Math.min(changes, 6)}/6)`}
        </button>
      )}
    </div>
  );
}
