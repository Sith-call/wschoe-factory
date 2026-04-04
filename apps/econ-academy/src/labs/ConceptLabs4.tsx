import React, { useState } from 'react';

interface Props { onComplete: () => void; completed: boolean; }

function LabShell({ title, desc, children, completed, canComplete, onComplete, progress }: {
  title: string; desc: string; children: React.ReactNode; completed: boolean;
  canComplete: boolean; onComplete: () => void; progress: string;
}) {
  return (
    <div>
      <p className="text-base text-ink-secondary mb-4">{desc}</p>
      {children}
      {completed ? (
        <p className="text-sm text-success font-medium mt-4">실험 완료!</p>
      ) : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium mt-4 ${canComplete ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : progress}
        </button>
      )}
    </div>
  );
}

// ─── Money & Finance ───

export function MoneyLab({ onComplete, completed }: Props) {
  const [step, setStep] = useState(0);
  const functions = ['가치 저장', '교환 매개', '가치 척도'];
  return (
    <LabShell title="화폐의 3대 기능" desc="화폐의 세 가지 핵심 기능을 탐색하세요." completed={completed} canComplete={step >= 3} onComplete={onComplete} progress={`${step}/3 기능 탐색`}>
      <div className="space-y-3 mb-4">
        {functions.map((f, i) => (
          <button key={i} onClick={() => setStep(Math.max(step, i + 1))}
            className={`w-full text-left p-4 rounded-lg border ${i < step ? 'border-primary bg-primary-light' : 'border-border bg-surface-card'}`}>
            <p className="font-medium text-ink">{f}</p>
            {i < step && (
              <p className="text-sm text-ink-secondary mt-1">
                {i === 0 && '화폐는 미래에 사용할 수 있도록 가치를 보존합니다. 인플레이션은 이 기능을 약화시킵니다.'}
                {i === 1 && '물물교환의 "욕구의 이중일치" 문제를 해결합니다. 모든 거래에서 공통 매개체 역할.'}
                {i === 2 && '모든 상품의 가치를 하나의 단위(원, 달러)로 표현하여 비교를 쉽게 합니다.'}
              </p>
            )}
          </button>
        ))}
      </div>
    </LabShell>
  );
}

export function VelocityOfMoneyLab({ onComplete, completed }: Props) {
  const [velocity, setVelocity] = useState(4);
  const [money, setMoney] = useState(100);
  const [changes, setChanges] = useState(0);
  const nominalGDP = money * velocity;
  return (
    <LabShell title="통화유통속도" desc="MV = PY (화폐수량설). 통화량(M)과 유통속도(V)를 조절하여 명목GDP 변화를 관찰하세요." completed={completed} canComplete={changes >= 4} onComplete={onComplete} progress={`${changes}/4 조합 시도`}>
      <div className="bg-stone-50 rounded-lg p-4 mb-4 text-center">
        <p className="font-display text-3xl font-bold text-primary">{nominalGDP.toLocaleString()}</p>
        <p className="text-sm text-ink-secondary">명목 GDP (M × V)</p>
        <p className="text-xs text-ink-secondary mt-1">{money} × {velocity} = {nominalGDP}</p>
      </div>
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm"><span className="text-ink-secondary">통화량 (M)</span><span className="font-display font-semibold text-ink">{money}조</span></div>
          <input type="range" min={50} max={200} value={money} onChange={e => { setMoney(Number(e.target.value)); setChanges(c => c + 1); }} className="w-full accent-primary" />
        </div>
        <div>
          <div className="flex justify-between text-sm"><span className="text-ink-secondary">유통속도 (V)</span><span className="font-display font-semibold text-ink">{velocity}회</span></div>
          <input type="range" min={1} max={10} value={velocity} onChange={e => { setVelocity(Number(e.target.value)); setChanges(c => c + 1); }} className="w-full accent-secondary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink">
        {velocity > 6 ? <p>유통속도가 높으면 같은 통화량으로도 더 많은 경제활동이 가능합니다.</p>
        : velocity < 3 ? <p>유통속도가 낮으면 돈이 잘 돌지 않아 경제가 침체될 수 있습니다.</p>
        : <p>MV = PY에서 V가 일정하면, M 증가는 명목GDP(PY) 증가로 이어집니다.</p>}
      </div>
    </LabShell>
  );
}

export function BankRunLab({ onComplete, completed }: Props) {
  const [withdrawPct, setWithdrawPct] = useState(10);
  const [changes, setChanges] = useState(0);
  const reserves = 100;
  const deposits = 1000;
  const withdrawn = deposits * withdrawPct / 100;
  const remaining = reserves - withdrawn;
  const collapsed = remaining < 0;
  return (
    <LabShell title="뱅크런 시뮬레이션" desc="예금자들이 동시에 인출하면 어떻게 되는지 관찰하세요." completed={completed} canComplete={changes >= 3} onComplete={onComplete} progress={`${changes}/3 시나리오 탐색`}>
      <div className="bg-stone-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>총 예금: {deposits}억</span><span>지급준비금: {reserves}억 (10%)</span>
        </div>
        <div className="h-8 rounded-lg overflow-hidden flex mb-2">
          <div style={{ width: `${Math.min(100, (reserves - Math.max(0, withdrawn)) / deposits * 100)}%` }} className="bg-primary transition-all" />
          <div style={{ width: `${Math.min(100, withdrawn / deposits * 100)}%` }} className={`${collapsed ? 'bg-error' : 'bg-secondary'} transition-all`} />
          <div className="flex-1 bg-stone-200" />
        </div>
        <p className={`text-sm font-semibold ${collapsed ? 'text-error' : 'text-ink'}`}>
          {collapsed ? `은행 파산! ${Math.abs(Math.round(remaining))}억 원 부족` : `잔여 준비금: ${Math.round(remaining)}억 원`}
        </p>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm"><span className="text-ink-secondary">인출 비율</span><span className="font-display font-semibold">{withdrawPct}%</span></div>
        <input type="range" min={0} max={30} value={withdrawPct} onChange={e => { setWithdrawPct(Number(e.target.value)); setChanges(c => c + 1); }} className="w-full accent-error" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink">
        {collapsed ? <p>지급준비율(10%)보다 많은 인출이 발생하면 은행은 지급 불능 상태가 됩니다. 이것이 <strong>뱅크런</strong>입니다.</p>
        : <p>은행은 예금의 일부(지급준비금)만 보유합니다. 평소에는 문제없지만, 대규모 동시 인출 시 위험합니다.</p>}
      </div>
    </LabShell>
  );
}

// ─── Macro Fluctuation ───

export function BusinessCycleLab({ onComplete, completed }: Props) {
  const [phase, setPhase] = useState(0);
  const phases = [
    { name: '회복기', desc: '경기가 바닥을 찍고 상승하기 시작합니다. 투자와 고용이 늘어납니다.', color: '#0D9488' },
    { name: '확장기', desc: '경제 활동이 활발해지고 GDP가 빠르게 성장합니다.', color: '#16A34A' },
    { name: '후퇴기', desc: '성장세가 둔화되고 물가 상승 압력이 나타납니다.', color: '#D97706' },
    { name: '수축기', desc: 'GDP가 감소하고 실업률이 높아집니다. 경기 침체입니다.', color: '#DC2626' },
  ];
  return (
    <LabShell title="경기순환 4단계" desc="경기의 4단계를 순서대로 탐색하세요." completed={completed} canComplete={phase >= 4} onComplete={onComplete} progress={`${phase}/4 단계 탐색`}>
      <div className="bg-stone-50 rounded-lg p-4 mb-4">
        <svg width="100%" viewBox="0 0 300 120">
          <path d="M 20 80 Q 75 20, 150 60 Q 225 100, 280 40" fill="none" stroke="#D6D3D1" strokeWidth={2} />
          {phases.map((p, i) => {
            const positions = [{ x: 45, y: 55 }, { x: 110, y: 25 }, { x: 185, y: 75 }, { x: 250, y: 45 }];
            return (
              <g key={i}>
                <circle cx={positions[i].x} cy={positions[i].y} r={i < phase ? 10 : 6} fill={i < phase ? p.color : '#E7E5E4'} style={{ cursor: 'pointer' }} onClick={() => setPhase(Math.max(phase, i + 1))} />
                <text x={positions[i].x} y={positions[i].y + 22} fontSize={9} fill={i < phase ? p.color : '#A8A29E'} textAnchor="middle" fontWeight={600}>{p.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
      {phase > 0 && (
        <div className="border-l-2 pl-3 text-sm text-ink mb-4" style={{ borderColor: phases[phase - 1].color }}>
          <p className="font-semibold mb-1" style={{ color: phases[phase - 1].color }}>{phases[phase - 1].name}</p>
          <p>{phases[phase - 1].desc}</p>
        </div>
      )}
    </LabShell>
  );
}

export function StagflationLab({ onComplete, completed }: Props) {
  const [inflation, setInflation] = useState(2);
  const [unemployment, setUnemployment] = useState(4);
  const [changes, setChanges] = useState(0);
  const isStagflation = inflation > 5 && unemployment > 6;
  return (
    <LabShell title="스태그플레이션 탐색" desc="인플레이션과 실업률을 동시에 조절하여 스태그플레이션 구간을 찾아보세요." completed={completed} canComplete={changes >= 4} onComplete={onComplete} progress={`${changes}/4 조합 시도`}>
      <div className={`rounded-lg p-4 mb-4 text-center ${isStagflation ? 'bg-red-50' : 'bg-stone-50'}`}>
        <p className={`font-display text-lg font-bold ${isStagflation ? 'text-error' : 'text-ink'}`}>
          {isStagflation ? '스태그플레이션 발생!' : '정상 경제 상태'}
        </p>
        <p className="text-sm text-ink-secondary mt-1">인플레이션 {inflation}% + 실업률 {unemployment}%</p>
      </div>
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm"><span>인플레이션</span><span className="font-display font-semibold">{inflation}%</span></div>
          <input type="range" min={0} max={15} value={inflation} onChange={e => { setInflation(Number(e.target.value)); setChanges(c => c + 1); }} className="w-full accent-error" />
        </div>
        <div>
          <div className="flex justify-between text-sm"><span>실업률</span><span className="font-display font-semibold">{unemployment}%</span></div>
          <input type="range" min={2} max={15} value={unemployment} onChange={e => { setUnemployment(Number(e.target.value)); setChanges(c => c + 1); }} className="w-full accent-secondary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink">
        {isStagflation ? <p><strong>스태그플레이션</strong>: 물가 상승과 경기 침체가 동시에 발생하는 최악의 상황. 1970년대 오일쇼크가 대표 사례.</p>
        : <p>일반적으로 인플레이션과 실업률은 반비례(필립스 곡선). 두 지표가 동시에 높아지면 스태그플레이션입니다.</p>}
      </div>
    </LabShell>
  );
}

// ─── Macro Policy ───

export function FiscalPolicyLab({ onComplete, completed }: Props) {
  const [govSpending, setGovSpending] = useState(50);
  const [taxRate, setTaxRate] = useState(20);
  const [changes, setChanges] = useState(0);
  const deficit = govSpending - taxRate;
  return (
    <LabShell title="재정정책 시뮬레이션" desc="정부지출과 세율을 조절하여 재정 상태를 관찰하세요." completed={completed} canComplete={changes >= 4} onComplete={onComplete} progress={`${changes}/4 조합 시도`}>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-border rounded-lg p-3 text-center">
          <p className="text-xs text-ink-secondary">정부지출</p><p className="font-display text-lg font-bold text-primary">{govSpending}조</p>
        </div>
        <div className="border border-border rounded-lg p-3 text-center">
          <p className="text-xs text-ink-secondary">세수</p><p className="font-display text-lg font-bold text-secondary">{taxRate}조</p>
        </div>
        <div className={`border rounded-lg p-3 text-center ${deficit > 0 ? 'border-error bg-red-50' : 'border-success bg-green-50'}`}>
          <p className="text-xs text-ink-secondary">{deficit > 0 ? '재정적자' : '재정흑자'}</p>
          <p className={`font-display text-lg font-bold ${deficit > 0 ? 'text-error' : 'text-success'}`}>{Math.abs(deficit)}조</p>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm"><span>정부지출</span><span className="font-display font-semibold">{govSpending}조</span></div>
          <input type="range" min={20} max={80} value={govSpending} onChange={e => { setGovSpending(Number(e.target.value)); setChanges(c => c + 1); }} className="w-full accent-primary" />
        </div>
        <div>
          <div className="flex justify-between text-sm"><span>세수</span><span className="font-display font-semibold">{taxRate}조</span></div>
          <input type="range" min={10} max={60} value={taxRate} onChange={e => { setTaxRate(Number(e.target.value)); setChanges(c => c + 1); }} className="w-full accent-secondary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink">
        {deficit > 20 ? <p>대규모 재정적자. 경기 부양 효과가 있지만 국가 부채가 증가합니다.</p>
        : deficit < -10 ? <p>재정흑자. 정부가 긴축 재정을 운영하고 있습니다.</p>
        : <p><strong>확장 재정</strong>(지출↑ 세금↓)은 경기 부양, <strong>긴축 재정</strong>(지출↓ 세금↑)은 물가 안정에 사용됩니다.</p>}
      </div>
    </LabShell>
  );
}

export function TariffLab({ onComplete, completed }: Props) {
  const [tariffRate, setTariffRate] = useState(0);
  const [changes, setChanges] = useState(0);
  const domesticPrice = 100;
  const worldPrice = 60;
  const effectivePrice = worldPrice + worldPrice * tariffRate / 100;
  const domesticProduction = Math.min(100, 30 + tariffRate);
  const imports = Math.max(0, 80 - tariffRate * 2);
  return (
    <LabShell title="관세 효과 시뮬레이션" desc="관세율을 조절하여 국내 가격, 생산량, 수입량 변화를 관찰하세요." completed={completed} canComplete={changes >= 3} onComplete={onComplete} progress={`${changes}/3 관세율 시도`}>
      <div className="bg-stone-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-xs text-ink-secondary">국내 가격</p><p className="font-display text-lg font-bold text-ink">{Math.round(effectivePrice)}원</p></div>
          <div><p className="text-xs text-ink-secondary">국내 생산</p><p className="font-display text-lg font-bold text-primary">{domesticProduction}</p></div>
          <div><p className="text-xs text-ink-secondary">수입량</p><p className="font-display text-lg font-bold text-secondary">{imports}</p></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm"><span>관세율</span><span className="font-display font-semibold text-error">{tariffRate}%</span></div>
        <input type="range" min={0} max={100} value={tariffRate} onChange={e => { setTariffRate(Number(e.target.value)); setChanges(c => c + 1); }} className="w-full accent-error" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink">
        {tariffRate === 0 ? <p>자유무역 상태. 세계 가격({worldPrice}원)으로 수입됩니다.</p>
        : tariffRate > 60 ? <p>높은 관세로 수입이 거의 차단됩니다. 국내 생산자는 보호받지만 소비자는 비싼 가격을 지불합니다.</p>
        : <p>관세 {tariffRate}%로 수입품 가격이 {Math.round(effectivePrice)}원으로 상승. 국내 생산이 늘고 수입이 줄어듭니다.</p>}
      </div>
    </LabShell>
  );
}

export function PPPLab({ onComplete, completed }: Props) {
  const [bigmacKR, setBigmacKR] = useState(5000);
  const [bigmacUS, setBigmacUS] = useState(5);
  const [changes, setChanges] = useState(0);
  const marketRate = 1300;
  const pppRate = bigmacKR / bigmacUS;
  const overUnder = ((marketRate - pppRate) / pppRate * 100);
  return (
    <LabShell title="빅맥지수 계산기" desc="한국과 미국의 빅맥 가격을 입력하여 PPP 환율을 계산하세요." completed={completed} canComplete={changes >= 3} onComplete={onComplete} progress={`${changes}/3 가격 조합`}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-lg p-3">
          <p className="text-xs text-ink-secondary mb-1">한국 빅맥</p>
          <input type="number" value={bigmacKR} onChange={e => { setBigmacKR(Number(e.target.value) || 0); setChanges(c => c + 1); }}
            className="w-full font-display text-lg font-bold text-ink bg-transparent border-b border-border focus:outline-none" />
          <p className="text-xs text-ink-secondary">원</p>
        </div>
        <div className="border border-border rounded-lg p-3">
          <p className="text-xs text-ink-secondary mb-1">미국 빅맥</p>
          <input type="number" value={bigmacUS} onChange={e => { setBigmacUS(Number(e.target.value) || 1); setChanges(c => c + 1); }}
            className="w-full font-display text-lg font-bold text-ink bg-transparent border-b border-border focus:outline-none" />
          <p className="text-xs text-ink-secondary">달러</p>
        </div>
      </div>
      <div className="bg-stone-50 rounded-lg p-4 mb-4 space-y-2">
        <div className="flex justify-between"><span className="text-sm text-ink-secondary">PPP 환율</span><span className="font-display font-bold text-primary">{Math.round(pppRate)}원/달러</span></div>
        <div className="flex justify-between"><span className="text-sm text-ink-secondary">시장 환율</span><span className="font-display font-bold text-ink">{marketRate}원/달러</span></div>
        <div className="flex justify-between"><span className="text-sm text-ink-secondary">원화 평가</span>
          <span className={`font-display font-bold ${overUnder > 0 ? 'text-error' : 'text-success'}`}>{overUnder > 0 ? `${Math.round(overUnder)}% 저평가` : `${Math.round(-overUnder)}% 고평가`}</span>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink">
        <p>PPP 환율({Math.round(pppRate)})이 시장 환율({marketRate})보다 {pppRate < marketRate ? '낮으면 원화가 저평가' : '높으면 원화가 고평가'}된 것입니다.</p>
      </div>
    </LabShell>
  );
}
