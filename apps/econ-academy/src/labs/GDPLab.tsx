import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function GDPLab({ onComplete, completed }: Props) {
  const [C, setC] = useState(55);
  const [I, setI] = useState(20);
  const [G, setG] = useState(18);
  const [NX, setNX] = useState(-3);
  const [changes, setChanges] = useState(0);

  const GDP = C + I + G + NX;
  const W = 320, H = 200, PAD = 40;
  const barMaxW = W - PAD * 2;

  // Positive components stacked
  const positives = [
    { label: 'C', value: C, color: '#2563EB' },
    { label: 'I', value: I, color: '#0D9488' },
    { label: 'G', value: G, color: '#D97706' },
  ];
  const positiveTotal = C + I + G;
  const scale = barMaxW / Math.max(positiveTotal, 1);

  function handleSlider(setter: (v: number) => void, val: number) {
    setter(val);
    setChanges(prev => prev + 1);
  }

  const canComplete = changes >= 8;

  return (
    <div>
      <p className="text-base text-ink-secondary mb-4">
        GDP = C + I + G + NX. 각 구성요소를 조절하여 경제 구조를 탐색하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-4 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Positive components — stacked horizontal bar */}
          <text x={PAD} y={30} fontSize={10} fill="#78716C">양의 구성요소 (C + I + G = {positiveTotal}조)</text>
          {(() => {
            let x = PAD;
            return positives.map((p, i) => {
              const w = p.value * scale;
              const el = (
                <React.Fragment key={i}>
                  <rect x={x} y={40} width={w} height={32} fill={p.color} fillOpacity={0.8} rx={i === 0 ? 4 : 0} />
                  {w > 25 && (
                    <text x={x + w / 2} y={60} fontSize={10} fill="white" textAnchor="middle" fontWeight={600}>
                      {p.label} {p.value}
                    </text>
                  )}
                </React.Fragment>
              );
              x += w;
              return el;
            });
          })()}

          {/* NX — separate bar below (can be negative) */}
          <text x={PAD} y={100} fontSize={10} fill="#78716C">
            순수출 (NX = {NX > 0 ? '+' : ''}{NX}조)
          </text>
          {NX >= 0 ? (
            <rect x={PAD} y={110} width={NX * scale} height={24} fill="#16A34A" fillOpacity={0.7} rx={4} />
          ) : (
            <rect x={PAD} y={110} width={Math.abs(NX) * scale} height={24} fill="#DC2626" fillOpacity={0.7} rx={4} />
          )}
          {Math.abs(NX) > 2 && (
            <text x={PAD + Math.abs(NX) * scale / 2} y={126} fontSize={10} fill="white" textAnchor="middle" fontWeight={600}>
              {NX > 0 ? '흑자' : '적자'} {Math.abs(NX)}
            </text>
          )}

          {/* GDP total */}
          <line x1={PAD} y1={150} x2={W - PAD} y2={150} stroke="#E7E5E4" strokeWidth={1} />
          <text x={PAD} y={170} fontSize={12} fill="#1C1917" fontWeight={700}>
            GDP = {GDP}조
          </text>
          <text x={PAD} y={185} fontSize={9} fill="#78716C">
            = {C}(C) + {I}(I) + {G}(G) + ({NX})(NX)
          </text>
        </svg>
      </div>

      <div className="space-y-3 mb-4">
        {[
          { label: '소비 (C)', value: C, set: setC, min: 30, max: 80, color: '#2563EB' },
          { label: '투자 (I)', value: I, set: setI, min: 5, max: 40, color: '#0D9488' },
          { label: '정부지출 (G)', value: G, set: setG, min: 5, max: 35, color: '#D97706' },
          { label: '순수출 (NX)', value: NX, set: setNX, min: -15, max: 15, color: NX >= 0 ? '#16A34A' : '#DC2626' },
        ].map((s, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-0.5">
              <span className="text-ink-secondary">{s.label}</span>
              <span className="font-display font-semibold" style={{ color: s.color }}>{s.value}조</span>
            </div>
            <input
              type="range" min={s.min} max={s.max} step={1} value={s.value}
              onChange={e => handleSlider(s.set, Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        ))}
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {NX < -10 ? (
          <p>순수출이 크게 적자입니다. 수입이 수출보다 많아 GDP에서 <strong>차감</strong>됩니다. NX가 음수면 GDP를 줄이는 효과입니다.</p>
        ) : C / GDP > 0.65 ? (
          <p>소비 비중 {Math.round(C / GDP * 100)}%. 미국처럼 <strong>소비 주도 경제</strong>입니다.</p>
        ) : I / GDP > 0.3 ? (
          <p>투자 비중이 높습니다. 고성장기 한국·중국처럼 <strong>투자 주도 성장</strong>입니다.</p>
        ) : (
          <p><strong>GDP = C + I + G + NX</strong>. 한국은 C≈50%, I≈30%, G≈17%, NX≈3%입니다.</p>
        )}
      </div>

      {completed ? (
        <p className="text-sm text-success font-medium">실험 완료!</p>
      ) : (
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium transition-colors ${
            canComplete ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'
          }`}
        >
          {canComplete ? '실험 완료' : `다양한 조합을 시도하세요 (${Math.min(changes, 8)}/8)`}
        </button>
      )}
    </div>
  );
}
