import React, { useState, useCallback } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

// Interactive supply-demand curve with draggable shift
export function SupplyDemandLab({ onComplete, completed }: Props) {
  const [demandShift, setDemandShift] = useState(0);
  const [supplyShift, setSupplyShift] = useState(0);
  const [dragging, setDragging] = useState<'demand' | 'supply' | null>(null);
  const [interactions, setInteractions] = useState(0);

  const W = 320, H = 260, PAD = 40;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;

  // Demand: P = 100 - Q + shift => Q = 100 - P + shift
  // Supply: P = Q - shift => Q = P + shift
  const demandLine = (q: number) => 100 - q + demandShift * 20;
  const supplyLine = (q: number) => q - supplyShift * 20;

  // Equilibrium
  const eqQ = (100 + demandShift * 20 + supplyShift * 20) / 2;
  const eqP = demandLine(eqQ);

  const qToX = (q: number) => PAD + (q / 120) * plotW;
  const pToY = (p: number) => PAD + ((100 - p) / 120) * plotH;

  const handleSvgMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const normalizedX = (x - PAD) / plotW;
    const shift = (normalizedX - 0.5) * 4;
    const clamped = Math.max(-2, Math.min(2, shift));

    if (dragging === 'demand') setDemandShift(clamped);
    else setSupplyShift(clamped);
  }, [dragging, plotW]);

  const handleMouseUp = () => {
    if (dragging) {
      setInteractions(prev => prev + 1);
      setDragging(null);
    }
  };

  const canComplete = interactions >= 4;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        수요-공급 곡선 이동 시뮬레이션
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        수요곡선(파란색)과 공급곡선(빨간색)의 라벨을 드래그하여 이동시켜보세요.
        균형점(초록 점)이 어떻게 변하는지 관찰하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4 select-none">
        <svg
          width="100%" viewBox={`0 0 ${W} ${H}`}
          onMouseMove={handleSvgMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: dragging ? 'grabbing' : 'default' }}
        >
          {/* Axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
          <text x={PAD - 8} y={PAD - 8} fontSize={11} fill="#78716C" textAnchor="middle">P</text>
          <text x={W - PAD + 8} y={H - PAD + 14} fontSize={11} fill="#78716C" textAnchor="middle">Q</text>

          {/* Grid lines */}
          {[20, 40, 60, 80].map(v => (
            <React.Fragment key={v}>
              <line x1={PAD} y1={pToY(v)} x2={W - PAD} y2={pToY(v)} stroke="#E7E5E4" strokeWidth={0.5} />
              <line x1={qToX(v)} y1={PAD} x2={qToX(v)} y2={H - PAD} stroke="#E7E5E4" strokeWidth={0.5} />
            </React.Fragment>
          ))}

          {/* Demand curve (blue) */}
          <line
            x1={qToX(0)} y1={pToY(demandLine(0))}
            x2={qToX(100 + demandShift * 20)} y2={pToY(0)}
            stroke="#2563EB" strokeWidth={2.5}
          />
          <text
            x={qToX(Math.max(5, 85 + demandShift * 15))}
            y={pToY(Math.max(5, 15 - demandShift * 5))}
            fontSize={12} fill="#2563EB" fontWeight={600}
            style={{ cursor: 'grab' }}
            onMouseDown={(e) => { e.preventDefault(); setDragging('demand'); }}
          >
            D{demandShift !== 0 ? "'" : ''}
          </text>

          {/* Supply curve (red) */}
          <line
            x1={qToX(Math.max(0, -supplyShift * 20))} y1={pToY(0)}
            x2={qToX(100)} y2={pToY(supplyLine(100))}
            stroke="#DC2626" strokeWidth={2.5}
          />
          <text
            x={qToX(Math.min(95, 90 + supplyShift * 5))}
            y={pToY(supplyLine(90) + 5)}
            fontSize={12} fill="#DC2626" fontWeight={600}
            style={{ cursor: 'grab' }}
            onMouseDown={(e) => { e.preventDefault(); setDragging('supply'); }}
          >
            S{supplyShift !== 0 ? "'" : ''}
          </text>

          {/* Equilibrium point */}
          {eqQ > 0 && eqP > 0 && eqQ < 120 && eqP < 120 && (
            <>
              <line x1={qToX(eqQ)} y1={pToY(eqP)} x2={qToX(eqQ)} y2={H - PAD} stroke="#0D9488" strokeWidth={1} strokeDasharray="4" />
              <line x1={PAD} y1={pToY(eqP)} x2={qToX(eqQ)} y2={pToY(eqP)} stroke="#0D9488" strokeWidth={1} strokeDasharray="4" />
              <circle cx={qToX(eqQ)} cy={pToY(eqP)} r={6} fill="#0D9488" />
              <text x={qToX(eqQ) + 10} y={pToY(eqP) - 8} fontSize={10} fill="#0D9488" fontWeight={600}>
                E ({Math.round(eqQ)}, {Math.round(eqP)})
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Info */}
      <div className="border-l-2 border-primary pl-3 text-sm text-ink leading-relaxed mb-4">
        {demandShift === 0 && supplyShift === 0 && (
          <p>초기 균형 상태입니다. <strong>D</strong> 또는 <strong>S</strong> 라벨을 좌우로 드래그하여 곡선을 이동시켜보세요.</p>
        )}
        {demandShift > 0 && (
          <p>수요 증가: 소득 상승이나 선호 변화로 수요곡선이 오른쪽으로 이동했습니다. 균형가격과 균형거래량이 모두 상승합니다.</p>
        )}
        {demandShift < 0 && (
          <p>수요 감소: 소득 감소나 대체재 등장으로 수요곡선이 왼쪽으로 이동했습니다. 균형가격과 균형거래량이 모두 하락합니다.</p>
        )}
        {supplyShift > 0 && (
          <p>공급 증가: 기술 발전이나 원가 하락으로 공급곡선이 오른쪽으로 이동했습니다. 균형가격은 하락하고 거래량은 증가합니다.</p>
        )}
        {supplyShift < 0 && (
          <p>공급 감소: 원자재 가격 상승으로 공급곡선이 왼쪽으로 이동했습니다. 균형가격은 상승하고 거래량은 감소합니다.</p>
        )}
      </div>

      {/* Buttons to reset / adjust */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setDemandShift(1); setInteractions(i => i + 1); }}
          className="text-xs border border-blue-300 text-blue-600 rounded-md px-3 py-1.5 hover:bg-blue-50"
        >
          수요 증가
        </button>
        <button
          onClick={() => { setDemandShift(-1); setInteractions(i => i + 1); }}
          className="text-xs border border-blue-300 text-blue-600 rounded-md px-3 py-1.5 hover:bg-blue-50"
        >
          수요 감소
        </button>
        <button
          onClick={() => { setSupplyShift(1); setInteractions(i => i + 1); }}
          className="text-xs border border-red-300 text-red-600 rounded-md px-3 py-1.5 hover:bg-red-50"
        >
          공급 증가
        </button>
        <button
          onClick={() => { setSupplyShift(-1); setInteractions(i => i + 1); }}
          className="text-xs border border-red-300 text-red-600 rounded-md px-3 py-1.5 hover:bg-red-50"
        >
          공급 감소
        </button>
        <button
          onClick={() => { setDemandShift(0); setSupplyShift(0); }}
          className="text-xs border border-border text-ink-secondary rounded-md px-3 py-1.5 hover:bg-stone-50"
        >
          초기화
        </button>
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
          {canComplete ? '실험 완료' : `곡선을 이동시켜보세요 (${interactions}/4 인터랙션)`}
        </button>
      )}
    </div>
  );
}
