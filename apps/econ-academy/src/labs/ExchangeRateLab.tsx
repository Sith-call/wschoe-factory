import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function ExchangeRateLab({ onComplete, completed }: Props) {
  const [exchangeRate, setExchangeRate] = useState(1200); // KRW per USD
  const [changes, setChanges] = useState(0);
  const [lastRate, setLastRate] = useState(1200);

  const W = 320, H = 240, PAD = 30;

  const baseRate = 1200;
  // Import price in KRW = USD price * exchange rate
  const importPrice = 100 * exchangeRate; // $100 product
  const exportPrice = 120000 / exchangeRate; // 120,000 KRW product in USD

  const importChange = ((importPrice - 100 * baseRate) / (100 * baseRate)) * 100;
  const exportChange = ((exportPrice - 120000 / baseRate) / (120000 / baseRate)) * 100;

  // Trade balance effect
  const exportVol = Math.max(20, 50 + (exchangeRate - baseRate) / 20);
  const importVol = Math.max(20, 50 - (exchangeRate - baseRate) / 25);
  const tradeBalance = exportVol - importVol;

  function handleChange(val: number) {
    setExchangeRate(val);
    if (Math.abs(val - lastRate) > 100) {
      setChanges(prev => prev + 1);
      setLastRate(val);
    }
  }

  const canComplete = changes >= 3;

  const barAreaW = W - PAD * 2 - 40;
  const barMaxW = barAreaW / 2;
  const barH = 28;
  const midX = W / 2;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        환율 변동과 무역
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        원/달러 환율을 변경하여 수출입 가격과 무역수지 변화를 관찰하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Exchange rate display */}
          <text x={W / 2} y={25} fontSize={14} fill="#1C1917" textAnchor="middle" fontWeight={700}>
            1$ = {exchangeRate}원
          </text>
          <text x={W / 2} y={40} fontSize={10} fill={exchangeRate > baseRate ? '#DC2626' : exchangeRate < baseRate ? '#2563EB' : '#78716C'} textAnchor="middle">
            {exchangeRate > baseRate ? '원화 약세 (절하)' : exchangeRate < baseRate ? '원화 강세 (절상)' : '기준 환율'}
          </text>

          {/* Trade balance bars */}
          <text x={W / 2} y={65} fontSize={10} fill="#78716C" textAnchor="middle" fontWeight={600}>수출입 규모</text>

          {/* Export bar */}
          <text x={PAD} y={88} fontSize={9} fill="#0D9488" fontWeight={600}>수출</text>
          <rect x={midX - 10} y={78} width={-Math.min(barMaxW, exportVol / 80 * barMaxW)} height={barH} rx={3} fill="#0D9488" fillOpacity={0.6} transform={`scale(-1,1) translate(${-midX * 2 + 20},0)`} />
          <rect x={midX + 10} y={78} width={Math.min(barMaxW, exportVol / 80 * barMaxW)} height={barH} rx={3} fill="#0D9488" fillOpacity={0.6} />
          <text x={midX + 14 + exportVol / 80 * barMaxW} y={93} fontSize={9} fill="#0D9488" fontWeight={600}>{Math.round(exportVol)}</text>

          {/* Import bar */}
          <text x={PAD} y={123} fontSize={9} fill="#DC2626" fontWeight={600}>수입</text>
          <rect x={midX + 10} y={113} width={Math.min(barMaxW, importVol / 80 * barMaxW)} height={barH} rx={3} fill="#DC2626" fillOpacity={0.6} />
          <text x={midX + 14 + importVol / 80 * barMaxW} y={128} fontSize={9} fill="#DC2626" fontWeight={600}>{Math.round(importVol)}</text>

          {/* Center line */}
          <line x1={midX + 10} y1={70} x2={midX + 10} y2={145} stroke="#A8A29E" strokeWidth={1} />

          {/* Trade balance */}
          <rect x={PAD + 20} y={155} width={W - PAD * 2 - 40} height={35} rx={6} fill={tradeBalance >= 0 ? '#DCFCE7' : '#FEE2E2'} stroke={tradeBalance >= 0 ? '#16A34A' : '#DC2626'} strokeWidth={1} />
          <text x={W / 2} y={168} fontSize={10} fill="#78716C" textAnchor="middle">무역수지</text>
          <text x={W / 2} y={183} fontSize={14} fill={tradeBalance >= 0 ? '#16A34A' : '#DC2626'} textAnchor="middle" fontWeight={700}>
            {tradeBalance >= 0 ? '+' : ''}{Math.round(tradeBalance)} ({tradeBalance >= 0 ? '흑자' : '적자'})
          </text>

          {/* Price effects */}
          <text x={PAD + 10} y={210} fontSize={9} fill="#78716C">수입품 가격: <tspan fill={importChange > 0 ? '#DC2626' : '#16A34A'} fontWeight={600}>{importChange > 0 ? '+' : ''}{importChange.toFixed(0)}%</tspan></text>
          <text x={W - PAD - 10} y={210} fontSize={9} fill="#78716C" textAnchor="end">수출품 가격($): <tspan fill={exportChange < 0 ? '#16A34A' : '#DC2626'} fontWeight={600}>{exportChange > 0 ? '+' : ''}{exportChange.toFixed(0)}%</tspan></text>

          {/* Who benefits */}
          <text x={W / 2} y={230} fontSize={10} fill={exchangeRate > baseRate ? '#0D9488' : exchangeRate < baseRate ? '#2563EB' : '#78716C'} textAnchor="middle" fontWeight={600}>
            {exchangeRate > baseRate ? '수출기업 유리 / 수입물가 상승' : exchangeRate < baseRate ? '소비자 유리 / 수출기업 불리' : '균형 상태'}
          </text>
        </svg>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">원/달러 환율</span>
          <span className="font-display font-semibold text-ink">{exchangeRate}원</span>
        </div>
        <input
          type="range" min={800} max={1600} step={10} value={exchangeRate}
          onChange={e => handleChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-ink-secondary mt-1">
          <span>원화 강세 (800원)</span>
          <span>원화 약세 (1,600원)</span>
        </div>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {exchangeRate > 1400 ? (
          <p><strong>원화 약세</strong>: 수출품의 달러 가격이 낮아져 가격경쟁력이 올라가지만, 수입 원자재 비용이 증가합니다.</p>
        ) : exchangeRate < 1000 ? (
          <p><strong>원화 강세</strong>: 해외 여행과 수입품이 저렴해지지만, 수출기업의 가격경쟁력이 약해집니다.</p>
        ) : (
          <p>환율 변동은 <strong>수출입 가격</strong>과 <strong>무역수지</strong>에 직접 영향을 줍니다. 환율을 크게 변경해보세요.</p>
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
          {canComplete ? '실험 완료' : `환율을 다양하게 변경하세요 (${changes}/3)`}
        </button>
      )}
    </div>
  );
}
