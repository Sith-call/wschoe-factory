import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

// ── marginal-utility ──
export function MarginalUtilityLab({ onComplete, completed }: Props) {
  const [qty, setQty] = useState(1);
  const [explored, setExplored] = useState(new Set<number>());

  const mu = (q: number) => Math.max(0, Math.round(100 * Math.exp(-0.3 * (q - 1))));
  const total = Array.from({ length: qty }, (_, i) => mu(i + 1)).reduce((a, b) => a + b, 0);

  function handle(v: number) { setQty(v); setExplored(prev => new Set(prev).add(v)); }

  const W = 300, H = 150, PAD = 35;
  const canComplete = explored.size >= 6;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">아이스크림을 하나씩 더 먹을 때 추가 만족감(한계효용)이 어떻게 변하는지 확인하세요.</p>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {Array.from({ length: 8 }, (_, i) => {
          const q = i + 1;
          const x = PAD + (q / 9) * (W - PAD * 2);
          const h = (mu(q) / 110) * (H - PAD * 2);
          return (
            <React.Fragment key={q}>
              <rect x={x - 8} y={H - PAD - h} width={16} height={h} rx={3}
                fill={q <= qty ? '#0D9488' : '#E7E5E4'} fillOpacity={q <= qty ? 0.8 : 0.4} />
              <text x={x} y={H - 8} fontSize={8} fill="#78716C" textAnchor="middle">{q}개</text>
              {q <= qty && <text x={x} y={H - PAD - h - 4} fontSize={8} fill="#0D9488" textAnchor="middle" fontWeight={600}>{mu(q)}</text>}
            </React.Fragment>
          );
        })}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
      </svg>
      <input type="range" min={1} max={8} step={1} value={qty} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-3" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">한계효용</p>
          <p className="font-display text-lg font-bold" style={{ color: '#0D9488' }}>{mu(qty)}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">총효용</p>
          <p className="font-display text-lg font-bold text-ink">{total}</p>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>소비가 늘수록 한계효용이 <strong>감소</strong>합니다. 이것이 한계효용 체감의 법칙입니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양한 소비량을 시도하세요 (${explored.size}/6)`}
        </button>
      )}
    </div>
  );
}

// ── diminishing-returns ──
export function DiminishingReturnsLab({ onComplete, completed }: Props) {
  const [workers, setWorkers] = useState(1);
  const [explored, setExplored] = useState(new Set<number>());

  const output = (w: number) => Math.round(50 * Math.sqrt(w));
  const marginal = (w: number) => output(w) - output(Math.max(0, w - 1));

  function handle(v: number) { setWorkers(v); setExplored(prev => new Set(prev).add(v)); }
  const canComplete = explored.size >= 6;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">같은 크기 카페에 알바생을 추가할 때 생산량 변화를 관찰하세요.</p>
      <svg width="100%" viewBox="0 0 300 140">
        {Array.from({ length: 8 }, (_, i) => {
          const w = i + 1;
          const x = 30 + (w / 9) * 240;
          const h = (output(w) / 150) * 100;
          const mh = (marginal(w) / 60) * 100;
          return (
            <React.Fragment key={w}>
              <rect x={x - 10} y={120 - h} width={9} height={h} rx={2} fill="#2563EB" fillOpacity={w <= workers ? 0.8 : 0.2} />
              <rect x={x + 1} y={120 - mh} width={9} height={mh} rx={2} fill="#D97706" fillOpacity={w <= workers ? 0.8 : 0.2} />
            </React.Fragment>
          );
        })}
        <line x1={30} y1={120} x2={270} y2={120} stroke="#A8A29E" strokeWidth={1} />
        <text x={15} y={12} fontSize={8} fill="#2563EB">총생산</text>
        <text x={55} y={12} fontSize={8} fill="#D97706">한계생산</text>
      </svg>
      <input type="range" min={1} max={8} step={1} value={workers} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-3" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">총생산량</p>
          <p className="font-display text-lg font-bold text-primary">{output(workers)}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">한계생산량</p>
          <p className="font-display text-lg font-bold text-warning">{marginal(workers)}</p>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>알바생을 추가할수록 한계생산량이 <strong>줄어듭니다</strong>. 고정 자원(매장 크기)이 한계입니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양한 인원을 시도하세요 (${explored.size}/6)`}
        </button>
      )}
    </div>
  );
}

// ── marginal-cost ──
export function MarginalCostLab({ onComplete, completed }: Props) {
  const [qty, setQty] = useState(3);
  const [explored, setExplored] = useState(new Set<number>());

  const mc = (q: number) => Math.round(10 + 2 * (q - 1) * (q - 1));
  const mr = 50; // constant market price

  function handle(v: number) { setQty(v); setExplored(prev => new Set(prev).add(v)); }
  const canComplete = explored.size >= 6;
  const optimalQ = 5; // where MC ≈ MR

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">생산량을 조절하며 한계비용(MC)과 시장가격(MR)이 만나는 이윤극대화 지점을 찾으세요.</p>
      <svg width="100%" viewBox="0 0 300 140">
        {Array.from({ length: 8 }, (_, i) => {
          const q = i + 1;
          const x = 30 + (q / 9) * 240;
          const mcH = Math.min((mc(q) / 100) * 100, 100);
          const mrH = (mr / 100) * 100;
          return (
            <React.Fragment key={q}>
              <rect x={x - 8} y={120 - mcH} width={16} height={mcH} rx={3}
                fill={mc(q) <= mr ? '#16A34A' : '#DC2626'} fillOpacity={q === qty ? 1 : 0.3} />
            </React.Fragment>
          );
        })}
        <line x1={30} y1={120 - (mr / 100) * 100} x2={270} y2={120 - (mr / 100) * 100} stroke="#2563EB" strokeWidth={1.5} strokeDasharray="4" />
        <text x={275} y={120 - (mr / 100) * 100 + 4} fontSize={9} fill="#2563EB">MR={mr}</text>
        <line x1={30} y1={120} x2={270} y2={120} stroke="#A8A29E" strokeWidth={1} />
      </svg>
      <input type="range" min={1} max={8} step={1} value={qty} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-3" />
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">MC</p>
          <p className="font-display font-bold text-error">{mc(qty)}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">MR</p>
          <p className="font-display font-bold text-primary">{mr}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">이윤</p>
          <p className={`font-display font-bold ${mr - mc(qty) >= 0 ? 'text-success' : 'text-error'}`}>{mr - mc(qty)}</p>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {mc(qty) < mr ? <p>MC &lt; MR: 생산을 <strong>늘리면</strong> 이윤이 증가합니다.</p>
         : mc(qty) > mr ? <p>MC &gt; MR: 생산을 <strong>줄여야</strong> 합니다.</p>
         : <p>MC = MR: <strong>이윤극대화</strong> 지점입니다!</p>}
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `다양한 생산량을 시도하세요 (${explored.size}/6)`}
        </button>
      )}
    </div>
  );
}

// ── producer-surplus ──
export function ProducerSurplusLab({ onComplete, completed }: Props) {
  const [marketPrice, setMarketPrice] = useState(50);
  const [changes, setChanges] = useState(0);

  const costs = [15, 25, 35, 45, 55, 65, 75];
  const surplus = costs.filter(c => c < marketPrice).reduce((sum, c) => sum + (marketPrice - c), 0);
  const sellers = costs.filter(c => c < marketPrice).length;

  function handle(v: number) { setMarketPrice(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">시장가격을 조절하며 생산자잉여가 어떻게 변하는지 관찰하세요.</p>
      <svg width="100%" viewBox="0 0 320 150">
        {costs.map((c, i) => {
          const x = 30 + i * 40;
          const h = (c / 80) * 100;
          const inMarket = c < marketPrice;
          return (
            <React.Fragment key={i}>
              <rect x={x} y={120 - h} width={28} height={h} rx={3} fill={inMarket ? '#16A34A' : '#E7E5E4'} fillOpacity={0.7} />
              {inMarket && <rect x={x} y={120 - (marketPrice / 80) * 100} width={28} height={((marketPrice - c) / 80) * 100} rx={3} fill="#16A34A" fillOpacity={0.3} />}
              <text x={x + 14} y={135} fontSize={8} fill="#78716C" textAnchor="middle">{c}원</text>
            </React.Fragment>
          );
        })}
        <line x1={25} y1={120 - (marketPrice / 80) * 100} x2={310} y2={120 - (marketPrice / 80) * 100} stroke="#DC2626" strokeWidth={1.5} strokeDasharray="4" />
        <text x={312} y={120 - (marketPrice / 80) * 100 - 3} fontSize={9} fill="#DC2626">P</text>
      </svg>
      <input type="range" min={10} max={80} step={5} value={marketPrice} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-3" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">판매 가능 생산자</p>
          <p className="font-display text-lg font-bold text-success">{sellers}명</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">총 생산자잉여</p>
          <p className="font-display text-lg font-bold text-success">{surplus}원</p>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>가격이 높을수록 생산자잉여가 <strong>증가</strong>합니다. 초록 영역이 생산자의 이득입니다.</p>
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

// ── total-surplus ──
export function TotalSurplusLab({ onComplete, completed }: Props) {
  const [tax, setTax] = useState(0);
  const [changes, setChanges] = useState(0);

  const eqPrice = 50;
  const cs = Math.max(0, Math.round(100 - tax * 3));
  const ps = Math.max(0, Math.round(80 - tax * 2.5));
  const ts = cs + ps;
  const dwl = Math.round(tax * tax * 0.1);

  function handle(v: number) { setTax(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">세금을 부과하면 총잉여가 어떻게 변하는지 관찰하세요.</p>
      <svg width="100%" viewBox="0 0 320 120">
        <rect x={40} y={20} width={(cs / 120) * 240} height={25} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <text x={45} y={37} fontSize={10} fill="white" fontWeight={600}>소비자잉여: {cs}</text>
        <rect x={40} y={50} width={(ps / 120) * 240} height={25} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={45} y={67} fontSize={10} fill="white" fontWeight={600}>생산자잉여: {ps}</text>
        {dwl > 0 && <>
          <rect x={40} y={80} width={(dwl / 120) * 240} height={25} rx={4} fill="#DC2626" fillOpacity={0.5} />
          <text x={45} y={97} fontSize={10} fill="white" fontWeight={600}>경사중량손실: {dwl}</text>
        </>}
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">세금: {tax}원</label>
        <input type="range" min={0} max={20} step={1} value={tax} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">총잉여</p>
          <p className="font-display text-lg font-bold text-ink">{ts}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">순손실</p>
          <p className="font-display text-lg font-bold text-error">{dwl}</p>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>세금이 커질수록 <strong>경사중량손실</strong>이 증가하고 총잉여는 감소합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `세금을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── perfect-competition ──
export function PerfectCompetitionLab({ onComplete, completed }: Props) {
  const [firms, setFirms] = useState(5);
  const [changes, setChanges] = useState(0);

  const marketPrice = Math.round(100 / Math.sqrt(firms));
  const profit = Math.max(0, Math.round(marketPrice - 30 - 50 / firms));

  function handle(v: number) { setFirms(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">시장의 기업 수를 늘려가며 완전경쟁에 가까워지는 과정을 관찰하세요.</p>
      <svg width="100%" viewBox="0 0 320 100">
        <rect x={40} y={15} width={(marketPrice / 100) * 240} height={25} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <text x={45} y={32} fontSize={10} fill="white" fontWeight={600}>시장가격: {marketPrice}</text>
        <rect x={40} y={50} width={Math.max((profit / 50) * 240, 0)} height={25} rx={4} fill={profit > 10 ? '#D97706' : '#16A34A'} fillOpacity={0.7} />
        <text x={45} y={67} fontSize={10} fill="white" fontWeight={600}>초과이윤: {profit}</text>
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">기업 수: {firms}개</label>
        <input type="range" min={1} max={50} step={1} value={firms} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {firms < 5 ? <p>기업이 적으면 <strong>높은 가격</strong>과 초과이윤이 가능합니다.</p>
         : firms < 20 ? <p>경쟁이 심해지면서 가격과 이윤이 <strong>줄어듭니다</strong>.</p>
         : <p>완전경쟁에 가까워지면 초과이윤이 <strong>0에 수렴</strong>합니다.</p>}
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `기업 수를 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── oligopoly ──
export function OligopolyLab({ onComplete, completed }: Props) {
  const [priceA, setPriceA] = useState(80);
  const [changes, setChanges] = useState(0);

  // Competitor follows with a lag
  const priceB = Math.round(priceA * 0.95 + 5);
  const shareA = Math.round(50 + (priceB - priceA) * 2);
  const shareB = 100 - shareA;

  function handle(v: number) { setPriceA(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">A사의 가격을 설정하면 경쟁사 B가 반응합니다. 과점 시장의 전략적 상호작용을 체험하세요.</p>
      <svg width="100%" viewBox="0 0 320 100">
        <rect x={40} y={15} width={(shareA / 100) * 240} height={30} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <text x={45} y={35} fontSize={10} fill="white" fontWeight={600}>A사: {priceA}원 ({shareA}%)</text>
        <rect x={40} y={55} width={(shareB / 100) * 240} height={30} rx={4} fill="#DC2626" fillOpacity={0.7} />
        <text x={45} y={75} fontSize={10} fill="white" fontWeight={600}>B사: {priceB}원 ({shareB}%)</text>
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">A사 가격: {priceA}원</label>
        <input type="range" min={30} max={150} step={5} value={priceA} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>과점 시장에서는 경쟁사의 반응을 <strong>예측하며 전략적으로</strong> 행동해야 합니다.</p>
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

// ── economies-of-scale ──
export function EconomiesOfScaleLab({ onComplete, completed }: Props) {
  const [production, setProduction] = useState(100);
  const [changes, setChanges] = useState(0);

  const fixedCost = 10000;
  const varCostPerUnit = 50;
  const avgCost = Math.round(fixedCost / production + varCostPerUnit);
  const totalCost = fixedCost + varCostPerUnit * production;

  function handle(v: number) { setProduction(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">생산량을 늘리면 단위당 평균 비용이 어떻게 변하는지 확인하세요.</p>
      <svg width="100%" viewBox="0 0 300 140">
        {[50, 100, 200, 500, 1000, 2000, 5000].map((q, i) => {
          const x = 25 + i * 38;
          const ac = fixedCost / q + varCostPerUnit;
          const h = Math.min((ac / 300) * 100, 100);
          return (
            <React.Fragment key={q}>
              <rect x={x} y={115 - h} width={28} height={h} rx={3}
                fill={q === production ? '#0D9488' : '#E7E5E4'} fillOpacity={q === production ? 0.9 : 0.4} />
              <text x={x + 14} y={128} fontSize={7} fill="#78716C" textAnchor="middle">{q >= 1000 ? `${q / 1000}k` : q}</text>
            </React.Fragment>
          );
        })}
        <line x1={25} y1={115} x2={295} y2={115} stroke="#A8A29E" strokeWidth={1} />
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">생산량: {production.toLocaleString()}개</label>
        <input type="range" min={50} max={5000} step={50} value={production} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">단위당 평균비용</p>
          <p className="font-display text-lg font-bold" style={{ color: '#0D9488' }}>{avgCost}원</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">고정비 비중</p>
          <p className="font-display text-lg font-bold text-ink">{Math.round(fixedCost / totalCost * 100)}%</p>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>생산량이 커질수록 고정비가 분산되어 평균비용이 <strong>감소</strong>합니다. 이것이 규모의 경제입니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `생산량을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── market-failure ──
export function MarketFailureLab({ onComplete, completed }: Props) {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: '1. 완전경쟁 시장', desc: '시장이 효율적으로 작동합니다. 총잉여가 극대화됩니다.', color: '#16A34A', efficiency: 100 },
    { title: '2. 독점 발생', desc: '한 기업이 시장을 지배합니다. 가격 상승, 생산량 감소.', color: '#D97706', efficiency: 70 },
    { title: '3. 외부효과', desc: '오염 비용이 가격에 반영되지 않아 과잉 생산됩니다.', color: '#DC2626', efficiency: 60 },
    { title: '4. 정부 개입', desc: '규제와 세금으로 시장실패를 교정합니다.', color: '#2563EB', efficiency: 85 },
  ];
  const cur = stages[stage];

  function next() { if (stage < stages.length - 1) setStage(stage + 1); }
  const canComplete = stage === stages.length - 1;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">시장실패가 발생하고 교정되는 과정을 단계별로 진행하세요.</p>
      <div className="border border-border rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold text-ink mb-2">{cur.title}</p>
        <svg width="100%" viewBox="0 0 280 50">
          <rect x={10} y={10} width={(cur.efficiency / 100) * 260} height={30} rx={4} fill={cur.color} fillOpacity={0.7} />
          <text x={15} y={30} fontSize={11} fill="white" fontWeight={600}>효율성: {cur.efficiency}%</text>
        </svg>
        <p className="text-xs text-ink-secondary mt-2">{cur.desc}</p>
      </div>
      <div className="flex gap-2 mb-4">
        {stages.map((s, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full ${i <= stage ? 'bg-primary' : 'bg-stone-200'}`} />
        ))}
      </div>
      {stage < stages.length - 1 && (
        <button onClick={next} className="w-full rounded-lg px-5 py-2.5 font-medium text-sm bg-stone-100 text-ink mb-3">다음 단계</button>
      )}
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : '모든 단계를 진행하세요'}
        </button>
      )}
    </div>
  );
}

// ── public-goods ──
export function PublicGoodsLab({ onComplete, completed }: Props) {
  const [contributors, setContributors] = useState(3);
  const [changes, setChanges] = useState(0);
  const total = 10;
  const freeRiders = total - contributors;
  const fundingPct = Math.round((contributors / total) * 100);
  const quality = Math.round(contributors * 10);

  function handle(v: number) { setContributors(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">10명 중 몇 명이 공공재 비용을 부담하는지 조절하세요. 무임승차자가 늘면 어떻게 될까요?</p>
      <svg width="100%" viewBox="0 0 320 80">
        {Array.from({ length: total }, (_, i) => {
          const x = 20 + i * 30;
          const isPayer = i < contributors;
          return (
            <React.Fragment key={i}>
              <circle cx={x + 10} cy={30} r={12} fill={isPayer ? '#16A34A' : '#DC2626'} fillOpacity={0.7} />
              <text x={x + 10} y={34} fontSize={9} fill="white" textAnchor="middle" fontWeight={600}>{isPayer ? '$' : '?'}</text>
            </React.Fragment>
          );
        })}
        <text x={160} y={70} fontSize={11} fill="#78716C" textAnchor="middle">공공재 품질: {quality}% | 무임승차자: {freeRiders}명</text>
      </svg>
      <input type="range" min={0} max={10} step={1} value={contributors} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {contributors < 3 ? <p>비용 부담자가 너무 적으면 공공재가 <strong>제대로 공급되지 않습니다</strong>.</p>
         : <p>비배제성 때문에 비용을 내지 않아도 혜택을 누릴 수 있어 <strong>무임승차 문제</strong>가 발생합니다.</p>}
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `부담자 수를 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── free-rider ──
export function FreeRiderLab({ onComplete, completed }: Props) {
  const [myContrib, setMyContrib] = useState(50);
  const [rounds, setRounds] = useState(0);

  const othersContrib = Math.max(10, 60 - rounds * 10); // others reduce over time
  const totalPool = myContrib + othersContrib * 4;
  const myReturn = Math.round(totalPool * 0.2);
  const myProfit = myReturn - myContrib;

  function nextRound() {
    setRounds(r => r + 1);
    setMyContrib(50);
  }

  const canComplete = rounds >= 3;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">공공재 게임: 기여금을 정하세요. 다른 사람들은 점점 기여를 줄입니다.</p>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">나의 기여금: {myContrib}</label>
        <input type="range" min={0} max={100} step={10} value={myContrib} onChange={e => setMyContrib(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">공공 풀</p>
          <p className="font-display font-bold text-ink">{totalPool}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">나의 배당</p>
          <p className="font-display font-bold text-primary">{myReturn}</p>
        </div>
        <div className="border border-border rounded-md p-2 text-center">
          <p className="text-xs text-ink-secondary">순이익</p>
          <p className={`font-display font-bold ${myProfit >= 0 ? 'text-success' : 'text-error'}`}>{myProfit}</p>
        </div>
      </div>
      <button onClick={nextRound} className="w-full rounded-lg px-5 py-2 font-medium text-sm bg-stone-100 text-ink mb-3">
        다음 라운드 (현재: {rounds + 1}/4)
      </button>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>모두가 무임승차하면 공공재가 <strong>사라집니다</strong>. 이것이 무임승차자 문제입니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `${rounds}/3 라운드 완료`}
        </button>
      )}
    </div>
  );
}

// ── information-asymmetry ──
export function InformationAsymmetryLab({ onComplete, completed }: Props) {
  const [inspections, setInspections] = useState(0);
  const [changes, setChanges] = useState(0);

  const goodCars = Math.round(30 + inspections * 8);
  const badCars = Math.round(70 - inspections * 8);
  const avgPrice = Math.round(50 + inspections * 5);

  function handle(v: number) { setInspections(v); setChanges(p => p + 1); }
  const canComplete = changes >= 4;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">중고차 시장에서 차량 검사(정보 공개) 수준을 조절해 레몬 시장 문제를 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 100">
        <rect x={40} y={15} width={(goodCars / 100) * 240} height={25} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={45} y={32} fontSize={10} fill="white" fontWeight={600}>좋은 차: {goodCars}%</text>
        <rect x={40} y={50} width={(badCars / 100) * 240} height={25} rx={4} fill="#DC2626" fillOpacity={0.7} />
        <text x={45} y={67} fontSize={10} fill="white" fontWeight={600}>나쁜 차(레몬): {badCars}%</text>
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">차량 검사 수준: {inspections}</label>
        <input type="range" min={0} max={8} step={1} value={inspections} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {inspections < 3 ? <p>정보 비대칭이 심하면 좋은 차가 시장에서 <strong>사라집니다</strong>(역선택).</p>
         : <p>정보 공개가 늘면 <strong>좋은 차가 돌아오고</strong> 시장이 정상화됩니다.</p>}
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `검사 수준을 다양하게 조절하세요 (${Math.min(changes, 4)}/4)`}
        </button>
      )}
    </div>
  );
}

// ── moral-hazard ──
export function MoralHazardLab({ onComplete, completed }: Props) {
  const [coverage, setCoverage] = useState(50);
  const [changes, setChanges] = useState(0);

  const carelessness = Math.round(coverage * 0.8);
  const accidents = Math.round(10 + coverage * 0.3);
  const insuranceCost = Math.round(coverage * 1.5 + accidents * 2);

  function handle(v: number) { setCoverage(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">보험 보장 범위를 조절하며 도덕적 해이가 어떻게 발생하는지 관찰하세요.</p>
      <svg width="100%" viewBox="0 0 320 120">
        {[
          { label: '보장 범위', val: coverage, color: '#2563EB' },
          { label: '부주의 수준', val: carelessness, color: '#DC2626' },
          { label: '사고 발생률', val: accidents, color: '#D97706' },
        ].map((b, i) => (
          <React.Fragment key={i}>
            <rect x={40} y={10 + i * 35} width={(b.val / 100) * 240} height={25} rx={4} fill={b.color} fillOpacity={0.7} />
            <text x={45} y={27 + i * 35} fontSize={10} fill="white" fontWeight={600}>{b.label}: {b.val}%</text>
          </React.Fragment>
        ))}
      </svg>
      <input type="range" min={0} max={100} step={10} value={coverage} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>보장 범위가 넓을수록 <strong>부주의가 증가</strong>합니다. 자기부담금으로 이를 방지합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `보장 범위를 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── adverse-selection ──
export function AdverseSelectionLab({ onComplete, completed }: Props) {
  const [premium, setPremium] = useState(50);
  const [changes, setChanges] = useState(0);

  const healthyJoin = Math.max(0, Math.round(80 - premium * 1.2));
  const sickJoin = Math.round(Math.min(100, 30 + premium * 0.3));
  const riskPool = sickJoin > healthyJoin ? 'high' : 'balanced';

  function handle(v: number) { setPremium(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">보험료를 조절하며 건강한 사람과 아픈 사람의 가입 비율을 관찰하세요.</p>
      <svg width="100%" viewBox="0 0 320 100">
        <rect x={40} y={15} width={(healthyJoin / 100) * 240} height={25} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={45} y={32} fontSize={10} fill="white" fontWeight={600}>건강한 가입자: {healthyJoin}%</text>
        <rect x={40} y={50} width={(sickJoin / 100) * 240} height={25} rx={4} fill="#DC2626" fillOpacity={0.7} />
        <text x={45} y={67} fontSize={10} fill="white" fontWeight={600}>고위험 가입자: {sickJoin}%</text>
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">보험료: {premium}만원</label>
        <input type="range" min={10} max={100} step={5} value={premium} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {riskPool === 'high' ? <p>보험료가 높으면 건강한 사람이 빠져나가고 <strong>역선택</strong>이 심화됩니다.</p>
         : <p>적정 보험료에서는 <strong>균형 잡힌 가입자 풀</strong>이 유지됩니다.</p>}
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `보험료를 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── government-failure ──
export function GovernmentFailureLab({ onComplete, completed }: Props) {
  const [regulation, setRegulation] = useState(5);
  const [changes, setChanges] = useState(0);

  const marketEff = Math.max(20, Math.round(70 - regulation * 2));
  const govCorrection = Math.round(regulation * 5);
  const bureaucracy = Math.round(regulation * regulation * 0.5);
  const netEff = Math.max(10, Math.round(marketEff + govCorrection - bureaucracy));

  function handle(v: number) { setRegulation(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">정부 규제 수준을 조절하며 시장효율성과 관료비용의 균형을 찾으세요.</p>
      <svg width="100%" viewBox="0 0 320 80">
        <rect x={40} y={10} width={(netEff / 100) * 240} height={25} rx={4} fill={netEff > 60 ? '#16A34A' : netEff > 40 ? '#D97706' : '#DC2626'} fillOpacity={0.7} />
        <text x={45} y={27} fontSize={10} fill="white" fontWeight={600}>순 효율성: {netEff}%</text>
        <rect x={40} y={45} width={(bureaucracy / 80) * 240} height={25} rx={4} fill="#DC2626" fillOpacity={0.5} />
        <text x={45} y={62} fontSize={10} fill="white" fontWeight={600}>관료 비용: {bureaucracy}</text>
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">규제 수준: {regulation}</label>
        <input type="range" min={0} max={12} step={1} value={regulation} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {regulation > 8 ? <p>과도한 규제는 <strong>정부실패</strong>를 초래합니다. 관료 비용이 교정 효과를 초과합니다.</p>
         : <p>적정 규제는 시장실패를 교정하지만, <strong>과잉 규제는 새로운 비효율</strong>을 만듭니다.</p>}
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `규제를 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── tax-burden-ratio ──
export function TaxBurdenRatioLab({ onComplete, completed }: Props) {
  const [taxRate, setTaxRate] = useState(21);
  const [changes, setChanges] = useState(0);

  const welfare = Math.round(taxRate * 2.2);
  const growth = Math.max(0, Math.round(5 - taxRate * 0.08));

  function handle(v: number) { setTaxRate(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  const countries = [
    { name: '한국', rate: 21 }, { name: 'OECD 평균', rate: 25 },
    { name: '미국', rate: 24 }, { name: '스웨덴', rate: 42 },
  ];

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">조세부담률을 조절하며 복지 수준과 경제성장의 관계를 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 100">
        {countries.map((c, i) => (
          <React.Fragment key={i}>
            <rect x={40} y={5 + i * 23} width={(c.rate / 50) * 230} height={18} rx={3}
              fill={Math.abs(c.rate - taxRate) < 3 ? '#0D9488' : '#E7E5E4'} fillOpacity={0.7} />
            <text x={45} y={18 + i * 23} fontSize={9} fill={Math.abs(c.rate - taxRate) < 3 ? 'white' : '#78716C'} fontWeight={500}>{c.name}: {c.rate}%</text>
          </React.Fragment>
        ))}
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">조세부담률: {taxRate}%</label>
        <input type="range" min={10} max={50} step={1} value={taxRate} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">복지 수준</p>
          <p className="font-display text-lg font-bold text-primary">{welfare}%</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">성장률</p>
          <p className="font-display text-lg font-bold text-success">{growth}%</p>
        </div>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `조세부담률을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── economic-welfare ──
export function EconomicWelfareLab({ onComplete, completed }: Props) {
  const [gdpWeight, setGdpWeight] = useState(50);
  const [changes, setChanges] = useState(0);

  const healthWeight = (100 - gdpWeight) * 0.4;
  const eduWeight = (100 - gdpWeight) * 0.3;
  const envWeight = (100 - gdpWeight) * 0.3;

  const koreaScore = Math.round(gdpWeight * 0.8 + healthWeight * 0.7 + eduWeight * 0.9 + envWeight * 0.5);
  const swedenScore = Math.round(gdpWeight * 0.6 + healthWeight * 0.95 + eduWeight * 0.95 + envWeight * 0.9);

  function handle(v: number) { setGdpWeight(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">GDP 비중을 조절하며 경제후생지표가 어떻게 변하는지 비교하세요.</p>
      <svg width="100%" viewBox="0 0 320 80">
        <rect x={40} y={10} width={(koreaScore / 100) * 240} height={25} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <text x={45} y={27} fontSize={10} fill="white" fontWeight={600}>한국: {koreaScore}점</text>
        <rect x={40} y={45} width={(swedenScore / 100) * 240} height={25} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={45} y={62} fontSize={10} fill="white" fontWeight={600}>스웨덴: {swedenScore}점</text>
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">GDP 비중: {gdpWeight}% (나머지: 건강+교육+환경)</label>
        <input type="range" min={10} max={90} step={5} value={gdpWeight} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>GDP만 보면 한국이 앞서지만, 삶의 질 지표를 포함하면 <strong>순위가 바뀝니다</strong>.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `비중을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}
