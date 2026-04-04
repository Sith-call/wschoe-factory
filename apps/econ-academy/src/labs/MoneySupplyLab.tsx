import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function MoneySupplyLab({ onComplete, completed }: Props) {
  const [moneySupply, setMoneySupply] = useState(50);
  const [changes, setChanges] = useState(0);
  const [lastMS, setLastMS] = useState(50);

  const W = 320, H = 260, PAD = 45;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;
  const toX = (v: number) => PAD + (v / 100) * plotW;
  const toY = (v: number) => PAD + ((100 - v) / 100) * plotH;

  // LM curve shifts with money supply
  // IS: r = 80 - Y (downward sloping)
  // LM: r = -40 + Y + (100 - moneySupply) * 0.6
  // => LM shifts down when money supply increases
  const lmShift = (100 - moneySupply) * 0.6;

  // Equilibrium: 80 - Y = -40 + Y + lmShift => 120 - lmShift = 2Y => Y = (120 - lmShift)/2
  const eqY = Math.max(5, Math.min(95, (120 - lmShift) / 2));
  const eqR = Math.max(5, Math.min(95, 80 - eqY));

  function handleChange(val: number) {
    setMoneySupply(val);
    if (Math.abs(val - lastMS) > 15) {
      setChanges(prev => prev + 1);
      setLastMS(val);
    }
  }

  const canComplete = changes >= 3;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        IS-LM 모형: 통화량과 이자율
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        중앙은행이 통화량을 조절하면 LM곡선이 이동합니다. 이자율과 국민소득의 변화를 관찰하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <text x={PAD - 10} y={PAD - 8} fontSize={10} fill="#78716C">r</text>
          <text x={W - PAD + 8} y={H - PAD + 12} fontSize={10} fill="#78716C">Y</text>

          {/* Grid */}
          {[25, 50, 75].map(v => (
            <React.Fragment key={v}>
              <line x1={PAD} y1={toY(v)} x2={W - PAD} y2={toY(v)} stroke="#E7E5E4" strokeWidth={0.5} />
              <line x1={toX(v)} y1={PAD} x2={toX(v)} y2={H - PAD} stroke="#E7E5E4" strokeWidth={0.5} />
            </React.Fragment>
          ))}

          {/* IS curve (blue) - downward sloping */}
          <line x1={toX(5)} y1={toY(75)} x2={toX(75)} y2={toY(5)} stroke="#2563EB" strokeWidth={2.5} />
          <text x={toX(72)} y={toY(8) + 14} fontSize={11} fill="#2563EB" fontWeight={600}>IS</text>

          {/* LM curve (red) - upward sloping, shifts */}
          <line
            x1={toX(5)} y1={toY(Math.max(0, -35 + lmShift))}
            x2={toX(95)} y2={toY(Math.min(100, 55 + lmShift))}
            stroke="#DC2626" strokeWidth={2.5}
          />
          <text x={toX(88)} y={toY(Math.min(95, 48 + lmShift)) - 6} fontSize={11} fill="#DC2626" fontWeight={600}>LM</text>

          {/* Original LM (ghost) */}
          {Math.abs(moneySupply - 50) > 5 && (
            <>
              <line x1={toX(5)} y1={toY(-5)} x2={toX(95)} y2={toY(85)} stroke="#DC2626" strokeWidth={1} strokeDasharray="4" strokeOpacity={0.3} />
              <text x={toX(85)} y={toY(80) - 6} fontSize={9} fill="#DC2626" fillOpacity={0.4}>LM₀</text>
            </>
          )}

          {/* Equilibrium point */}
          <circle cx={toX(eqY)} cy={toY(eqR)} r={7} fill="#0D9488" fillOpacity={0.8} stroke="white" strokeWidth={2} />
          <line x1={toX(eqY)} y1={toY(eqR)} x2={toX(eqY)} y2={toY(0)} stroke="#0D9488" strokeWidth={1} strokeDasharray="3" />
          <line x1={PAD} y1={toY(eqR)} x2={toX(eqY)} y2={toY(eqR)} stroke="#0D9488" strokeWidth={1} strokeDasharray="3" />
          <text x={toX(eqY) + 10} y={toY(eqR) - 8} fontSize={10} fill="#0D9488" fontWeight={600}>
            E (Y={Math.round(eqY)}, r={Math.round(eqR)})
          </text>
        </svg>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">통화량 (M)</span>
          <span className="font-display font-semibold text-ink">{moneySupply}</span>
        </div>
        <input
          type="range" min={10} max={90} step={1} value={moneySupply}
          onChange={e => handleChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-ink-secondary mt-1">
          <span>긴축</span>
          <span>확장</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">균형 이자율</p>
          <p className="font-display text-xl font-bold text-ink">{Math.round(eqR)}%</p>
        </div>
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">균형 소득</p>
          <p className="font-display text-xl font-bold text-primary">{Math.round(eqY)}</p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {moneySupply > 60 ? (
          <p><strong>확장적 통화정책</strong>: 통화량이 증가하면 LM곡선이 오른쪽으로 이동합니다. 이자율이 하락하고 소득이 증가합니다.</p>
        ) : moneySupply < 40 ? (
          <p><strong>긴축적 통화정책</strong>: 통화량이 감소하면 LM곡선이 왼쪽으로 이동합니다. 이자율이 상승하고 소득이 감소합니다.</p>
        ) : (
          <p>통화량을 조절하여 LM곡선의 이동과 균형점 변화를 관찰하세요. 통화정책의 전달 경로를 이해할 수 있습니다.</p>
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
          {canComplete ? '실험 완료' : `통화량을 다양하게 변경하세요 (${changes}/3)`}
        </button>
      )}
    </div>
  );
}
