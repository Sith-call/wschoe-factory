import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function CurrentAccountLab({ onComplete, completed }: Props) {
  const [exports, setExports] = useState(50);
  const [imports, setImports] = useState(50);
  const [changes, setChanges] = useState(0);

  const W = 320, H = 260, PAD = 30;

  const balance = exports - imports;
  const balanceRatio = balance / Math.max(exports, imports, 1);

  // Balance scale visualization
  const scaleX = W / 2, scaleY = 80;
  const armLen = 90;
  const tiltAngle = Math.max(-25, Math.min(25, -balanceRatio * 25)); // degrees
  const tiltRad = (tiltAngle * Math.PI) / 180;

  const leftX = scaleX - armLen * Math.cos(tiltRad);
  const leftY = scaleY + armLen * Math.sin(tiltRad);
  const rightX = scaleX + armLen * Math.cos(tiltRad);
  const rightY = scaleY - armLen * Math.sin(tiltRad);

  const panW = 50, panH = 40;
  const exportFill = Math.min(1, exports / 80);
  const importFill = Math.min(1, imports / 80);

  function handleChange(setter: (v: number) => void, val: number) {
    setter(val);
    setChanges(prev => prev + 1);
  }

  const canComplete = changes >= 6;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        경상수지 시뮬레이션
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        수출과 수입을 조절하여 경상수지 균형(저울)이 어느 쪽으로 기우는지 관찰하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Scale stand */}
          <line x1={scaleX} y1={scaleY - 5} x2={scaleX} y2={scaleY + 60} stroke="#78716C" strokeWidth={3} />
          <polygon points={`${scaleX - 15},${scaleY + 60} ${scaleX + 15},${scaleY + 60} ${scaleX},${scaleY + 50}`} fill="#78716C" />

          {/* Scale arm */}
          <line x1={leftX} y1={leftY} x2={rightX} y2={rightY} stroke="#1C1917" strokeWidth={2.5} />

          {/* Pivot */}
          <circle cx={scaleX} cy={scaleY} r={5} fill="#1C1917" />

          {/* Left pan (exports) */}
          <line x1={leftX} y1={leftY} x2={leftX} y2={leftY + 15} stroke="#78716C" strokeWidth={1} />
          <rect x={leftX - panW / 2} y={leftY + 15} width={panW} height={panH} rx={4} fill="#E7E5E4" stroke="#A8A29E" strokeWidth={1} />
          <rect x={leftX - panW / 2 + 3} y={leftY + 15 + panH * (1 - exportFill)} width={panW - 6} height={panH * exportFill - 3} rx={2} fill="#0D9488" fillOpacity={0.6} />
          <text x={leftX} y={leftY + 15 + panH / 2 + 3} fontSize={10} fill="#0D9488" textAnchor="middle" fontWeight={600}>{exports}</text>
          <text x={leftX} y={leftY + 15 + panH + 14} fontSize={10} fill="#0D9488" textAnchor="middle" fontWeight={600}>수출</text>

          {/* Right pan (imports) */}
          <line x1={rightX} y1={rightY} x2={rightX} y2={rightY + 15} stroke="#78716C" strokeWidth={1} />
          <rect x={rightX - panW / 2} y={rightY + 15} width={panW} height={panH} rx={4} fill="#E7E5E4" stroke="#A8A29E" strokeWidth={1} />
          <rect x={rightX - panW / 2 + 3} y={rightY + 15 + panH * (1 - importFill)} width={panW - 6} height={panH * importFill - 3} rx={2} fill="#DC2626" fillOpacity={0.6} />
          <text x={rightX} y={rightY + 15 + panH / 2 + 3} fontSize={10} fill="#DC2626" textAnchor="middle" fontWeight={600}>{imports}</text>
          <text x={rightX} y={rightY + 15 + panH + 14} fontSize={10} fill="#DC2626" textAnchor="middle" fontWeight={600}>수입</text>

          {/* Balance display */}
          <rect x={W / 2 - 70} y={175} width={140} height={40} rx={8}
            fill={balance > 0 ? '#DCFCE7' : balance < 0 ? '#FEE2E2' : '#F5F5F4'}
            stroke={balance > 0 ? '#16A34A' : balance < 0 ? '#DC2626' : '#A8A29E'} strokeWidth={1.5} />
          <text x={W / 2} y={190} fontSize={10} fill="#78716C" textAnchor="middle">경상수지</text>
          <text x={W / 2} y={207} fontSize={14} textAnchor="middle" fontWeight={700}
            fill={balance > 0 ? '#16A34A' : balance < 0 ? '#DC2626' : '#1C1917'}>
            {balance > 0 ? `+${balance} 흑자` : balance < 0 ? `${balance} 적자` : '0 균형'}
          </text>

          {/* GDP impact bar */}
          <text x={W / 2} y={235} fontSize={9} fill="#78716C" textAnchor="middle">
            순수출(NX) = 수출 - 수입 = {balance} → GDP {balance >= 0 ? '증가' : '감소'} 요인
          </text>

          {/* Arrows showing flow */}
          <text x={leftX} y={leftY - 15} fontSize={20} textAnchor="middle">{'📦'}</text>
          <text x={rightX} y={rightY - 15} fontSize={20} textAnchor="middle">{'🛒'}</text>
        </svg>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-0.5">
            <span className="text-ink-secondary">수출</span>
            <span className="font-display font-semibold text-teal-600">{exports}조</span>
          </div>
          <input type="range" min={10} max={80} step={1} value={exports} onChange={e => handleChange(setExports, Number(e.target.value))} className="w-full accent-teal-500" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-0.5">
            <span className="text-ink-secondary">수입</span>
            <span className="font-display font-semibold text-red-600">{imports}조</span>
          </div>
          <input type="range" min={10} max={80} step={1} value={imports} onChange={e => handleChange(setImports, Number(e.target.value))} className="w-full accent-red-500" />
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {balance > 15 ? (
          <p><strong>경상수지 흑자</strong>: 수출이 수입보다 많아 외화가 유입됩니다. 원화 강세 압력이 생기고 외환보유고가 증가합니다.</p>
        ) : balance < -15 ? (
          <p><strong>경상수지 적자</strong>: 수입이 수출보다 많아 외화가 유출됩니다. 원화 약세 압력이 생기며 대외채무가 증가할 수 있습니다.</p>
        ) : Math.abs(balance) <= 3 ? (
          <p><strong>경상수지 균형</strong>: 수출과 수입이 거의 같습니다. 외환시장이 안정적입니다.</p>
        ) : (
          <p>경상수지 = 수출 - 수입. GDP 공식에서 <strong>순수출(NX)</strong>은 총수요의 한 구성요소입니다.</p>
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
          {canComplete ? '실험 완료' : `수출입을 다양하게 조절하세요 (${Math.min(changes, 6)}/6)`}
        </button>
      )}
    </div>
  );
}
