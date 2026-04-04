import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function QELab({ onComplete, completed }: Props) {
  const [bondPurchase, setBondPurchase] = useState(0);
  const [changes, setChanges] = useState(0);
  const [lastPurchase, setLastPurchase] = useState(0);

  const W = 320, H = 280, PAD = 30;

  // Balance sheet
  const cbAssets = 50 + bondPurchase;
  const cbLiabilities = 50 + bondPurchase; // reserves = money created
  const moneySupply = 100 + bondPurchase * 2;

  // Yield curve: higher bond purchases push yields down
  const yieldShort = Math.max(0.2, 3 - bondPurchase * 0.03);
  const yieldMid = Math.max(0.5, 4 - bondPurchase * 0.025);
  const yieldLong = Math.max(1, 5 - bondPurchase * 0.02);

  const bsY = 30, bsH = 90, bsW = 100;
  const ycY = 160, ycH = 80;

  function handleChange(val: number) {
    setBondPurchase(val);
    if (Math.abs(val - lastPurchase) > 15) {
      setChanges(prev => prev + 1);
      setLastPurchase(val);
    }
  }

  const canComplete = changes >= 3;

  // Yield curve points
  const ycBase = ycY + ycH;
  const ycToX = (i: number) => PAD + 40 + i * 80;
  const ycToY = (r: number) => ycY + ycH - (r / 6) * ycH;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        양적완화(QE) 시뮬레이션
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        중앙은행의 국채 매입량을 조절하세요. 대차대조표 확대와 수익률곡선 변화를 관찰합니다.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Balance Sheet Title */}
          <text x={W / 2} y={bsY - 8} fontSize={10} fill="#78716C" textAnchor="middle" fontWeight={600}>중앙은행 대차대조표</text>

          {/* Assets side */}
          <rect x={PAD + 20} y={bsY} width={bsW} height={bsH} rx={4} fill="#E7E5E4" stroke="#A8A29E" strokeWidth={1} />
          <text x={PAD + 20 + bsW / 2} y={bsY - 2} fontSize={9} fill="#78716C" textAnchor="middle">자산</text>

          {/* Original assets */}
          <rect x={PAD + 24} y={bsY + 4} width={bsW - 8} height={(50 / cbAssets) * (bsH - 8)} rx={2} fill="#2563EB" fillOpacity={0.3} />
          {/* New bond purchases */}
          {bondPurchase > 0 && (
            <rect
              x={PAD + 24} y={bsY + 4 + (50 / cbAssets) * (bsH - 8)}
              width={bsW - 8} height={(bondPurchase / cbAssets) * (bsH - 8)}
              rx={2} fill="#2563EB" fillOpacity={0.7}
            />
          )}
          <text x={PAD + 20 + bsW / 2} y={bsY + bsH / 2} fontSize={10} fill="#2563EB" textAnchor="middle" fontWeight={600}>
            국채 {Math.round(cbAssets)}
          </text>

          {/* Liabilities side */}
          <rect x={W - PAD - 20 - bsW} y={bsY} width={bsW} height={bsH} rx={4} fill="#E7E5E4" stroke="#A8A29E" strokeWidth={1} />
          <text x={W - PAD - 20 - bsW / 2} y={bsY - 2} fontSize={9} fill="#78716C" textAnchor="middle">부채</text>

          <rect x={W - PAD - 16 - bsW} y={bsY + 4} width={bsW - 8} height={(50 / cbLiabilities) * (bsH - 8)} rx={2} fill="#0D9488" fillOpacity={0.3} />
          {bondPurchase > 0 && (
            <rect
              x={W - PAD - 16 - bsW} y={bsY + 4 + (50 / cbLiabilities) * (bsH - 8)}
              width={bsW - 8} height={(bondPurchase / cbLiabilities) * (bsH - 8)}
              rx={2} fill="#0D9488" fillOpacity={0.7}
            />
          )}
          <text x={W - PAD - 20 - bsW / 2} y={bsY + bsH / 2} fontSize={10} fill="#0D9488" textAnchor="middle" fontWeight={600}>
            지급준비 {Math.round(cbLiabilities)}
          </text>

          {/* Arrow between */}
          <line x1={PAD + 20 + bsW + 4} y1={bsY + bsH / 2} x2={W - PAD - 20 - bsW - 4} y2={bsY + bsH / 2} stroke="#78716C" strokeWidth={1} strokeDasharray="4" />
          <text x={W / 2} y={bsY + bsH / 2 - 4} fontSize={8} fill="#78716C" textAnchor="middle">= 통화 창출</text>

          {/* Yield Curve Section */}
          <text x={W / 2} y={ycY - 8} fontSize={10} fill="#78716C" textAnchor="middle" fontWeight={600}>수익률곡선</text>

          {/* Original yield curve (ghost) */}
          {bondPurchase > 10 && (
            <polyline
              points={`${ycToX(0)},${ycToY(3)} ${ycToX(1)},${ycToY(4)} ${ycToX(2)},${ycToY(5)}`}
              fill="none" stroke="#D97706" strokeWidth={1.5} strokeDasharray="4" strokeOpacity={0.4}
            />
          )}

          {/* Current yield curve */}
          <polyline
            points={`${ycToX(0)},${ycToY(yieldShort)} ${ycToX(1)},${ycToY(yieldMid)} ${ycToX(2)},${ycToY(yieldLong)}`}
            fill="none" stroke="#D97706" strokeWidth={2.5}
          />
          {[
            { x: 0, y: yieldShort, label: '단기' },
            { x: 1, y: yieldMid, label: '중기' },
            { x: 2, y: yieldLong, label: '장기' },
          ].map((p, i) => (
            <React.Fragment key={i}>
              <circle cx={ycToX(p.x)} cy={ycToY(p.y)} r={4} fill="#D97706" />
              <text x={ycToX(p.x)} y={ycBase + 14} fontSize={9} fill="#78716C" textAnchor="middle">{p.label}</text>
              <text x={ycToX(p.x)} y={ycToY(p.y) - 8} fontSize={9} fill="#D97706" textAnchor="middle" fontWeight={600}>{p.y.toFixed(1)}%</text>
            </React.Fragment>
          ))}

          {/* Y axis for yield */}
          <line x1={PAD + 30} y1={ycY} x2={PAD + 30} y2={ycBase} stroke="#A8A29E" strokeWidth={0.5} />
        </svg>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">국채 매입량</span>
          <span className="font-display font-semibold text-ink">{bondPurchase}조</span>
        </div>
        <input
          type="range" min={0} max={80} step={5} value={bondPurchase}
          onChange={e => handleChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">통화량</p>
          <p className="font-display text-xl font-bold text-primary">{Math.round(moneySupply)}</p>
        </div>
        <div className="border border-border rounded-md p-3">
          <p className="text-xs text-ink-secondary mb-1">장기금리</p>
          <p className="font-display text-xl font-bold text-amber-600">{yieldLong.toFixed(1)}%</p>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {bondPurchase > 50 ? (
          <p><strong>대규모 QE</strong>: 국채 매입으로 수익률곡선이 크게 하락했습니다. 장기금리 하락은 기업 투자와 주택 구매를 촉진합니다.</p>
        ) : bondPurchase > 0 ? (
          <p>중앙은행이 국채를 매입하면 국채 가격이 오르고 <strong>수익률(금리)이 하락</strong>합니다. 동시에 통화량이 증가합니다.</p>
        ) : (
          <p><strong>양적완화(QE)</strong>는 기준금리가 0%에 가까울 때 사용하는 비전통적 통화정책입니다. 국채 매입량을 늘려보세요.</p>
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
          {canComplete ? '실험 완료' : `매입량을 다양하게 변경하세요 (${changes}/3)`}
        </button>
      )}
    </div>
  );
}
