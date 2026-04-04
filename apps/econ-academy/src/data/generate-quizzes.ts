import { Term, Quiz, QuizQuestion } from '../types';

export function generateQuizzes(terms: Term[]): Quiz[] {
  return terms.map((term, idx) => ({
    termId: term.id,
    questions: [
      makeDefinitionQ(term, terms, idx),
      makeComparisonQ(term, terms, idx),
      makeScenarioQ(term, terms, idx),
    ],
  }));
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const r = [...arr];
  const rand = seededRandom(seed);
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// ─── Q1: 정의 문제 (함정 선지 포함) ───

function makeDefinitionQ(term: Term, all: Term[], seed: number): QuizQuestion {
  // 함정 선지: 같은 카테고리가 아닌 비슷해 보이는 정의 + 흔한 오해
  const misconceptions = getMisconception(term);

  // 다른 카테고리에서도 가져와서 난이도 높임
  const otherDefs = seededShuffle(
    all.filter(t => t.id !== term.id),
    seed * 31
  ).slice(0, 2).map(t => t.definition);

  const distractors = [misconceptions, ...otherDefs].slice(0, 3);
  const opts = seededShuffle([term.definition, ...distractors], seed * 37);
  const correctIdx = opts.indexOf(term.definition);

  return {
    type: 'definition',
    question: `다음 중 "${term.korean}"의 정의로 가장 적절한 것은?`,
    options: opts,
    correctIndex: correctIdx,
    explanation: `${term.korean}(${term.english})은(는) ${term.definition} ${term.keyPoints[0]}`,
  };
}

// ─── Q2: 개념 비교/관계 문제 ───

function makeComparisonQ(term: Term, all: Term[], seed: number): QuizQuestion {
  // 관련 용어(선행/후행)와 비교하는 문제
  const relatedTerms = all.filter(t =>
    term.prerequisites.includes(t.id) || t.prerequisites.includes(term.id)
  );
  const relatedName = relatedTerms.length > 0
    ? relatedTerms[seed % relatedTerms.length].korean
    : all.filter(t => t.category === term.category && t.id !== term.id)[0]?.korean || '다른 개념';

  const correct = term.keyPoints[0];

  // 오답: 다른 용어의 keyPoints를 가져와서 혼동 유발
  const wrongSources = seededShuffle(
    all.filter(t => t.category === term.category && t.id !== term.id),
    seed * 41
  ).slice(0, 2);

  const wrongs = [
    wrongSources[0]?.keyPoints[0] || `${term.korean}은(는) ${relatedName}과 동일한 개념이다`,
    wrongSources[1]?.keyPoints[1] || `${term.korean}은(는) 거시경제학에서만 사용되는 개념이다`,
    getCommonMisunderstanding(term),
  ];

  const opts = seededShuffle([correct, ...wrongs.slice(0, 3)], seed * 43);
  const correctIdx = opts.indexOf(correct);

  return {
    type: 'relationship',
    question: `${term.korean}과(와) ${relatedName}의 관계를 고려할 때, ${term.korean}에 대한 설명으로 올바른 것은?`,
    options: opts,
    correctIndex: correctIdx,
    explanation: `${correct} ${term.keyPoints[1] || ''}`,
  };
}

// ─── Q3: 시나리오 적용 문제 ───

function makeScenarioQ(term: Term, all: Term[], seed: number): QuizQuestion {
  const scenario = term.newsConnection;

  // 정답: 해당 용어의 핵심 설명
  const correct = `${term.korean}(${term.english}) 개념으로 설명할 수 있다`;

  // 오답: 같은 카테고리의 다른 용어로 혼동 유발 (가장 큰 개선점)
  const sameCategory = seededShuffle(
    all.filter(t => t.category === term.category && t.id !== term.id),
    seed * 47
  ).slice(0, 2);

  const otherCategory = seededShuffle(
    all.filter(t => t.category !== term.category),
    seed * 53
  ).slice(0, 1);

  const wrongs = [
    ...sameCategory.map(t => `${t.korean}(${t.english}) 개념으로 설명할 수 있다`),
    ...otherCategory.map(t => `${t.korean}(${t.english}) 개념으로 설명할 수 있다`),
  ].slice(0, 3);

  const opts = seededShuffle([correct, ...wrongs], seed * 59);
  const correctIdx = opts.indexOf(correct);

  return {
    type: 'scenario',
    question: `다음 뉴스 상황에 가장 적합한 경제 개념은?\n\n"${scenario}"`,
    options: opts,
    correctIndex: correctIdx,
    explanation: `이 상황은 ${term.korean}(${term.english})의 사례입니다. ${term.keyPoints[0]}`,
  };
}

// ─── 용어별 흔한 오해 (함정 선지) ───

function getMisconception(term: Term): string {
  const misconceptions: Record<string, string> = {
    'scarcity': '시장에서 일시적으로 수요가 공급을 초과하여 물건을 구하기 힘든 품귀 상태를 말한다.',
    'opportunity-cost': '어떤 선택을 하기 위해 지불한 실제 금전적 비용의 총합을 말한다.',
    'tradeoff': '두 가지 목표를 동시에 완벽하게 달성할 수 있는 최적의 균형점을 말한다.',
    'sunk-cost': '미래에 발생할 것으로 예상되는 비용으로, 의사결정 시 반드시 고려해야 하는 비용이다.',
    'demand': '소비자가 원하는 모든 것의 총량으로, 구매 능력과 무관한 순수한 욕구를 말한다.',
    'supply': '기업이 보유한 재고의 총량으로, 가격과 무관하게 일정한 수량을 말한다.',
    'equilibrium': '정부가 인위적으로 설정한 적정 가격 수준을 말한다.',
    'price': '생산자가 원하는 이윤을 얻기 위해 일방적으로 결정하는 금액을 말한다.',
    'demand-elasticity': '수요량의 절대적 변화량을 측정하는 지표로, 가격과 무관하다.',
    'consumer-surplus': '소비자가 상품을 구매하고 은행에 남은 가처분소득의 크기를 말한다.',
    'monopoly': '시장에서 가장 큰 기업이 경쟁자보다 낮은 가격을 제시하는 상태를 말한다.',
    'externality': '기업이 의도적으로 외부에 미치는 마케팅 효과를 말한다.',
    'gdp': '한 나라 국민이 국내외에서 생산한 모든 재화와 서비스의 시장가치 총합이다.',
    'inflation': '특정 상품의 가격이 일시적으로 상승하는 현상을 말한다.',
    'base-rate': '시중 은행이 고객에게 적용하는 대출 금리의 평균을 말한다.',
    'exchange-rate': '한 나라의 경제력을 숫자로 나타낸 국가 신용 등급이다.',
    'fiscal-policy': '중앙은행이 기준금리를 조절하여 경제를 안정시키는 정책이다.',
    'monetary-policy': '정부가 세금과 지출을 조절하여 경제를 안정시키는 정책이다.',
    'comparative-advantage': '모든 재화를 상대국보다 적은 비용으로 생산할 수 있는 능력이다.',
    'market-failure': '기업이 경영 실패로 도산하는 현상을 말한다.',
  };

  return misconceptions[term.id] ||
    `${term.korean}은(는) ${invertKeyword(term.definition)}`;
}

function getCommonMisunderstanding(term: Term): string {
  const misunderstandings: Record<string, string> = {
    'scarcity': '부유한 사회에서는 희소성 문제가 완전히 해결된다',
    'opportunity-cost': '매몰비용도 기회비용에 포함하여 계산해야 한다',
    'marginal-change': '한계 분석은 총량 분석보다 덜 중요한 보조적 도구다',
    'incentive': '인간은 이기적이지 않으므로 금전적 유인에 반응하지 않는다',
    'demand': '가격이 변하면 수요곡선 자체가 이동한다',
    'supply': '원자재 가격이 변하면 공급곡선 위에서 점이 이동한다',
    'equilibrium': '초과공급이 발생하면 가격이 상승한다',
    'consumer-surplus': '시장가격이 상승하면 소비자잉여도 증가한다',
    'monopoly': '독점기업은 한계비용보다 낮은 가격을 책정한다',
    'gdp': 'GDP가 높으면 모든 국민의 생활 수준이 높다고 볼 수 있다',
    'inflation': '인플레이션은 항상 경제에 해롭다',
    'exchange-rate': '환율 상승(원화 약세)은 항상 한국 경제에 불리하다',
  };

  return misunderstandings[term.id] ||
    `${term.korean}은(는) 현대 경제에서는 더 이상 적용되지 않는 고전적 개념이다`;
}

function invertKeyword(s: string): string {
  const replacements: [string, string][] = [
    ['무한', '유한'], ['유한', '무한'],
    ['증가', '감소'], ['감소', '증가'],
    ['상승', '하락'], ['하락', '상승'],
    ['확대', '축소'], ['축소', '확대'],
    ['높', '낮'], ['낮', '높'],
    ['크', '작'], ['작', '크'],
    ['많', '적'], ['적', '많'],
  ];

  for (const [from, to] of replacements) {
    if (s.includes(from)) return s.replace(from, to);
  }
  return s.replace(/이다\.$|를 말한다\.$/, '와는 반대되는 개념이다.');
}
