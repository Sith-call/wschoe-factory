import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

// Interactive credit creation: step-by-step deposit-loan cycle
export function CreditCreationLab({ onComplete, completed }: Props) {
  const [reserveRatio, setReserveRatio] = useState(10);
  const [step, setStep] = useState(0);
  const [autoPlayed, setAutoPlayed] = useState(false);

  const initialDeposit = 1000;
  const ratio = reserveRatio / 100;
  const maxSteps = 8;

  // Calculate each round
  const rounds = [];
  let deposit = initialDeposit;
  for (let i = 0; i <= maxSteps; i++) {
    const reserve = deposit * ratio;
    const loan = deposit * (1 - ratio);
    rounds.push({ round: i, deposit: Math.round(deposit), reserve: Math.round(reserve), loan: Math.round(loan) });
    deposit = loan;
  }

  const totalDeposits = rounds.slice(0, step + 1).reduce((sum, r) => sum + r.deposit, 0);
  const totalLoans = rounds.slice(0, step + 1).reduce((sum, r) => sum + r.loan, 0);
  const theoreticalTotal = Math.round(initialDeposit / ratio);
  const multiplier = (1 / ratio).toFixed(1);

  const W = 320, H = 180;
  const barW = (W - 60) / (maxSteps + 1);

  function handleNext() {
    if (step < maxSteps) setStep(step + 1);
  }

  function handleAutoPlay() {
    setAutoPlayed(true);
    let s = 0;
    const timer = setInterval(() => {
      s++;
      setStep(s);
      if (s >= maxSteps) clearInterval(timer);
    }, 500);
  }

  const canComplete = step >= 5 || autoPlayed;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        신용창조 과정 시뮬레이션
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        은행에 {initialDeposit.toLocaleString()}만 원이 예금되면, 지급준비율에 따라
        예금→대출→재예금 사이클이 반복되며 통화가 창출됩니다.
      </p>

      {/* Reserve ratio slider */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-ink-secondary">지급준비율</span>
          <span className="font-display font-semibold text-ink">{reserveRatio}%</span>
        </div>
        <input
          type="range" min={2} max={50} step={1} value={reserveRatio}
          onChange={e => { setReserveRatio(Number(e.target.value)); setStep(0); }}
          className="w-full accent-primary"
        />
      </div>

      {/* Bar chart visualization */}
      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Bars */}
          {rounds.slice(0, step + 1).map((r, i) => {
            const x = 30 + i * barW;
            const depositH = (r.deposit / initialDeposit) * 100;
            const reserveH = (r.reserve / initialDeposit) * 100;
            return (
              <g key={i}>
                {/* Deposit bar */}
                <rect x={x + 2} y={H - 30 - depositH} width={barW - 4} height={depositH} fill="#0D9488" fillOpacity={0.3} rx={2} />
                {/* Reserve portion */}
                <rect x={x + 2} y={H - 30 - reserveH} width={barW - 4} height={reserveH} fill="#D97706" rx={2} />
                {/* Labels */}
                <text x={x + barW / 2} y={H - 16} fontSize={8} fill="#78716C" textAnchor="middle">R{i + 1}</text>
                {depositH > 15 && (
                  <text x={x + barW / 2} y={H - 30 - depositH + 12} fontSize={8} fill="#0D9488" textAnchor="middle" fontWeight={600}>
                    {r.deposit}
                  </text>
                )}
              </g>
            );
          })}

          {/* Legend */}
          <rect x={10} y={8} width={10} height={10} fill="#0D9488" fillOpacity={0.3} rx={1} />
          <text x={24} y={17} fontSize={9} fill="#78716C">예금</text>
          <rect x={60} y={8} width={10} height={10} fill="#D97706" rx={1} />
          <text x={74} y={17} fontSize={9} fill="#78716C">지급준비금</text>
        </svg>
      </div>

      {/* Step-by-step table */}
      <div className="border border-border rounded-lg overflow-hidden mb-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-stone-50">
              <th className="text-left px-3 py-2 text-ink-secondary font-medium">단계</th>
              <th className="text-right px-3 py-2 text-ink-secondary font-medium">예금</th>
              <th className="text-right px-3 py-2 text-ink-secondary font-medium">지준</th>
              <th className="text-right px-3 py-2 text-ink-secondary font-medium">대출</th>
            </tr>
          </thead>
          <tbody>
            {rounds.slice(0, Math.min(step + 1, 6)).map((r, i) => (
              <tr key={i} className={i === step ? 'bg-primary-light' : ''}>
                <td className="px-3 py-1.5 text-ink">{i + 1}차</td>
                <td className="px-3 py-1.5 text-right font-display text-ink">{r.deposit.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right font-display text-secondary">{r.reserve.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right font-display text-primary">{r.loan.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">총 예금</p>
          <p className="font-display text-sm font-bold text-ink">{totalDeposits.toLocaleString()}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">통화승수</p>
          <p className="font-display text-sm font-bold text-primary">{multiplier}배</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">최종 총액</p>
          <p className="font-display text-sm font-bold text-ink">{theoreticalTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleNext}
          disabled={step >= maxSteps}
          className={`flex-1 text-sm border rounded-md px-3 py-2 font-medium transition-colors ${
            step < maxSteps ? 'border-primary text-primary hover:bg-primary-light' : 'border-border text-ink-disabled'
          }`}
        >
          다음 단계 →
        </button>
        <button
          onClick={handleAutoPlay}
          disabled={autoPlayed || step >= maxSteps}
          className="text-sm border border-border text-ink-secondary rounded-md px-3 py-2 font-medium hover:bg-stone-50 transition-colors"
        >
          자동 재생
        </button>
        <button
          onClick={() => { setStep(0); setAutoPlayed(false); }}
          className="text-sm border border-border text-ink-secondary rounded-md px-3 py-2 font-medium hover:bg-stone-50 transition-colors"
        >
          초기화
        </button>
      </div>

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>지급준비율이 {reserveRatio}%일 때, 초기 예금 {initialDeposit.toLocaleString()}만 원은 최종적으로 <strong>{theoreticalTotal.toLocaleString()}만 원</strong>의 통화를 창출합니다 (통화승수 {multiplier}배).</p>
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
          {canComplete ? '실험 완료' : '단계를 5회 이상 진행하세요'}
        </button>
      )}
    </div>
  );
}
