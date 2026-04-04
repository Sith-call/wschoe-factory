import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

// ── national-income ──
export function NationalIncomeLab({ onComplete, completed }: Props) {
  const [production, setProduction] = useState(100);
  const [changes, setChanges] = useState(0);

  const distribution = production; // 3면 등가
  const expenditure = production;

  function handle(v: number) { setProduction(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">생산 규모를 조절하며 국민소득 3면 등가의 법칙을 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 120">
        {[
          { label: '생산(GDP)', val: production, color: '#2563EB' },
          { label: '분배(소득)', val: distribution, color: '#16A34A' },
          { label: '지출(소비+투자)', val: expenditure, color: '#D97706' },
        ].map((b, i) => (
          <React.Fragment key={i}>
            <rect x={40} y={10 + i * 35} width={(b.val / 200) * 240} height={25} rx={4} fill={b.color} fillOpacity={0.7} />
            <text x={45} y={27 + i * 35} fontSize={10} fill="white" fontWeight={600}>{b.label}: {b.val}조</text>
          </React.Fragment>
        ))}
      </svg>
      <input type="range" min={50} max={200} step={10} value={production} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>생산 = 분배 = 지출. 세 방법으로 측정해도 <strong>국민소득은 동일</strong>합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `규모를 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── nominal-gdp ──
export function NominalGDPLab({ onComplete, completed }: Props) {
  const [realGrowth, setRealGrowth] = useState(3);
  const [inflationRate, setInflationRate] = useState(2);
  const [changes, setChanges] = useState(0);

  const nominalGrowth = Math.round((realGrowth + inflationRate + realGrowth * inflationRate / 100) * 10) / 10;
  const baseGDP = 2000;
  const nominalGDP = Math.round(baseGDP * (1 + nominalGrowth / 100));
  const realGDP = Math.round(baseGDP * (1 + realGrowth / 100));

  function handleChange() { setChanges(p => p + 1); }
  const canComplete = changes >= 6;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">실질 성장률과 물가 상승률을 조절하며 명목GDP와 실질GDP의 차이를 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 80">
        <rect x={40} y={10} width={Math.min((nominalGDP / 2500) * 240, 240)} height={25} rx={4} fill="#D97706" fillOpacity={0.7} />
        <text x={45} y={27} fontSize={10} fill="white" fontWeight={600}>명목GDP: {nominalGDP}조 (+{nominalGrowth}%)</text>
        <rect x={40} y={45} width={Math.min((realGDP / 2500) * 240, 240)} height={25} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={45} y={62} fontSize={10} fill="white" fontWeight={600}>실질GDP: {realGDP}조 (+{realGrowth}%)</text>
      </svg>
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">실질 성장률: {realGrowth}%</label>
          <input type="range" min={-3} max={10} step={0.5} value={realGrowth} onChange={e => { setRealGrowth(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">물가 상승률: {inflationRate}%</label>
          <input type="range" min={0} max={10} step={0.5} value={inflationRate} onChange={e => { setInflationRate(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>명목GDP는 물가를 포함하므로 <strong>실제 성장을 과대평가</strong>할 수 있습니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양하게 조절하세요 (${Math.min(changes, 6)}/6)`}
        </button>
      )}
    </div>
  );
}

// ── gni ──
export function GNILab({ onComplete, completed }: Props) {
  const [overseasIncome, setOverseasIncome] = useState(20);
  const [foreignIncome, setForeignIncome] = useState(15);
  const [changes, setChanges] = useState(0);

  const gdp = 2000;
  const gni = gdp + overseasIncome - foreignIncome;

  function handleChange() { setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">해외 요소소득을 조절하며 GDP와 GNI의 차이를 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 80">
        <rect x={40} y={10} width={240} height={25} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <text x={45} y={27} fontSize={10} fill="white" fontWeight={600}>GDP: {gdp}조</text>
        <rect x={40} y={45} width={Math.min((gni / 2100) * 240, 260)} height={25} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={45} y={62} fontSize={10} fill="white" fontWeight={600}>GNI: {gni}조</text>
      </svg>
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">해외에서 번 소득: {overseasIncome}조</label>
          <input type="range" min={0} max={50} step={5} value={overseasIncome} onChange={e => { setOverseasIncome(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">외국인이 국내에서 번 소득: {foreignIncome}조</label>
          <input type="range" min={0} max={50} step={5} value={foreignIncome} onChange={e => { setForeignIncome(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>GNI = GDP + 해외순수취소득. 해외투자가 많으면 <strong>GNI가 GDP보다 큽니다</strong>.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── potential-gdp ──
export function PotentialGDPLab({ onComplete, completed }: Props) {
  const [labor, setLabor] = useState(50);
  const [tech, setTech] = useState(50);
  const [changes, setChanges] = useState(0);

  const potentialGDP = Math.round(labor * 0.6 + tech * 0.8 + 20);

  function handleChange() { setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">노동력과 기술 수준을 조절하며 잠재GDP가 어떻게 결정되는지 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 60">
        <rect x={40} y={15} width={(potentialGDP / 120) * 240} height={30} rx={4} fill="#0D9488" fillOpacity={0.7} />
        <text x={45} y={35} fontSize={11} fill="white" fontWeight={600}>잠재GDP: {potentialGDP}</text>
      </svg>
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">노동 참여율: {labor}%</label>
          <input type="range" min={20} max={80} step={5} value={labor} onChange={e => { setLabor(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">기술 수준: {tech}</label>
          <input type="range" min={10} max={100} step={5} value={tech} onChange={e => { setTech(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>잠재GDP는 노동, 자본, 기술에 의해 결정됩니다. <strong>기술 혁신</strong>이 가장 큰 영향을 줍니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── gdp-gap ──
export function GDPGapLab({ onComplete, completed }: Props) {
  const [actualGDP, setActualGDP] = useState(98);
  const [changes, setChanges] = useState(0);
  const potentialGDP = 100;
  const gap = actualGDP - potentialGDP;
  const gapPct = Math.round(gap * 10) / 10;

  function handle(v: number) { setActualGDP(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">실질GDP를 조절하며 GDP갭과 정책 방향을 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 80">
        <rect x={40} y={10} width={240} height={25} rx={4} fill="#E7E5E4" fillOpacity={0.5} />
        <text x={45} y={27} fontSize={10} fill="#78716C" fontWeight={500}>잠재GDP: {potentialGDP}</text>
        <rect x={40} y={45} width={(actualGDP / 120) * 240} height={25} rx={4}
          fill={gap > 0 ? '#DC2626' : gap < 0 ? '#2563EB' : '#16A34A'} fillOpacity={0.7} />
        <text x={45} y={62} fontSize={10} fill="white" fontWeight={600}>실질GDP: {actualGDP} (갭: {gapPct > 0 ? '+' : ''}{gapPct}%)</text>
      </svg>
      <input type="range" min={85} max={115} step={1} value={actualGDP} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {gap > 0 ? <p>양의 갭: <strong>경기 과열</strong>. 긴축정책 필요.</p>
         : gap < 0 ? <p>음의 갭: <strong>경기 침체</strong>. 확장정책 필요.</p>
         : <p>갭 = 0: <strong>잠재수준</strong>에서 작동 중.</p>}
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `GDP를 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── economic-growth-rate ──
export function EconomicGrowthRateLab({ onComplete, completed }: Props) {
  const [growthRate, setGrowthRate] = useState(3);
  const [changes, setChanges] = useState(0);

  const years = 10;
  const values = Array.from({ length: years + 1 }, (_, y) => Math.round(100 * Math.pow(1 + growthRate / 100, y)));

  function handle(v: number) { setGrowthRate(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">경제성장률을 설정하면 10년간 GDP가 어떻게 변하는지 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 150">
        {values.map((v, i) => {
          const x = 25 + i * 27;
          const h = Math.min((v / 300) * 110, 110);
          return (
            <React.Fragment key={i}>
              <rect x={x} y={125 - h} width={20} height={h} rx={3} fill="#0D9488" fillOpacity={0.7} />
              <text x={x + 10} y={138} fontSize={7} fill="#78716C" textAnchor="middle">{i}년</text>
              {(i === 0 || i === 5 || i === years) && (
                <text x={x + 10} y={120 - h} fontSize={8} fill="#0D9488" textAnchor="middle" fontWeight={600}>{v}</text>
              )}
            </React.Fragment>
          );
        })}
        <line x1={25} y1={125} x2={300} y2={125} stroke="#A8A29E" strokeWidth={1} />
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">경제성장률: {growthRate}%</label>
        <input type="range" min={-3} max={10} step={0.5} value={growthRate} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>성장률 {growthRate}%이면 10년 후 GDP가 <strong>{values[years]}</strong>이 됩니다. 복리 효과가 작동합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `성장률을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── price-index ──
export function PriceIndexLab({ onComplete, completed }: Props) {
  const [rice, setRice] = useState(110);
  const [transport, setTransport] = useState(105);
  const [changes, setChanges] = useState(0);

  const cpi = Math.round(rice * 0.4 + transport * 0.3 + 100 * 0.3);
  const inflRate = cpi - 100;

  function handleChange() { setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">품목별 가격을 조절하며 물가지수가 어떻게 산출되는지 확인하세요.</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">식료품</p>
          <p className="font-display font-bold text-ink">{rice}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">교통비</p>
          <p className="font-display font-bold text-ink">{transport}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">물가지수</p>
          <p className={`font-display font-bold ${inflRate > 3 ? 'text-error' : 'text-success'}`}>{cpi}</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <input type="range" min={90} max={130} step={1} value={rice} onChange={e => { setRice(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        <input type="range" min={90} max={130} step={1} value={transport} onChange={e => { setTransport(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>물가지수는 품목별 가격을 <strong>가중 평균</strong>합니다. 물가상승률: {inflRate}%</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `가격을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── cpi ──
export function CPILab({ onComplete, completed }: Props) {
  const [energy, setEnergy] = useState(100);
  const [food, setFood] = useState(100);
  const [changes, setChanges] = useState(0);

  const cpi = Math.round(energy * 0.15 + food * 0.25 + 100 * 0.6);
  const coreCpi = Math.round(100 * 0.6 + food * 0.15 + 100 * 0.25); // exclude energy
  const diff = cpi - coreCpi;

  function handleChange() { setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">에너지와 식품 가격을 조절하며 CPI와 근원 CPI의 차이를 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 80">
        <rect x={40} y={10} width={(cpi / 140) * 240} height={25} rx={4} fill="#D97706" fillOpacity={0.7} />
        <text x={45} y={27} fontSize={10} fill="white" fontWeight={600}>CPI: {cpi}</text>
        <rect x={40} y={45} width={(coreCpi / 140) * 240} height={25} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={45} y={62} fontSize={10} fill="white" fontWeight={600}>근원 CPI: {coreCpi}</text>
      </svg>
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">에너지 가격: {energy}</label>
          <input type="range" min={70} max={150} step={5} value={energy} onChange={e => { setEnergy(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">식품 가격: {food}</label>
          <input type="range" min={70} max={150} step={5} value={food} onChange={e => { setFood(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>근원 CPI는 변동성 큰 에너지·식품을 제외하여 <strong>기조적 물가 추세</strong>를 파악합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `가격을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── productivity ──
export function ProductivityLab({ onComplete, completed }: Props) {
  const [workers, setWorkers] = useState(100);
  const [tech, setTech] = useState(1);
  const [changes, setChanges] = useState(0);

  const output = Math.round(workers * tech * 1.5);
  const laborProd = Math.round(output / workers * 10) / 10;

  function handleChange() { setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">노동자 수와 기술 수준을 조절하며 생산성 변화를 관찰하세요.</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">총산출</p>
          <p className="font-display text-lg font-bold text-primary">{output}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">노동자 수</p>
          <p className="font-display text-lg font-bold text-ink">{workers}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">1인당 생산성</p>
          <p className="font-display text-lg font-bold text-success">{laborProd}</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">노동자: {workers}명</label>
          <input type="range" min={50} max={200} step={10} value={workers} onChange={e => { setWorkers(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">기술 수준: {tech}</label>
          <input type="range" min={0.5} max={3} step={0.5} value={tech} onChange={e => { setTech(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>같은 노동자 수에서도 기술이 높으면 <strong>1인당 생산성이 크게 향상</strong>됩니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── labor-productivity ──
export function LaborProductivityLab({ onComplete, completed }: Props) {
  const [hours, setHours] = useState(40);
  const [changes, setChanges] = useState(0);

  const outputPerHour = Math.round(100 / Math.sqrt(hours / 40) * 10) / 10;
  const totalOutput = Math.round(outputPerHour * hours);

  function handle(v: number) { setHours(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">주당 근로시간을 조절하며 시간당 생산성 변화를 확인하세요.</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">근로시간</p>
          <p className="font-display text-lg font-bold text-ink">{hours}h</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">시간당 생산</p>
          <p className="font-display text-lg font-bold text-success">{outputPerHour}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">총생산</p>
          <p className="font-display text-lg font-bold text-primary">{totalOutput}</p>
        </div>
      </div>
      <input type="range" min={20} max={70} step={5} value={hours} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>근로시간이 길어지면 시간당 생산성이 <strong>떨어집니다</strong>. 효율적 근로가 중요합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `근로시간을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── capital-productivity ──
export function CapitalProductivityLab({ onComplete, completed }: Props) {
  const [capital, setCapital] = useState(100);
  const [changes, setChanges] = useState(0);

  const output = Math.round(200 * Math.sqrt(capital / 100));
  const capProd = Math.round(output / capital * 100) / 100;

  function handle(v: number) { setCapital(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">자본 투입량을 조절하며 자본생산성(산출/자본) 변화를 확인하세요.</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">자본 투입</p>
          <p className="font-display text-lg font-bold text-ink">{capital}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">산출량</p>
          <p className="font-display text-lg font-bold text-primary">{output}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">자본생산성</p>
          <p className="font-display text-lg font-bold text-success">{capProd}</p>
        </div>
      </div>
      <input type="range" min={50} max={500} step={50} value={capital} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>자본을 늘려도 자본생산성은 <strong>체감</strong>합니다. 한계생산성 체감의 법칙입니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `자본을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── human-capital ──
export function HumanCapitalLab({ onComplete, completed }: Props) {
  const [education, setEducation] = useState(50);
  const [training, setTraining] = useState(30);
  const [changes, setChanges] = useState(0);

  const hc = Math.round(education * 0.6 + training * 0.4);
  const wage = Math.round(200 + hc * 5);
  const productivity = Math.round(50 + hc * 0.8);

  function handleChange() { setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">교육과 직업훈련에 투자하며 인적자본이 임금에 미치는 영향을 확인하세요.</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">인적자본</p>
          <p className="font-display text-lg font-bold text-primary">{hc}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">임금(만원)</p>
          <p className="font-display text-lg font-bold text-success">{wage}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">생산성</p>
          <p className="font-display text-lg font-bold text-ink">{productivity}</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">교육 수준: {education}</label>
          <input type="range" min={10} max={100} step={5} value={education} onChange={e => { setEducation(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">직업 훈련: {training}</label>
          <input type="range" min={0} max={100} step={5} value={training} onChange={e => { setTraining(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>인적자본이 높을수록 <strong>생산성과 임금 모두 상승</strong>합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── labor-income-share ──
export function LaborIncomeShareLab({ onComplete, completed }: Props) {
  const [automation, setAutomation] = useState(30);
  const [changes, setChanges] = useState(0);

  const laborShare = Math.max(30, Math.round(70 - automation * 0.5));
  const capitalShare = 100 - laborShare;

  function handle(v: number) { setAutomation(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">자동화 수준을 조절하며 노동소득분배율의 변화를 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 60">
        <rect x={40} y={15} width={(laborShare / 100) * 240} height={30} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <rect x={40 + (laborShare / 100) * 240} y={15} width={(capitalShare / 100) * 240} height={30} rx={4} fill="#D97706" fillOpacity={0.7} />
        <text x={45} y={35} fontSize={10} fill="white" fontWeight={600}>노동: {laborShare}%</text>
        <text x={45 + (laborShare / 100) * 240} y={35} fontSize={10} fill="white" fontWeight={600}>자본: {capitalShare}%</text>
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">자동화 수준: {automation}%</label>
        <input type="range" min={0} max={80} step={5} value={automation} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>자동화가 진행될수록 노동소득분배율이 <strong>하락</strong>합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `자동화를 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── economically-active ──
export function EconomicallyActiveLab({ onComplete, completed }: Props) {
  const [participation, setParticipation] = useState(64);
  const [changes, setChanges] = useState(0);

  const totalPop = 4400; // 만명
  const active = Math.round(totalPop * participation / 100);
  const inactive = totalPop - active;

  function handle(v: number) { setParticipation(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">경제활동참가율을 조절하며 경제활동인구와 비경제활동인구를 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 60">
        <rect x={40} y={15} width={(participation / 100) * 240} height={30} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <rect x={40 + (participation / 100) * 240} y={15} width={((100 - participation) / 100) * 240} height={30} rx={4} fill="#E7E5E4" fillOpacity={0.7} />
        <text x={45} y={35} fontSize={10} fill="white" fontWeight={600}>경제활동: {active}만명</text>
      </svg>
      <input type="range" min={50} max={80} step={1} value={participation} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>비경제활동인구({inactive}만명)에는 학생, 전업주부, 은퇴자 등이 포함됩니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `참가율을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── unemployment-rate ──
export function UnemploymentRateLab({ onComplete, completed }: Props) {
  const [officialRate, setOfficialRate] = useState(3.5);
  const [changes, setChanges] = useState(0);

  const discouraged = Math.round(officialRate * 1.5);
  const partTime = Math.round(officialRate * 2);
  const extendedRate = Math.round((officialRate + discouraged + partTime) * 10) / 10;

  function handle(v: number) { setOfficialRate(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">공식 실업률을 조절하며 확장 실업률과의 차이를 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 80">
        <rect x={40} y={10} width={(officialRate / 20) * 240} height={25} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <text x={45} y={27} fontSize={10} fill="white" fontWeight={600}>공식 실업률: {officialRate}%</text>
        <rect x={40} y={45} width={(extendedRate / 20) * 240} height={25} rx={4} fill="#DC2626" fillOpacity={0.7} />
        <text x={45} y={62} fontSize={10} fill="white" fontWeight={600}>확장 실업률: {extendedRate}%</text>
      </svg>
      <input type="range" min={1} max={10} step={0.5} value={officialRate} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>구직 포기자, 단시간 근로자를 포함하면 <strong>체감 실업률은 공식 수치의 3배</strong>입니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `실업률을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── unemployment-gap ──
export function UnemploymentGapLab({ onComplete, completed }: Props) {
  const [actual, setActual] = useState(4);
  const [changes, setChanges] = useState(0);
  const natural = 3.8;
  const gap = Math.round((actual - natural) * 10) / 10;

  function handle(v: number) { setActual(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">실제 실업률을 조절하며 실업률갭과 정책 방향을 확인하세요.</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">실제 실업률</p>
          <p className="font-display text-lg font-bold text-ink">{actual}%</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">자연실업률</p>
          <p className="font-display text-lg font-bold text-ink-secondary">{natural}%</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">갭</p>
          <p className={`font-display text-lg font-bold ${gap > 0 ? 'text-error' : gap < 0 ? 'text-warning' : 'text-success'}`}>{gap > 0 ? '+' : ''}{gap}%</p>
        </div>
      </div>
      <input type="range" min={1} max={8} step={0.2} value={actual} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {gap > 0 ? <p>양의 갭: <strong>경기 침체</strong>로 비자발적 실업 발생. 확장정책 필요.</p>
         : gap < 0 ? <p>음의 갭: <strong>노동시장 과열</strong>. 임금 상승 압력 발생.</p>
         : <p>갭 = 0: 완전고용 상태.</p>}
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `실업률을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── natural-unemployment ──
export function NaturalUnemploymentLab({ onComplete, completed }: Props) {
  const [frictional, setFrictional] = useState(2);
  const [structural, setStructural] = useState(1.5);
  const [changes, setChanges] = useState(0);

  const naturalRate = Math.round((frictional + structural) * 10) / 10;

  function handleChange() { setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">마찰적 실업과 구조적 실업을 조절하며 자연실업률이 어떻게 결정되는지 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 60">
        <rect x={40} y={15} width={(frictional / 6) * 120} height={30} rx={4} fill="#D97706" fillOpacity={0.7} />
        <rect x={40 + (frictional / 6) * 120} y={15} width={(structural / 6) * 120} height={30} rx={4} fill="#7C3AED" fillOpacity={0.7} />
        <text x={45} y={35} fontSize={9} fill="white" fontWeight={600}>마찰적: {frictional}%</text>
        <text x={45 + (frictional / 6) * 120} y={35} fontSize={9} fill="white" fontWeight={600}>구조적: {structural}%</text>
        <text x={50 + ((frictional + structural) / 6) * 120} y={35} fontSize={11} fill="#78716C" fontWeight={600}>= {naturalRate}%</text>
      </svg>
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">마찰적 실업: {frictional}%</label>
          <input type="range" min={0.5} max={5} step={0.5} value={frictional} onChange={e => { setFrictional(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">구조적 실업: {structural}%</label>
          <input type="range" min={0.5} max={5} step={0.5} value={structural} onChange={e => { setStructural(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>자연실업률 = 마찰적 + 구조적. 경기적 실업은 포함하지 않습니다. <strong>직업 훈련</strong>으로 구조적 실업을 줄일 수 있습니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── growth-contribution ──
export function GrowthContributionLab({ onComplete, completed }: Props) {
  const [labor, setLabor] = useState(0.5);
  const [capital, setCapital] = useState(1.0);
  const [tfp, setTfp] = useState(0.5);
  const [changes, setChanges] = useState(0);

  const totalGrowth = Math.round((labor + capital + tfp) * 10) / 10;

  function handleChange() { setChanges(p => p + 1); }
  const canComplete = changes >= 6;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">노동, 자본, 기술(TFP) 기여도를 조절하며 경제성장률이 어떻게 구성되는지 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 60">
        {[
          { label: '노동', val: labor, color: '#2563EB' },
          { label: '자본', val: capital, color: '#D97706' },
          { label: 'TFP', val: tfp, color: '#16A34A' },
        ].reduce<{ el: React.ReactNode[]; x: number }>((acc, b, i) => {
          const w = (b.val / 5) * 240;
          acc.el.push(
            <React.Fragment key={i}>
              <rect x={40 + acc.x} y={15} width={Math.max(w, 0)} height={30} rx={i === 0 ? 4 : 0} fill={b.color} fillOpacity={0.7} />
              {w > 30 && <text x={45 + acc.x} y={35} fontSize={9} fill="white" fontWeight={600}>{b.label} {b.val}%p</text>}
            </React.Fragment>
          );
          acc.x += Math.max(w, 0);
          return acc;
        }, { el: [], x: 0 }).el}
        <text x={290} y={35} fontSize={11} fill="#78716C" fontWeight={600}>= {totalGrowth}%</text>
      </svg>
      <div className="space-y-2 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">노동 기여: {labor}%p</label>
          <input type="range" min={-0.5} max={2} step={0.1} value={labor} onChange={e => { setLabor(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">자본 기여: {capital}%p</label>
          <input type="range" min={0} max={3} step={0.1} value={capital} onChange={e => { setCapital(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">TFP 기여: {tfp}%p</label>
          <input type="range" min={0} max={3} step={0.1} value={tfp} onChange={e => { setTfp(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>선진국일수록 <strong>TFP(기술 혁신)</strong>의 성장기여도가 높습니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양하게 조절하세요 (${Math.min(changes, 6)}/6)`}
        </button>
      )}
    </div>
  );
}
