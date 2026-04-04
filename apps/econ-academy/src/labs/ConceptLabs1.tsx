import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

// ── scarcity ──
export function ScarcityLab({ onComplete, completed }: Props) {
  const [water, setWater] = useState(50);
  const [food, setFood] = useState(50);
  const [changes, setChanges] = useState(0);
  const total = 100;
  const remaining = total - water - food;

  function handleWater(v: number) {
    const clamped = Math.min(v, total - food);
    setWater(clamped);
    setChanges(p => p + 1);
  }
  function handleFood(v: number) {
    const clamped = Math.min(v, total - water);
    setFood(clamped);
    setChanges(p => p + 1);
  }

  const canComplete = changes >= 6;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">
        자원 100단위를 물, 식량, 여가에 배분하세요. 자원은 유한합니다.
      </p>
      <svg width="100%" viewBox="0 0 320 160">
        {/* Three bars */}
        {[
          { label: '물', val: water, color: '#2563EB' },
          { label: '식량', val: food, color: '#16A34A' },
          { label: '여가', val: remaining, color: '#D97706' },
        ].map((b, i) => {
          const x = 40 + i * 90, h = (b.val / 100) * 110;
          return (
            <React.Fragment key={i}>
              <rect x={x} y={130 - h} width={60} height={h} rx={4} fill={b.color} fillOpacity={0.7} />
              <text x={x + 30} y={145} fontSize={11} fill="#78716C" textAnchor="middle">{b.label}</text>
              <text x={x + 30} y={125 - h} fontSize={11} fill={b.color} textAnchor="middle" fontWeight={600}>{b.val}</text>
            </React.Fragment>
          );
        })}
      </svg>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">물: {water}</label>
          <input type="range" min={0} max={100} value={water} onChange={e => handleWater(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">식량: {food}</label>
          <input type="range" min={0} max={100} value={food} onChange={e => handleFood(Number(e.target.value))} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {remaining <= 0 ? (
          <p>여가에 남은 자원이 <strong>0</strong>입니다. 자원의 희소성 때문에 모든 것을 충족할 수 없습니다.</p>
        ) : (
          <p>자원을 다양하게 배분해 보세요. 한쪽을 늘리면 다른 쪽이 줄어드는 것이 <strong>희소성</strong>입니다.</p>
        )}
      </div>
      {completed ? (
        <p className="text-sm text-success font-medium">실험 완료!</p>
      ) : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `자원을 다양하게 배분하세요 (${Math.min(changes, 6)}/6)`}
        </button>
      )}
    </div>
  );
}

// ── tradeoff ──
export function TradeoffLab({ onComplete, completed }: Props) {
  const [work, setWork] = useState(8);
  const [changes, setChanges] = useState(0);
  const leisure = 16 - work;
  const income = work * 15000;
  const happiness = Math.round(leisure * 6 + Math.min(income / 10000, 10) * 4);

  function handle(v: number) { setWork(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">하루 16시간(수면 제외)을 노동과 여가에 배분하세요.</p>
      <svg width="100%" viewBox="0 0 320 120">
        <rect x={30} y={20} width={(work / 16) * 260} height={35} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <rect x={30 + (work / 16) * 260} y={20} width={(leisure / 16) * 260} height={35} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={30 + (work / 16) * 130} y={43} fontSize={11} fill="white" textAnchor="middle" fontWeight={600}>노동 {work}h</text>
        <text x={30 + (work / 16) * 260 + (leisure / 16) * 130} y={43} fontSize={11} fill="white" textAnchor="middle" fontWeight={600}>여가 {leisure}h</text>
        <text x={160} y={85} fontSize={12} fill="#78716C" textAnchor="middle">소득: {income.toLocaleString()}원 | 행복지수: {happiness}</text>
      </svg>
      <input type="range" min={0} max={16} step={1} value={work} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-4" />
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {work > 12 ? <p>소득은 높지만 여가가 거의 없어 <strong>행복지수가 낮습니다</strong>. 이것이 상충관계입니다.</p>
         : work < 4 ? <p>여가는 풍부하지만 <strong>소득이 부족합니다</strong>. 둘 다 가질 수는 없습니다.</p>
         : <p>소득과 여가 사이의 <strong>상충관계</strong>를 탐색하세요.</p>}
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

// ── rational-decision ──
export function RationalDecisionLab({ onComplete, completed }: Props) {
  const scenarios = [
    { q: '커피 4,500원 vs 라떼 5,500원. 우유맛 가치가 1,500원이면?', a: 'latte', explain: '추가 편익(1,500원) > 추가 비용(1,000원)이므로 라떼가 합리적' },
    { q: '야근 수당 3만원, 포기하는 헬스장 가치 2만원이면?', a: 'work', explain: '편익(3만원) > 기회비용(2만원)이므로 야근이 합리적' },
    { q: '영화표 1만원 이미 구매. 감기 걸림. 집에서 쉬는 가치 2만원이면?', a: 'rest', explain: '영화표는 매몰비용. 쉬는 편익(2만원) > 영화 편익이면 쉬는 것이 합리적' },
  ];
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const cur = scenarios[idx];

  function choose(choice: string) {
    setAnswers([...answers, choice]);
    setShowResult(true);
  }
  function next() {
    setShowResult(false);
    if (idx < scenarios.length - 1) setIdx(idx + 1);
  }

  const allDone = answers.length >= scenarios.length;
  const canComplete = allDone;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">각 상황에서 합리적인 판단을 선택하세요.</p>
      {!allDone ? (
        <div className="border border-border rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-ink mb-3">Q{idx + 1}. {cur.q}</p>
          {!showResult ? (
            <div className="flex gap-2">
              {idx === 0 ? (<><button onClick={() => choose('coffee')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">커피</button><button onClick={() => choose('latte')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">라떼</button></>) :
               idx === 1 ? (<><button onClick={() => choose('work')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">야근</button><button onClick={() => choose('skip')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">헬스장</button></>) :
               (<><button onClick={() => choose('movie')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">영화 보기</button><button onClick={() => choose('rest')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">집에서 쉬기</button></>)}
            </div>
          ) : (
            <div>
              <p className={`text-sm mb-2 ${answers[idx] === cur.a ? 'text-success' : 'text-warning'}`}>
                {answers[idx] === cur.a ? '정답!' : '다시 생각해보세요'}
              </p>
              <p className="text-xs text-ink-secondary mb-2">{cur.explain}</p>
              {idx < scenarios.length - 1 && <button onClick={next} className="text-sm text-primary font-medium">다음 문제</button>}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-ink mb-4">모든 시나리오를 완료했습니다! 편익과 비용을 비교하는 것이 합리적 판단입니다.</p>
      )}
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `${answers.length}/${scenarios.length} 시나리오 완료`}
        </button>
      )}
    </div>
  );
}

// ── marginal-change ──
export function MarginalChangeLab({ onComplete, completed }: Props) {
  const [qty, setQty] = useState(1);
  const [explored, setExplored] = useState(new Set<number>());

  const mb = (q: number) => Math.max(0, 100 - (q - 1) * 15); // diminishing MB
  const mc = (q: number) => 20 + (q - 1) * 12; // increasing MC
  const optimal = 5; // where MB ≈ MC

  function handle(v: number) {
    setQty(v);
    setExplored(prev => new Set(prev).add(v));
  }

  const W = 300, H = 180, PAD = 35;
  const canComplete = explored.size >= 6;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">생산량을 조절하며 한계편익(MB)과 한계비용(MC)이 만나는 최적점을 찾으세요.</p>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {Array.from({ length: 8 }, (_, i) => {
          const q = i + 1;
          const x = PAD + (q / 9) * (W - PAD * 2);
          const mbH = (mb(q) / 120) * (H - PAD * 2);
          const mcH = (mc(q) / 120) * (H - PAD * 2);
          return (
            <React.Fragment key={q}>
              <rect x={x - 10} y={H - PAD - mbH} width={8} height={mbH} rx={2} fill="#16A34A" fillOpacity={q === qty ? 1 : 0.3} />
              <rect x={x + 2} y={H - PAD - mcH} width={8} height={mcH} rx={2} fill="#DC2626" fillOpacity={q === qty ? 1 : 0.3} />
            </React.Fragment>
          );
        })}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#A8A29E" strokeWidth={1} />
        <text x={W / 2} y={H - 5} fontSize={10} fill="#78716C" textAnchor="middle">생산량</text>
        <text x={PAD - 5} y={15} fontSize={9} fill="#16A34A">MB</text>
        <text x={PAD + 15} y={15} fontSize={9} fill="#DC2626">MC</text>
      </svg>
      <input type="range" min={1} max={8} step={1} value={qty} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary mb-3" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">한계편익(MB)</p>
          <p className="font-display text-lg font-bold text-success">{mb(qty)}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">한계비용(MC)</p>
          <p className="font-display text-lg font-bold text-error">{mc(qty)}</p>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {mb(qty) > mc(qty) ? <p>MB &gt; MC: 한 단위 더 생산하면 <strong>이익</strong>입니다.</p>
         : mb(qty) < mc(qty) ? <p>MB &lt; MC: 생산량을 <strong>줄이는</strong> 것이 합리적입니다.</p>
         : <p>MB = MC: <strong>최적 생산량</strong>을 찾았습니다!</p>}
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

// ── incentive ──
export function IncentiveLab({ onComplete, completed }: Props) {
  const [subsidy, setSubsidy] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [changes, setChanges] = useState(0);

  const baseUsage = 100;
  const usage = Math.max(10, baseUsage - subsidy * 3 - penalty * 2);
  const evAdoption = Math.min(90, subsidy * 4 + 5);

  function handleS(v: number) { setSubsidy(v); setChanges(p => p + 1); }
  function handleP(v: number) { setPenalty(v); setChanges(p => p + 1); }

  const canComplete = changes >= 6;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">보조금(긍정 유인)과 과태료(부정 유인)를 조절해 자동차 사용량을 줄여보세요.</p>
      <svg width="100%" viewBox="0 0 320 130">
        <rect x={30} y={20} width={(usage / 100) * 260} height={30} rx={4} fill="#DC2626" fillOpacity={0.7} />
        <text x={30 + (usage / 100) * 130} y={40} fontSize={11} fill="white" textAnchor="middle" fontWeight={600}>자동차 사용 {usage}%</text>
        <rect x={30} y={65} width={(evAdoption / 100) * 260} height={30} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={30 + (evAdoption / 100) * 130} y={85} fontSize={11} fill="white" textAnchor="middle" fontWeight={600}>전기차 전환 {evAdoption}%</text>
      </svg>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-ink-secondary">전기차 보조금: {subsidy}만원</label>
          <input type="range" min={0} max={20} step={1} value={subsidy} onChange={e => handleS(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary">혼잡통행료: {penalty}만원</label>
          <input type="range" min={0} max={20} step={1} value={penalty} onChange={e => handleP(Number(e.target.value))} className="w-full accent-primary" />
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>긍정적 유인(보조금)과 부정적 유인(과태료)이 행동을 바꿉니다. <strong>유인이 변하면 행동이 변합니다.</strong></p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `유인을 다양하게 조절하세요 (${Math.min(changes, 6)}/6)`}
        </button>
      )}
    </div>
  );
}

// ── sunk-cost ──
export function SunkCostLab({ onComplete, completed }: Props) {
  const scenarios = [
    { q: '3만원 뮤지컬 티켓 구매 후 감기. 집에서 쉬면 가치 5만원. 억지로 갈까?', correct: 'rest', explain: '3만원은 매몰비용. 쉬는 가치(5만원)가 더 크므로 쉬는 것이 합리적.' },
    { q: '2년간 1000만원 투자한 사업이 전망 없음. 추가 500만원 넣을까?', correct: 'stop', explain: '1000만원은 매몰비용. 추가 투자의 기대수익이 500만원 이하면 중단.' },
    { q: '재미없는 영화 30분 봄. 나가면 남은 시간 유용하게 쓸 수 있음. 끝까지 볼까?', correct: 'leave', explain: '이미 본 30분은 매몰비용. 남은 시간의 가치를 비교해야 합니다.' },
  ];
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answer, setAnswer] = useState('');

  function choose(a: string) {
    setAnswer(a);
    if (a === scenarios[idx].correct) setCorrect(c => c + 1);
    setShowResult(true);
  }
  function next() {
    setShowResult(false);
    setAnswer('');
    if (idx < scenarios.length - 1) setIdx(idx + 1);
  }

  const allDone = idx === scenarios.length - 1 && showResult;
  const canComplete = allDone;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">매몰비용 함정에 빠지지 마세요!</p>
      <div className="border border-border rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold text-ink mb-3">{idx + 1}/{scenarios.length}. {scenarios[idx].q}</p>
        {!showResult ? (
          <div className="flex gap-2">
            {idx === 0 ? (<><button onClick={() => choose('go')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">억지로 가기</button><button onClick={() => choose('rest')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">집에서 쉬기</button></>) :
             idx === 1 ? (<><button onClick={() => choose('invest')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">추가 투자</button><button onClick={() => choose('stop')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">중단</button></>) :
             (<><button onClick={() => choose('stay')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">끝까지 보기</button><button onClick={() => choose('leave')} className="flex-1 py-2 rounded-md bg-stone-100 text-sm">나가기</button></>)}
          </div>
        ) : (
          <div>
            <p className={`text-sm mb-2 ${answer === scenarios[idx].correct ? 'text-success font-semibold' : 'text-warning font-semibold'}`}>
              {answer === scenarios[idx].correct ? '정답! 매몰비용을 무시했습니다.' : '매몰비용 함정에 빠졌습니다!'}
            </p>
            <p className="text-xs text-ink-secondary mb-2">{scenarios[idx].explain}</p>
            {idx < scenarios.length - 1 && <button onClick={next} className="text-sm text-primary font-medium">다음 문제</button>}
          </div>
        )}
      </div>
      {allDone && <p className="text-sm text-ink mb-4">{correct}/{scenarios.length} 정답. 매몰비용은 의사결정에서 무시해야 합니다.</p>}
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `${idx + 1}/${scenarios.length} 시나리오 진행 중`}
        </button>
      )}
    </div>
  );
}

// ── microeconomics ──
export function MicroeconomicsLab({ onComplete, completed }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const micro = ['소비자 구매 결정', '기업 가격 전략', '시장 경쟁 구조', '수요·공급 분석'];
  const macro = ['GDP 성장률', '실업률 변화', '통화정책', '국가 물가 수준'];
  const all = [...micro.map(m => ({ text: m, type: 'micro' })), ...macro.map(m => ({ text: m, type: 'macro' }))].sort(() => Math.random() - 0.5);

  function toggle(text: string) {
    const next = new Set(selected);
    if (next.has(text)) next.delete(text); else next.add(text);
    setSelected(next);
  }

  const microCorrect = micro.filter(m => selected.has(m)).length;
  const macroWrong = macro.filter(m => selected.has(m)).length;
  const canComplete = microCorrect === 4 && macroWrong === 0;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">아래에서 <strong>미시경제학</strong>에 해당하는 항목만 선택하세요.</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {all.map(item => (
          <button key={item.text} onClick={() => toggle(item.text)}
            className={`p-3 rounded-lg text-sm text-left border transition-colors ${selected.has(item.text) ? 'border-primary bg-primary-light text-primary font-medium' : 'border-border bg-stone-50 text-ink'}`}>
            {item.text}
          </button>
        ))}
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>미시경제학은 <strong>개별 경제주체와 개별 시장</strong>을 분석합니다. 국가 전체를 다루면 거시경제학입니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `미시경제학 항목만 정확히 선택하세요`}
        </button>
      )}
    </div>
  );
}

// ── macroeconomics ──
export function MacroeconomicsLab({ onComplete, completed }: Props) {
  const [gdp, setGdp] = useState(3);
  const [inf, setInf] = useState(2);
  const [unemp, setUnemp] = useState(4);
  const [changes, setChanges] = useState(0);

  function handleChange() { setChanges(p => p + 1); }

  const health = gdp > inf && unemp < 5 ? 'good' : gdp < inf ? 'bad' : 'moderate';
  const canComplete = changes >= 8;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">거시경제 3대 지표를 조절하며 경제 건강도를 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 100">
        {[
          { label: 'GDP 성장률', val: gdp, max: 10, color: '#16A34A' },
          { label: '인플레이션', val: inf, max: 10, color: '#DC2626' },
          { label: '실업률', val: unemp, max: 15, color: '#D97706' },
        ].map((item, i) => {
          const y = 10 + i * 30;
          return (
            <React.Fragment key={i}>
              <text x={5} y={y + 14} fontSize={10} fill="#78716C">{item.label}</text>
              <rect x={100} y={y} width={(item.val / item.max) * 200} height={20} rx={3} fill={item.color} fillOpacity={0.7} />
              <text x={105 + (item.val / item.max) * 200} y={y + 14} fontSize={10} fill={item.color} fontWeight={600}>{item.val}%</text>
            </React.Fragment>
          );
        })}
      </svg>
      <div className="space-y-2 mb-4">
        <input type="range" min={-2} max={10} step={0.5} value={gdp} onChange={e => { setGdp(Number(e.target.value)); handleChange(); }} className="w-full accent-primary" />
        <input type="range" min={0} max={10} step={0.5} value={inf} onChange={e => { setInf(Number(e.target.value)); handleChange(); }} className="w-full accent-secondary" />
        <input type="range" min={0} max={15} step={0.5} value={unemp} onChange={e => { setUnemp(Number(e.target.value)); handleChange(); }} className="w-full accent-warning" />
      </div>
      <div className={`rounded-lg p-3 mb-4 ${health === 'good' ? 'bg-green-50' : health === 'bad' ? 'bg-red-50' : 'bg-amber-50'}`}>
        <p className={`text-sm font-semibold ${health === 'good' ? 'text-success' : health === 'bad' ? 'text-error' : 'text-warning'}`}>
          {health === 'good' ? '건강한 경제' : health === 'bad' ? '위험 신호' : '주의 필요'}
        </p>
        <p className="text-xs text-ink-secondary">거시경제학은 이 세 지표의 관계를 분석합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `지표를 다양하게 조절하세요 (${Math.min(changes, 8)}/8)`}
        </button>
      )}
    </div>
  );
}

// ── market ──
export function MarketLab({ onComplete, completed }: Props) {
  const [buyers, setBuyers] = useState(50);
  const [sellers, setSellers] = useState(50);
  const [changes, setChanges] = useState(0);

  const price = Math.round(100 * sellers / Math.max(buyers, 1));
  const volume = Math.min(buyers, sellers);

  function handleB(v: number) { setBuyers(v); setChanges(p => p + 1); }
  function handleS(v: number) { setSellers(v); setChanges(p => p + 1); }
  const canComplete = changes >= 6;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">구매자와 판매자 수를 조절하여 시장의 가격 형성을 관찰하세요.</p>
      <svg width="100%" viewBox="0 0 320 120">
        <rect x={30} y={20} width={Math.min(buyers, 100) * 1.3} height={35} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <text x={35} y={42} fontSize={11} fill="white" fontWeight={600}>구매자 {buyers}명</text>
        <rect x={30} y={65} width={Math.min(sellers, 100) * 1.3} height={35} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={35} y={87} fontSize={11} fill="white" fontWeight={600}>판매자 {sellers}명</text>
      </svg>
      <div className="space-y-2 mb-4">
        <input type="range" min={10} max={100} value={buyers} onChange={e => handleB(Number(e.target.value))} className="w-full accent-primary" />
        <input type="range" min={10} max={100} value={sellers} onChange={e => handleS(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">시장가격 지수</p>
          <p className="font-display text-lg font-bold text-ink">{price}</p>
        </div>
        <div className="border border-border rounded-md p-3 text-center">
          <p className="text-xs text-ink-secondary">거래량</p>
          <p className="font-display text-lg font-bold text-ink">{volume}</p>
        </div>
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {buyers > sellers * 1.5 ? <p>구매자가 많아 <strong>가격 상승</strong> 압력이 있습니다.</p>
         : sellers > buyers * 1.5 ? <p>판매자가 많아 <strong>가격 하락</strong> 압력이 있습니다.</p>
         : <p>구매자와 판매자가 균형을 이루면 <strong>안정적 시장</strong>이 형성됩니다.</p>}
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `시장 조건을 다양하게 바꿔보세요 (${Math.min(changes, 6)}/6)`}
        </button>
      )}
    </div>
  );
}

// ── price ──
export function PriceLab({ onComplete, completed }: Props) {
  const [priceLevel, setPriceLevel] = useState(100);
  const [changes, setChanges] = useState(0);

  const demand = Math.max(5, 150 - priceLevel);
  const supply = Math.max(5, priceLevel - 20);
  const signal = priceLevel > 100 ? '공급 확대 신호' : priceLevel < 80 ? '공급 축소 신호' : '균형 가격';

  function handle(v: number) { setPriceLevel(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">가격을 바꾸며 가격의 세 가지 기능(정보, 유인, 배분)을 관찰하세요.</p>
      <svg width="100%" viewBox="0 0 320 140">
        <rect x={40} y={30} width={(demand / 150) * 230} height={25} rx={4} fill="#2563EB" fillOpacity={0.7} />
        <text x={45} y={48} fontSize={10} fill="white" fontWeight={600}>수요 {demand}</text>
        <rect x={40} y={65} width={(supply / 150) * 230} height={25} rx={4} fill="#16A34A" fillOpacity={0.7} />
        <text x={45} y={83} fontSize={10} fill="white" fontWeight={600}>공급 {supply}</text>
        <text x={160} y={115} fontSize={12} fill="#78716C" textAnchor="middle">{signal}</text>
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">가격: {priceLevel}원</label>
        <input type="range" min={30} max={170} step={5} value={priceLevel} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>가격은 <strong>정보 전달</strong>(시장 상황), <strong>유인</strong>(생산 방향), <strong>배분</strong>(자원 분배)을 합니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `가격을 다양하게 바꿔보세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── complements ──
export function ComplementsLab({ onComplete, completed }: Props) {
  const [phonePrice, setPhonePrice] = useState(100);
  const [changes, setChanges] = useState(0);

  const phoneDemand = Math.max(5, 150 - phonePrice);
  const caseDemand = Math.round(phoneDemand * 0.8);
  const chargerDemand = Math.round(phoneDemand * 0.6);

  function handle(v: number) { setPhonePrice(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">스마트폰 가격을 바꾸면 보완재(케이스, 충전기) 수요가 어떻게 변하는지 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 130">
        {[
          { label: '스마트폰', val: phoneDemand, color: '#2563EB' },
          { label: '케이스', val: caseDemand, color: '#16A34A' },
          { label: '충전기', val: chargerDemand, color: '#D97706' },
        ].map((b, i) => (
          <React.Fragment key={i}>
            <rect x={40} y={10 + i * 38} width={(b.val / 150) * 230} height={28} rx={4} fill={b.color} fillOpacity={0.7} />
            <text x={45} y={29 + i * 38} fontSize={10} fill="white" fontWeight={600}>{b.label}: {b.val}</text>
          </React.Fragment>
        ))}
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">스마트폰 가격: {phonePrice}만원</label>
        <input type="range" min={30} max={200} step={5} value={phonePrice} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>스마트폰 가격이 오르면 보완재 수요도 <strong>함께 줄어듭니다</strong>. 이것이 보완재 관계입니다.</p>
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

// ── substitutes ──
export function SubstitutesLab({ onComplete, completed }: Props) {
  const [taxiPrice, setTaxiPrice] = useState(50);
  const [changes, setChanges] = useState(0);

  const taxiDemand = Math.max(5, 120 - taxiPrice);
  const busDemand = Math.round(30 + taxiPrice * 0.5);
  const bikeDemand = Math.round(20 + taxiPrice * 0.3);

  function handle(v: number) { setTaxiPrice(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">택시 요금이 오르면 대체재(버스, 자전거) 수요가 어떻게 변하는지 확인하세요.</p>
      <svg width="100%" viewBox="0 0 320 130">
        {[
          { label: '택시', val: taxiDemand, color: '#D97706' },
          { label: '버스', val: busDemand, color: '#2563EB' },
          { label: '자전거', val: bikeDemand, color: '#16A34A' },
        ].map((b, i) => (
          <React.Fragment key={i}>
            <rect x={40} y={10 + i * 38} width={(b.val / 120) * 230} height={28} rx={4} fill={b.color} fillOpacity={0.7} />
            <text x={45} y={29 + i * 38} fontSize={10} fill="white" fontWeight={600}>{b.label}: {b.val}</text>
          </React.Fragment>
        ))}
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">택시 요금 지수: {taxiPrice}</label>
        <input type="range" min={20} max={150} step={5} value={taxiPrice} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>택시 요금이 오르면 대체재 수요가 <strong>늘어납니다</strong>. 이것이 대체재 관계입니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `요금을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── normal-inferior-goods ──
export function NormalInferiorGoodsLab({ onComplete, completed }: Props) {
  const [income, setIncome] = useState(300);
  const [changes, setChanges] = useState(0);

  const dining = Math.round(income * 0.15);
  const ramen = Math.max(5, Math.round(80 - income * 0.1));
  const luxury = Math.round(Math.max(0, (income - 200) * 0.3));

  function handle(v: number) { setIncome(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">소득을 조절하며 정상재, 열등재, 사치재의 수요 변화를 관찰하세요.</p>
      <svg width="100%" viewBox="0 0 320 130">
        {[
          { label: '외식(정상재)', val: dining, color: '#16A34A' },
          { label: '라면(열등재)', val: ramen, color: '#D97706' },
          { label: '명품(사치재)', val: luxury, color: '#7C3AED' },
        ].map((b, i) => (
          <React.Fragment key={i}>
            <rect x={40} y={10 + i * 38} width={Math.min(b.val, 100) * 2.3} height={28} rx={4} fill={b.color} fillOpacity={0.7} />
            <text x={45} y={29 + i * 38} fontSize={10} fill="white" fontWeight={600}>{b.label}: {b.val}</text>
          </React.Fragment>
        ))}
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">월 소득: {income}만원</label>
        <input type="range" min={100} max={800} step={50} value={income} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>소득 증가 시: 정상재는 <strong>수요 증가</strong>, 열등재는 <strong>수요 감소</strong>, 사치재는 <strong>급증</strong></p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `소득을 다양하게 조절하세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}

// ── supply-elasticity ──
export function SupplyElasticityLab({ onComplete, completed }: Props) {
  const [priceChange, setPriceChange] = useState(10);
  const [changes, setChanges] = useState(0);

  const digitalSupply = Math.round(priceChange * 3);
  const clothingSupply = Math.round(priceChange * 1.5);
  const housingSupply = Math.round(priceChange * 0.3);

  function handle(v: number) { setPriceChange(v); setChanges(p => p + 1); }
  const canComplete = changes >= 5;

  return (
    <div>
      <p className="text-sm text-ink-secondary mb-4">가격이 변할 때 산업별 공급 반응 속도를 비교하세요.</p>
      <svg width="100%" viewBox="0 0 320 130">
        {[
          { label: '디지털콘텐츠(탄력적)', val: digitalSupply, color: '#16A34A' },
          { label: '의류(중간)', val: clothingSupply, color: '#2563EB' },
          { label: '부동산(비탄력적)', val: housingSupply, color: '#DC2626' },
        ].map((b, i) => (
          <React.Fragment key={i}>
            <rect x={40} y={10 + i * 38} width={Math.min(Math.abs(b.val), 100) * 2.3} height={28} rx={4} fill={b.color} fillOpacity={0.7} />
            <text x={45} y={29 + i * 38} fontSize={10} fill="white" fontWeight={600}>{b.label}: +{b.val}%</text>
          </React.Fragment>
        ))}
      </svg>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary">가격 변화: +{priceChange}%</label>
        <input type="range" min={5} max={50} step={5} value={priceChange} onChange={e => handle(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        <p>생산 기간이 짧을수록 공급이 <strong>탄력적</strong>이고, 길수록 <strong>비탄력적</strong>입니다.</p>
      </div>
      {completed ? <p className="text-sm text-success font-medium">실험 완료!</p> : (
        <button onClick={onComplete} disabled={!canComplete}
          className={`w-full rounded-lg px-5 py-3 font-medium text-sm transition-colors ${canComplete ? 'bg-primary text-white' : 'bg-stone-100 text-ink-disabled cursor-not-allowed'}`}>
          {canComplete ? '실험 완료' : `가격을 다양하게 변화시키세요 (${Math.min(changes, 5)}/5)`}
        </button>
      )}
    </div>
  );
}
