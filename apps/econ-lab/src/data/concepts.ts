import { Concept } from '../types';

export interface ScenarioPreset {
  id: string;
  title: string;
  description: string;
  icon: string;
  values: Record<string, number>;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface HypothesisQuestion {
  id: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  correctExplanation: string;
  sideEffect: string;
  presetValues: Record<string, number>;
}

export const conceptHypotheses: Record<string, HypothesisQuestion[]> = {
  'supply-demand': [
    {
      id: 'sd-hyp-1',
      scenario: '한국은행이 기준금리를 0.5%p 인상했습니다.',
      question: '어떤 변화가 생길까요?',
      options: ['물가 하락', '소비 증가', '수요 증가'],
      correctIndex: 0,
      correctExplanation: '금리 인상 → 대출 비용 증가 → 소비 위축 → 수요 감소 → 물가 하락',
      sideEffect: '하지만 예상 못한 부작용도 있어요: 경기 위축 가능성이 높아집니다.',
      presetValues: { income: 3, cost: 4, tax: 5 },
    },
    {
      id: 'sd-hyp-2',
      scenario: '국제 유가가 2배로 급등했습니다.',
      question: '시장에 어떤 일이 벌어질까요?',
      options: ['균형가격 하락', '균형가격 상승', '변화 없음'],
      correctIndex: 1,
      correctExplanation: '원자재 가격 급등 → 생산 비용 증가 → 공급 감소 → 균형가격 상승',
      sideEffect: '동시에 거래량도 줄어들어 경제 전체가 위축됩니다.',
      presetValues: { income: 5, cost: 8, tax: 5 },
    },
  ],
  'gdp': [
    {
      id: 'gdp-hyp-1',
      scenario: '팬데믹으로 사회적 거리두기가 시행됩니다.',
      question: 'GDP에 가장 큰 영향을 주는 변화는?',
      options: ['소비(C) 급감', '정부지출(G) 급감', '투자(I) 급증'],
      correctIndex: 0,
      correctExplanation: '봉쇄 → 소비 급감(GDP의 50%+). 정부는 오히려 G를 늘려 대응합니다.',
      sideEffect: '실제 2020년 한국 GDP 성장률은 -0.7%였습니다.',
      presetValues: { consumption: 38, investment: 15, government: 30, netExports: -5 },
    },
    {
      id: 'gdp-hyp-2',
      scenario: '반도체 슈퍼사이클이 시작되었습니다.',
      question: 'GDP 구성요소 중 가장 크게 변하는 것은?',
      options: ['순수출(NX) 급증', '소비(C) 급감', '정부지출(G) 급증'],
      correctIndex: 0,
      correctExplanation: '수출 호황 → NX 대폭 증가 + 투자 확대 → GDP 성장 가속',
      sideEffect: '하지만 특정 산업 편중은 경제 리스크를 높입니다.',
      presetValues: { consumption: 55, investment: 30, government: 20, netExports: 25 },
    },
  ],
  'inflation': [
    {
      id: 'inf-hyp-1',
      scenario: '중앙은행이 대규모 양적완화로 통화량을 2배로 늘렸습니다.',
      question: '물가는 어떻게 될까요?',
      options: ['물가 2배 상승', '물가 변화 없음', '물가 하락'],
      correctIndex: 0,
      correctExplanation: 'MV=PY에서 V,Y 불변 시 M 2배 → P도 2배. 화폐수량설의 핵심입니다.',
      sideEffect: '실제로는 유통속도(V) 감소로 즉각적 인플레이션은 완화되지만, 장기적으로 물가 상승 압력이 누적됩니다.',
      presetValues: { moneySupply: 100, velocity: 5 },
    },
  ],
  'elasticity': [
    {
      id: 'el-hyp-1',
      scenario: '생수 가격이 20% 올랐습니다.',
      question: '생수 수요량은 어떻게 될까요?',
      options: ['거의 변하지 않음', '20% 이상 감소', '수요가 오히려 증가'],
      correctIndex: 0,
      correctExplanation: '생수는 필수재(대체재 거의 없음) → 비탄력적 수요 → 가격이 올라도 수요 변화가 적습니다.',
      sideEffect: '이런 재화에 세금을 부과하면 세수는 늘지만, 저소득층 부담이 커집니다.',
      presetValues: { priceChangeRate: 20, substitutes: 1 },
    },
  ],
  'ppf': [
    {
      id: 'ppf-hyp-1',
      scenario: 'AI 기술이 모든 산업에 도입되었습니다.',
      question: '생산가능곡선(PPF)은 어떻게 변할까요?',
      options: ['바깥으로 이동', '안쪽으로 이동', '변화 없음'],
      correctIndex: 0,
      correctExplanation: '기술 혁신 → 같은 자원으로 더 많이 생산 가능 → PPF 바깥 이동',
      sideEffect: '이것이 경제 성장의 본질입니다. 기술이 인류를 더 풍요롭게 만드는 이유.',
      presetValues: { technology: 9, allocation: 50 },
    },
  ],
  'comparative-advantage': [
    {
      id: 'ca-hyp-1',
      scenario: '한국은 반도체, 베트남은 농산물 생산에 특화합니다.',
      question: '두 나라가 서로 교역하면?',
      options: ['양국 모두 이득', '한국만 이득', '베트남만 이득'],
      correctIndex: 0,
      correctExplanation: '비교우위에 따라 특화하고 교역하면 양국 모두 소비가능 영역이 확대됩니다.',
      sideEffect: '이것이 리카르도의 비교우위론이며, 자유무역의 경제학적 근거입니다.',
      presetValues: { productivityA: 8, productivityB: 3, tradeRatio: 50 },
    },
  ],
  'multiplier': [
    {
      id: 'mult-hyp-1',
      scenario: '정부가 50조원의 재정지출을 단행합니다. 국민의 소비성향(MPC)은 0.8입니다.',
      question: 'GDP는 얼마나 증가할까요?',
      options: ['50조원', '100조원', '250조원'],
      correctIndex: 2,
      correctExplanation: '승수 = 1/(1-0.8) = 5. 50조 x 5 = 250조원. 돈이 돌고 돌며 5배의 효과를 냅니다.',
      sideEffect: '이것이 케인스가 불황기 적극적 재정지출을 주장한 근거입니다.',
      presetValues: { mpc: 80, deltaG: 50 },
    },
  ],
  'is-lm': [
    {
      id: 'islm-hyp-1',
      scenario: '정부가 대규모 재정지출을 시행합니다.',
      question: '이자율과 국민소득은 어떻게 변할까요?',
      options: ['Y 증가 + r 상승', 'Y 증가 + r 하락', 'Y 감소 + r 상승'],
      correctIndex: 0,
      correctExplanation: '정부지출 증가 → IS 우측 이동 → 국민소득 증가 + 이자율 상승',
      sideEffect: '이자율 상승으로 민간 투자가 줄어드는 구축효과(crowding out)가 발생합니다.',
      presetValues: { govSpending: 80, moneySupply: 50 },
    },
  ],
};

export const conceptScenarios: Record<string, ScenarioPreset[]> = {
  'supply-demand': [
    {
      id: 'sd-rate-hike',
      title: '기준금리 0.5%p 인상',
      description: '한국은행이 기준금리를 올리면?',
      icon: 'account_balance',
      values: { income: 3, cost: 4, tax: 5 },
      explanation: '금리 인상 → 대출 비용 증가 → 소비 감소(소득 효과 축소) + 생산 비용 소폭 증가 → 수요곡선 좌측 이동, 균형가격 하락. 이것이 금리 인상의 물가 안정 효과입니다.',
    },
    {
      id: 'sd-oil-shock',
      title: '원자재 가격 급등',
      description: '국제 유가가 2배로 오르면?',
      icon: 'local_gas_station',
      values: { income: 5, cost: 8, tax: 5 },
      explanation: '원자재 가격 급등 → 생산 비용 대폭 증가 → 공급곡선 좌측 이동 → 균형가격 상승, 균형수량 감소. 이것이 비용인상 인플레이션(cost-push inflation)의 메커니즘입니다.',
    },
  ],
  'gdp': [
    {
      id: 'gdp-covid',
      title: '코로나 봉쇄로 소비 30% 감소',
      description: '팬데믹으로 소비가 급감하면?',
      icon: 'coronavirus',
      values: { consumption: 38, investment: 15, government: 30, netExports: -5 },
      explanation: '소비 급감(-30%) → GDP 하락. 정부는 재정지출 확대(G 증가)로 대응하지만, 투자 위축과 수입 초과(NX 마이너스)로 완전 상쇄 어려움. 실제 2020년 한국 GDP 성장률은 -0.7%였습니다.',
    },
    {
      id: 'gdp-export-boom',
      title: '반도체 수출 호황',
      description: 'K-반도체 수출이 급증하면?',
      icon: 'memory',
      values: { consumption: 55, investment: 30, government: 20, netExports: 25 },
      explanation: '수출 호황 → NX 대폭 증가 + 투자 확대 → GDP 성장. 실제 2021-22년 한국은 반도체 수출 호황으로 GDP 4% 성장을 달성했습니다.',
    },
  ],
  'inflation': [
    {
      id: 'inf-qe',
      title: '양적완화로 통화량 2배',
      description: '중앙은행이 대규모 양적완화를 하면?',
      icon: 'currency_exchange',
      values: { moneySupply: 100, velocity: 5 },
      explanation: '통화량 2배 증가 → MV=PY에서 V와 Y가 일정하면 P도 2배 → 극심한 인플레이션. 실제로는 유통속도(V)가 감소하여 즉각적 인플레이션은 완화되지만, 장기적으로 물가 상승 압력이 누적됩니다.',
    },
    {
      id: 'inf-deflation',
      title: '디플레이션 위기',
      description: '통화량을 급격히 줄이면?',
      icon: 'trending_down',
      values: { moneySupply: 20, velocity: 3 },
      explanation: '통화량 감소 + 유통속도 하락 → 물가 하락(디플레이션). 디플레이션은 소비 연기, 실질 부채 증가, 기업 투자 위축으로 경기 침체를 심화시킵니다. 일본의 "잃어버린 30년"의 핵심 원인입니다.',
    },
  ],
  'elasticity': [
    {
      id: 'el-essential',
      title: '필수재 (생수, 쌀)',
      description: '대체재가 거의 없는 필수재',
      icon: 'water_drop',
      values: { priceChangeRate: 20, substitutes: 1 },
      explanation: '필수재는 대체재가 적어 비탄력적 수요(|Ed|<1). 가격이 20% 올라도 수요 감소는 10% 미만. 이런 재화에 세금을 부과하면 세수 확보에 효과적이지만, 저소득층 부담이 커집니다.',
    },
    {
      id: 'el-luxury',
      title: '사치재 (명품, 해외여행)',
      description: '대체재가 많은 사치재',
      icon: 'diamond',
      values: { priceChangeRate: 20, substitutes: 8 },
      explanation: '사치재는 대체재가 많아 탄력적 수요(|Ed|>1). 가격이 20% 오르면 수요가 50% 이상 감소할 수 있음. 기업이 가격을 올리면 매출이 오히려 줄어드는 이유입니다.',
    },
  ],
  'ppf': [
    {
      id: 'ppf-tech-advance',
      title: '기술 혁신 (AI 도입)',
      description: '생산 기술이 크게 발전하면?',
      icon: 'smart_toy',
      values: { technology: 9, allocation: 50 },
      explanation: '기술 혁신 → PPF 곡선이 바깥으로 이동 → 같은 자원으로 더 많이 생산 가능. AI, 자동화 같은 기술 발전은 경제 성장의 핵심 동력입니다.',
    },
    {
      id: 'ppf-specialization',
      title: '재화A에 특화',
      description: '한 재화에 자원을 집중하면?',
      icon: 'precision_manufacturing',
      values: { technology: 5, allocation: 85 },
      explanation: '자원을 재화A에 집중 → A 생산량 증가, B 생산량 감소. 기회비용이 체증(PPF가 오목)하므로 극단적 특화는 비효율적. 이것이 다양한 산업 포트폴리오가 필요한 이유입니다.',
    },
  ],
  'comparative-advantage': [
    {
      id: 'ca-korea-vietnam',
      title: '한국-베트남 무역',
      description: '반도체 vs 농산물 교역',
      icon: 'public',
      values: { productivityA: 8, productivityB: 3, tradeRatio: 50 },
      explanation: '한국(A국)은 반도체(재화1)에 비교우위, 베트남(B국)은 농산물(재화2)에 비교우위. 각국이 비교우위 재화에 특화하고 교역하면 양국 모두 소비가능 영역이 확대됩니다.',
    },
    {
      id: 'ca-equal',
      title: '생산성 동일한 국가',
      description: '비교우위가 없으면?',
      icon: 'balance',
      values: { productivityA: 5, productivityB: 5, tradeRatio: 50 },
      explanation: '두 국가의 생산성이 동일하면 기회비용도 같아 비교우위가 없음 → 무역 이득이 최소화. 리카르도의 비교우위론은 "절대적 생산성이 아니라 기회비용의 차이"가 무역의 동기임을 보여줍니다.',
    },
  ],
  'multiplier': [
    {
      id: 'mult-fiscal',
      title: '대규모 재정지출',
      description: '정부가 50조원을 투입하면?',
      icon: 'account_balance',
      values: { mpc: 80, deltaG: 50 },
      explanation: 'MPC 0.8, 정부지출 50조 → 승수 5.0 → GDP 250조 증가. 1차 지출 50조 → 소비 40조 → 소비 32조... 연쇄적 소비가 GDP를 증폭시킵니다. 이것이 케인스가 불황기 재정지출을 주장한 근거입니다.',
    },
    {
      id: 'mult-saving',
      title: '저축 성향 높은 사회',
      description: 'MPC가 낮으면 승수 효과는?',
      icon: 'savings',
      values: { mpc: 40, deltaG: 10 },
      explanation: 'MPC 0.4(저축 성향 높음) → 승수 1.67 → 10조 투입해도 GDP 16.7조만 증가. 소비 대신 저축이 많으면 돈이 순환되지 않아 승수 효과가 축소됩니다. "절약의 역설(Paradox of Thrift)"의 원리입니다.',
    },
  ],
  'is-lm': [
    {
      id: 'islm-fiscal-expansion',
      title: '확장 재정정책',
      description: '정부지출을 크게 늘리면?',
      icon: 'account_balance',
      values: { govSpending: 80, moneySupply: 50 },
      explanation: '정부지출 증가 → IS곡선 우측 이동 → 균형 국민소득 증가 + 이자율 상승. 이자율 상승은 민간 투자를 감소시켜(구축효과/crowding out) 재정정책의 효과를 일부 상쇄합니다.',
    },
    {
      id: 'islm-monetary-expansion',
      title: '확장 통화정책',
      description: '통화공급을 크게 늘리면?',
      icon: 'currency_exchange',
      values: { govSpending: 50, moneySupply: 80 },
      explanation: '통화공급 증가 → LM곡선 우측 이동 → 이자율 하락 + 국민소득 증가. 이자율 하락은 투자를 촉진하여 경기를 부양합니다. 경기 침체 시 중앙은행이 금리를 내리는 이유입니다.',
    },
  ],
};

export const conceptQuizzes: Record<string, QuizQuestion[]> = {
  'supply-demand': [
    {
      id: 'sd-q1',
      question: '가격이 상승하면 수요량은 어떻게 변하나요?',
      options: ['증가한다', '감소한다', '변화없다', '알 수 없다'],
      correctIndex: 1,
      explanation: '수요의 법칙에 따라, 다른 조건이 일정할 때 가격이 상승하면 수요량은 감소합니다. 이것은 수요곡선이 우하향하는 이유입니다.',
    },
    {
      id: 'sd-q2',
      question: '소득이 증가하면 정상재의 수요곡선은?',
      options: ['좌측 이동', '우측 이동', '위로 이동', '변화없음'],
      correctIndex: 1,
      explanation: '소득이 증가하면 정상재(normal goods)의 수요가 전체적으로 증가하여 수요곡선이 우측으로 이동합니다. 반면 열등재(inferior goods)는 좌측으로 이동합니다.',
    },
    {
      id: 'sd-q3',
      question: '균형가격보다 높은 가격에서는 무엇이 발생하나요?',
      options: ['초과수요', '초과공급', '균형 유지', '시장 실패'],
      correctIndex: 1,
      explanation: '균형가격보다 높은 가격에서는 공급량이 수요량을 초과하는 초과공급이 발생합니다. 팔리지 않는 재고가 쌓이면서 가격 하락 압력이 생깁니다.',
    },
  ],
  'elasticity': [
    {
      id: 'el-q1',
      question: '|Ed| = 1.5일 때 이 재화의 수요는?',
      options: ['비탄력적', '단위탄력적', '탄력적', '완전비탄력적'],
      correctIndex: 2,
      explanation: '|Ed| > 1이면 탄력적 수요입니다. 가격이 1% 변할 때 수요량이 1.5% 변하므로, 가격 변화에 민감하게 반응합니다.',
    },
    {
      id: 'el-q2',
      question: '대체재가 많은 재화의 수요 탄력성은?',
      options: ['비탄력적', '탄력적', '완전비탄력적', '관계없음'],
      correctIndex: 1,
      explanation: '대체재가 많으면 가격이 오를 때 소비자가 다른 재화로 쉽게 전환할 수 있어 수요가 탄력적이 됩니다. 예: 콜라 가격이 오르면 사이다를 삽니다.',
    },
    {
      id: 'el-q3',
      question: '비탄력적 수요의 재화에서 가격을 올리면 총수입(TR)은?',
      options: ['증가', '감소', '변화없음', '알 수 없음'],
      correctIndex: 0,
      explanation: 'TR = P × Q. 비탄력적 수요에서는 가격 상승률 > 수량 감소율이므로 총수입이 증가합니다. 이것이 필수재(의약품, 식료품)에 높은 가격을 매길 수 있는 이유입니다.',
    },
  ],
  'gdp': [
    {
      id: 'gdp-q1',
      question: 'GDP = C + I + G + NX에서 가장 큰 비중을 차지하는 항목은?',
      options: ['투자 (I)', '소비 (C)', '정부지출 (G)', '순수출 (NX)'],
      correctIndex: 1,
      explanation: '대부분의 국가에서 민간소비(C)가 GDP의 50-70%를 차지합니다. 한국의 경우 약 50%, 미국은 약 68%입니다. 소비 심리가 경제에 미치는 영향이 큰 이유입니다.',
    },
    {
      id: 'gdp-q2',
      question: '수입이 수출보다 많으면 NX는?',
      options: ['양수', '음수', '0', '알 수 없음'],
      correctIndex: 1,
      explanation: 'NX(순수출) = 수출(X) - 수입(M). 수입 > 수출이면 무역적자로 NX는 음수가 됩니다. NX가 음수이면 GDP를 감소시키는 요인이 됩니다.',
    },
    {
      id: 'gdp-q3',
      question: '주부의 가사노동은 GDP에 포함되나요?',
      options: ['포함된다', '포함되지 않는다', '일부만 포함', '국가마다 다르다'],
      correctIndex: 1,
      explanation: 'GDP는 시장에서 거래되는 최종 재화와 서비스만 포함합니다. 가사노동, 자원봉사, 지하경제 등은 시장 거래가 아니므로 GDP에 포함되지 않습니다. 이것이 GDP의 한계 중 하나입니다.',
    },
  ],
  'inflation': [
    {
      id: 'inf-q1',
      question: '피셔 방정식 MV = PY에서 M이 2배가 되면 P는?',
      options: ['변화없음', '2배', '1/2배', '4배'],
      correctIndex: 1,
      explanation: 'V(유통속도)와 Y(실질GDP)가 일정하다고 가정하면, M이 2배 → P도 2배가 됩니다. 이것이 화폐수량설의 핵심: "인플레이션은 언제 어디서나 화폐적 현상이다" (밀턴 프리드먼).',
    },
    {
      id: 'inf-q2',
      question: '인플레이션이 발생하면 채무자에게는?',
      options: ['불리하다', '유리하다', '영향없다', '상황에 따라 다르다'],
      correctIndex: 1,
      explanation: '인플레이션은 화폐의 실질 가치를 떨어뜨립니다. 채무자는 빌릴 때보다 실질 가치가 낮은 돈으로 갚으므로 유리합니다. 반대로 채권자는 불리합니다.',
    },
    {
      id: 'inf-q3',
      question: '디플레이션(물가 하락)이 경제에 위험한 이유는?',
      options: ['소비자가 지출을 늘려서', '기업 이윤이 증가해서', '소비를 연기하고 실질 부채가 증가해서', '수출이 감소해서'],
      correctIndex: 2,
      explanation: '물가가 하락하면 "기다리면 더 싸진다"는 심리로 소비가 연기됩니다. 또한 명목 부채는 그대로인데 물가가 떨어져 실질 부채 부담이 늘어나 경기 침체가 심화됩니다.',
    },
  ],
  'ppf': [
    {
      id: 'ppf-q1',
      question: 'PPF 곡선 위의 점은 무엇을 의미하나요?',
      options: ['비효율적 생산', '효율적 생산', '달성 불가능', '초과 생산'],
      correctIndex: 1,
      explanation: 'PPF 곡선 위의 모든 점은 주어진 자원과 기술로 달성 가능한 최대 효율적 생산 조합입니다. 곡선 안쪽은 비효율(자원 낭비), 바깥쪽은 현재 기술로 불가능합니다.',
    },
    {
      id: 'ppf-q2',
      question: 'PPF가 원점에서 오목한 이유는?',
      options: ['규모의 경제', '기회비용 체증', '기회비용 체감', '기술 발전'],
      correctIndex: 1,
      explanation: '한 재화의 생산을 늘릴수록 포기해야 하는 다른 재화의 양이 점점 증가합니다(기회비용 체증). 이는 자원이 모든 용도에 동일하게 적합하지 않기 때문입니다.',
    },
    {
      id: 'ppf-q3',
      question: '기술 혁신이 일어나면 PPF는?',
      options: ['안쪽으로 이동', '바깥쪽으로 이동', '변화없음', '기울기만 변화'],
      correctIndex: 1,
      explanation: '기술 혁신은 같은 자원으로 더 많이 생산할 수 있게 하므로 PPF가 바깥쪽으로 이동합니다. 이것이 경제 성장의 본질입니다.',
    },
  ],
  'comparative-advantage': [
    {
      id: 'ca-q1',
      question: '비교우위란 무엇인가요?',
      options: [
        '더 많이 생산할 수 있는 능력',
        '더 적은 기회비용으로 생산하는 능력',
        '더 싸게 생산하는 능력',
        '더 빨리 생산하는 능력',
      ],
      correctIndex: 1,
      explanation: '비교우위는 절대적 생산량이 아니라 기회비용이 더 낮은 것을 의미합니다. 모든 재화를 더 잘 만드는 나라도 기회비용이 낮은 재화에 특화하면 무역 이득을 얻습니다.',
    },
    {
      id: 'ca-q2',
      question: '두 나라가 비교우위에 따라 특화하고 무역하면?',
      options: ['한 나라만 이득', '양국 모두 이득', '양국 모두 손해', '효과 없음'],
      correctIndex: 1,
      explanation: '비교우위에 따른 특화와 무역은 양국 모두의 소비가능 영역을 확대시킵니다. 이것이 자유무역이 이론적으로 모든 참여국에 이익이 되는 이유입니다.',
    },
    {
      id: 'ca-q3',
      question: '한 나라가 모든 재화에서 절대우위를 가지면 무역이 불가능한가요?',
      options: ['불가능하다', '가능하다 (비교우위가 있으므로)', '조건부로 가능', '절대우위국만 이득'],
      correctIndex: 1,
      explanation: '절대우위와 비교우위는 다른 개념입니다. 모든 재화에서 절대우위를 가진 나라도 기회비용이 상대적으로 낮은 재화가 존재하므로, 비교우위에 따른 무역이 가능하고 양국 모두 이득입니다.',
    },
  ],
  'multiplier': [
    {
      id: 'mult-q1',
      question: 'MPC가 0.8이면 승수는?',
      options: ['2', '3', '4', '5'],
      correctIndex: 3,
      explanation: '승수 = 1/(1-MPC) = 1/(1-0.8) = 1/0.2 = 5. 정부가 1원을 지출하면 GDP가 5원 증가합니다.',
    },
    {
      id: 'mult-q2',
      question: 'MPC가 높을수록 승수 효과는?',
      options: ['작아진다', '커진다', '변하지 않는다', '음수가 된다'],
      correctIndex: 1,
      explanation: 'MPC(한계소비성향)가 높으면 소득의 더 많은 부분이 소비되어 다음 라운드로 전달됩니다. MPC 0.5→승수 2, MPC 0.8→승수 5, MPC 0.9→승수 10으로 급격히 커집니다.',
    },
    {
      id: 'mult-q3',
      question: '"절약의 역설(Paradox of Thrift)"이란?',
      options: [
        '절약하면 부자가 된다',
        '모두가 절약하면 오히려 경제가 위축된다',
        '절약은 항상 좋다',
        '절약은 항상 나쁘다',
      ],
      correctIndex: 1,
      explanation: '개인이 절약하면 이득이지만, 모두가 저축을 늘리면(MPC 감소) 승수 효과가 줄어 총수요 감소 → 생산 감소 → 소득 감소의 악순환이 발생합니다. 케인스 경제학의 핵심 역설입니다.',
    },
  ],
  'is-lm': [
    {
      id: 'islm-q1',
      question: 'IS곡선이 우하향하는 이유는?',
      options: [
        '이자율 상승 → 소비 증가',
        '이자율 상승 → 투자 감소 → 국민소득 감소',
        '국민소득 증가 → 이자율 하락',
        '통화량 증가 → 이자율 하락',
      ],
      correctIndex: 1,
      explanation: 'IS곡선은 재화시장 균형을 나타냅니다. 이자율이 오르면 차입 비용이 증가하여 투자가 줄고, 투자 감소는 총수요를 줄여 국민소득이 감소합니다.',
    },
    {
      id: 'islm-q2',
      question: '확장적 재정정책(G 증가)의 단기 효과는?',
      options: [
        'Y 증가, r 하락',
        'Y 증가, r 상승',
        'Y 감소, r 상승',
        'Y 감소, r 하락',
      ],
      correctIndex: 1,
      explanation: '정부지출 증가 → IS곡선 우측 이동 → 국민소득(Y) 증가 + 이자율(r) 상승. 이자율 상승으로 민간 투자가 줄어드는 구축효과(crowding out)가 발생합니다.',
    },
    {
      id: 'islm-q3',
      question: '유동성 함정(Liquidity Trap)이란?',
      options: [
        '이자율이 너무 높아 투자가 불가능한 상태',
        '이자율이 0% 근처여서 통화정책이 무력한 상태',
        '통화량이 부족한 상태',
        '재정정책이 효과 없는 상태',
      ],
      correctIndex: 1,
      explanation: '이자율이 0%에 가까우면 LM곡선이 수평이 되어 통화공급을 늘려도 이자율이 더 이상 떨어지지 않습니다. 이때는 재정정책만 효과가 있습니다. 2008년 금융위기 이후 미국, 일본, 유럽이 이 상황에 직면했습니다.',
    },
  ],
};

export const concepts: Concept[] = [
  {
    id: 'supply-demand',
    title: '수요와 공급',
    titleEn: 'Supply & Demand',
    category: '미시경제',
    icon: 'show_chart',
    description: '가격을 움직여보세요 — 수요와 공급이 어떻게 반응하는지 직접 실험해볼 수 있어요. 시장의 보이지 않는 손이 어떻게 균형을 찾는지 관찰하세요.',
    coreExplanation: '시장에서 가격은 수요(사려는 양)와 공급(팔려는 양)이 만나는 곳에서 결정됩니다. 수요곡선은 우하향(가격이 오르면 구매량 감소)하고, 공급곡선은 우상향(가격이 오르면 판매량 증가)합니다. 두 곡선이 교차하는 균형점에서 시장가격과 거래량이 결정되며, 소득 변화, 생산비용, 세금 등의 요인이 곡선을 이동시켜 새로운 균형을 만듭니다. 이것이 애덤 스미스가 말한 "보이지 않는 손"의 핵심 메커니즘입니다.',
    keyTerms: [
      { term: '균형가격', definition: '수요량과 공급량이 일치하는 가격' },
      { term: '초과수요', definition: '현재 가격에서 수요량이 공급량보다 많은 상태' },
      { term: '초과공급', definition: '현재 가격에서 공급량이 수요량보다 많은 상태' },
      { term: '수요곡선 이동', definition: '소득, 선호, 대체재 가격 등 변화로 수요 전체가 변하는 것' },
      { term: '공급곡선 이동', definition: '기술, 원자재 가격, 세금 등 변화로 공급 전체가 변하는 것' },
    ],
    realWorldExamples: [
      {
        icon: 'masks',
        title: '마스크 대란 (2020)',
        description: '공급이 줄고 수요가 급증 → 가격 폭등',
      },
      {
        icon: 'local_gas_station',
        title: '유류세 인하',
        description: '세금 감소 → 공급곡선 우하향 이동 → 가격 하락',
      },
    ],
    relatedConceptIds: ['elasticity', 'gdp'],
    modelConfig: {
      id: 'supply-demand',
      variables: [
        {
          id: 'income',
          name: '소득 수준',
          unit: 'Lv.',
          min: 0,
          max: 10,
          defaultValue: 5,
          step: 1,
          description: '소득이 증가하면 수요곡선이 오른쪽으로 이동합니다',
        },
        {
          id: 'cost',
          name: '생산 비용',
          unit: 'Lv.',
          min: 0,
          max: 10,
          defaultValue: 3,
          step: 1,
          description: '생산 비용이 증가하면 공급곡선이 왼쪽으로 이동합니다',
        },
        {
          id: 'tax',
          name: '세금',
          unit: '%',
          min: 0,
          max: 20,
          defaultValue: 5,
          step: 1,
          description: '세금이 증가하면 공급이 감소하여 균형가격이 상승합니다',
        },
      ],
    },
  },
  {
    id: 'elasticity',
    title: '탄력성',
    titleEn: 'Elasticity',
    category: '미시경제',
    icon: 'insights',
    description: '가격 변화에 대한 수요와 공급의 민감도 측정. 탄력성이 크면 가격에 민감하게 반응합니다.',
    coreExplanation: '탄력성은 한 변수의 변화에 다른 변수가 얼마나 민감하게 반응하는지를 측정합니다. 수요의 가격탄력성(Ed)은 가격이 1% 변할 때 수요가 몇 % 변하는지를 나타냅니다. |Ed|>1이면 탄력적(가격에 민감), |Ed|<1이면 비탄력적(가격에 둔감)입니다. 탄력성을 결정하는 핵심 요인은 대체재의 수, 필수재/사치재 여부, 지출 비중, 시간 범위입니다. 기업의 가격 전략과 정부의 조세 정책에 핵심적인 개념입니다.',
    keyTerms: [
      { term: '가격탄력성', definition: '가격 1% 변화에 대한 수요량의 % 변화' },
      { term: '탄력적 수요', definition: '|Ed| > 1, 가격에 민감하게 반응' },
      { term: '비탄력적 수요', definition: '|Ed| < 1, 가격에 둔감하게 반응' },
      { term: '대체재', definition: '비슷한 용도로 사용할 수 있는 다른 재화' },
    ],
    realWorldExamples: [
      {
        icon: 'water_drop',
        title: '생수 vs 명품백',
        description: '생수는 비탄력적(대체재 적음), 명품백은 탄력적(대체재 많음)',
      },
      {
        icon: 'smartphone',
        title: '스마트폰 요금제',
        description: '가격 인상 시 소비자 이탈률로 탄력성을 측정할 수 있음',
      },
    ],
    relatedConceptIds: ['supply-demand'],
    modelConfig: {
      id: 'elasticity',
      variables: [
        {
          id: 'priceChangeRate',
          name: '가격 변화율',
          unit: '%',
          min: 0,
          max: 50,
          defaultValue: 10,
          step: 1,
          description: '가격이 변하는 비율을 설정합니다',
        },
        {
          id: 'substitutes',
          name: '대체재 수',
          unit: '개',
          min: 0,
          max: 10,
          defaultValue: 3,
          step: 1,
          description: '대체재가 많을수록 수요가 탄력적이 됩니다',
        },
      ],
    },
  },
  {
    id: 'ppf',
    title: '기회비용과 생산가능곡선',
    titleEn: 'Production Possibilities Frontier',
    category: '미시경제',
    icon: 'timeline',
    description: '한정된 자원으로 두 재화를 얼마나 생산할 수 있을까? 생산가능곡선(PPF)을 통해 기회비용과 효율적 자원 배분을 이해합니다.',
    coreExplanation: '생산가능곡선(PPF)은 주어진 자원과 기술로 최대한 생산할 수 있는 두 재화의 조합을 보여줍니다. PPF가 원점에서 오목한 이유는 기회비용이 체증하기 때문입니다. 즉, 한 재화의 생산을 늘릴수록 포기해야 하는 다른 재화의 양이 점점 증가합니다. 기술 발전이나 자원 증가는 PPF를 바깥으로 이동시켜 경제 성장을 나타냅니다. PPF 위의 점은 효율적, 안쪽은 비효율적, 바깥쪽은 현재 불가능한 생산 조합입니다.',
    keyTerms: [
      { term: '기회비용', definition: '어떤 선택을 할 때 포기해야 하는 최선의 대안의 가치' },
      { term: '생산가능곡선(PPF)', definition: '최대 생산 가능한 두 재화의 조합을 나타내는 곡선' },
      { term: '효율적 생산', definition: 'PPF 위의 점에서 자원을 낭비 없이 사용하는 상태' },
      { term: '경제 성장', definition: 'PPF가 바깥으로 이동하여 생산 가능 영역이 확대되는 것' },
      { term: '기회비용 체증', definition: '한 재화 생산을 늘릴수록 기회비용이 점점 커지는 현상' },
    ],
    realWorldExamples: [
      {
        icon: 'military_tech',
        title: '국방비 vs 복지예산',
        description: '국방비를 늘리면 복지에 쓸 예산이 줄어듭니다 (기회비용)',
      },
      {
        icon: 'school',
        title: '공부 vs 아르바이트',
        description: '시험 공부 1시간의 기회비용 = 아르바이트로 벌 수 있었던 시급',
      },
    ],
    relatedConceptIds: ['comparative-advantage', 'supply-demand'],
    modelConfig: {
      id: 'ppf',
      variables: [
        {
          id: 'technology',
          name: '기술 수준',
          unit: 'Lv.',
          min: 1,
          max: 10,
          defaultValue: 5,
          step: 1,
          description: '기술이 발전하면 PPF 곡선이 바깥으로 이동합니다',
        },
        {
          id: 'allocation',
          name: '재화A 배분 비율',
          unit: '%',
          min: 5,
          max: 95,
          defaultValue: 50,
          step: 5,
          description: '자원을 재화A에 얼마나 배분할지 조절합니다',
        },
      ],
    },
  },
  {
    id: 'gdp',
    title: 'GDP 구성요소',
    titleEn: 'GDP Components',
    category: '거시경제',
    icon: 'bar_chart',
    description: '국가 경제의 총체적인 성적표, 국내총생산의 이해. 소비, 투자, 정부지출, 순수출이 어떻게 GDP를 구성하는지 살펴봅니다.',
    coreExplanation: 'GDP(국내총생산)는 한 나라 안에서 일정 기간 동안 생산된 모든 최종 재화와 서비스의 시장 가치입니다. GDP = C(소비) + I(투자) + G(정부지출) + NX(순수출) 공식으로 계산합니다. 한국의 경우 소비가 약 50%, 투자 30%, 정부지출 17%, 순수출 3% 비중입니다. GDP는 경제 규모와 성장을 측정하는 가장 중요한 지표이지만, 소득 분배, 환경 파괴, 삶의 질 등은 반영하지 못하는 한계가 있습니다.',
    keyTerms: [
      { term: 'GDP', definition: '국내총생산. 일정 기간 한 나라에서 생산된 최종 재화의 총 가치' },
      { term: '소비 (C)', definition: '가계의 재화와 서비스 구입 지출' },
      { term: '투자 (I)', definition: '기업의 설비, 건설, 재고 투자' },
      { term: '정부지출 (G)', definition: '정부가 재화와 서비스를 구입하는 지출' },
      { term: '순수출 (NX)', definition: '수출(X) - 수입(M)' },
    ],
    realWorldExamples: [
      {
        icon: 'account_balance',
        title: '코로나 재난지원금',
        description: 'G(정부지출) 증가 → GDP 증가 효과',
      },
      {
        icon: 'trending_down',
        title: '수출 감소',
        description: 'NX 감소 → GDP 하락 압력',
      },
    ],
    relatedConceptIds: ['inflation', 'multiplier'],
    modelConfig: {
      id: 'gdp',
      variables: [
        {
          id: 'consumption',
          name: '소비 (C)',
          unit: '조원',
          min: 0,
          max: 100,
          defaultValue: 55,
          step: 5,
          description: '가계 소비 지출입니다. GDP의 가장 큰 비중을 차지합니다.',
        },
        {
          id: 'investment',
          name: '투자 (I)',
          unit: '조원',
          min: 0,
          max: 100,
          defaultValue: 20,
          step: 5,
          description: '기업의 설비 투자 및 건설 투자입니다.',
        },
        {
          id: 'government',
          name: '정부지출 (G)',
          unit: '조원',
          min: 0,
          max: 100,
          defaultValue: 20,
          step: 5,
          description: '정부가 공공재와 서비스에 지출하는 금액입니다.',
        },
        {
          id: 'netExports',
          name: '순수출 (NX)',
          unit: '조원',
          min: -50,
          max: 50,
          defaultValue: 5,
          step: 5,
          description: '수출에서 수입을 뺀 값입니다. 마이너스면 무역적자입니다.',
        },
      ],
    },
  },
  {
    id: 'inflation',
    title: '인플레이션과 통화량',
    titleEn: 'Inflation & Money Supply',
    category: '거시경제',
    icon: 'trending_up',
    description: '물가 상승의 원인과 경제에 미치는 파급 효과. 통화량과 유통속도가 물가에 어떤 영향을 미치는지 실험해봅니다.',
    coreExplanation: '피셔 방정식(MV=PY)에 따르면, 통화량(M)과 유통속도(V)의 곱은 물가(P)와 실질GDP(Y)의 곱과 같습니다. 통화량이 늘면 물가가 오르는 인플레이션이 발생합니다. 인플레이션은 수요견인(총수요 증가)과 비용인상(생산비용 증가) 두 가지 원인으로 발생합니다. 적정 인플레이션(2%)은 경제에 건전하지만, 과도한 인플레이션은 화폐가치 하락과 불확실성을 초래합니다. 중앙은행은 기준금리를 통해 통화량을 조절하여 물가를 안정시킵니다.',
    keyTerms: [
      { term: '인플레이션', definition: '물가가 지속적으로 상승하는 현상' },
      { term: '통화량 (M)', definition: '경제에 풀린 돈의 총량' },
      { term: '유통속도 (V)', definition: '일정 기간 화폐가 거래에 사용되는 횟수' },
      { term: '피셔 방정식', definition: 'MV = PY, 화폐수량설의 핵심 공식' },
    ],
    realWorldExamples: [
      {
        icon: 'currency_exchange',
        title: '양적완화 (QE)',
        description: '중앙은행이 통화량(M)을 크게 늘려 경기를 부양하는 정책',
      },
      {
        icon: 'shopping_cart',
        title: '장바구니 물가 상승',
        description: '통화량 증가 → 물가(P) 상승 → 소비자 체감 인플레이션',
      },
    ],
    relatedConceptIds: ['gdp', 'is-lm'],
    modelConfig: {
      id: 'inflation',
      variables: [
        {
          id: 'moneySupply',
          name: '통화량 (M)',
          unit: '조원',
          min: 10,
          max: 100,
          defaultValue: 50,
          step: 5,
          description: '경제에 풀린 돈의 총량입니다. 늘리면 물가가 상승합니다.',
        },
        {
          id: 'velocity',
          name: '유통속도 (V)',
          unit: '회',
          min: 1,
          max: 10,
          defaultValue: 5,
          step: 1,
          description: '돈이 거래에 사용되는 빈도입니다. 빨라지면 물가가 오릅니다.',
        },
      ],
    },
  },
  {
    id: 'comparative-advantage',
    title: '비교우위와 무역',
    titleEn: 'Comparative Advantage & Trade',
    category: '국제경제',
    icon: 'public',
    description: '왜 나라들은 무역을 할까? 비교우위 이론으로 국제무역의 이득을 직접 실험해봅니다.',
    coreExplanation: '리카르도의 비교우위론에 따르면, 각 나라가 기회비용이 낮은 재화 생산에 특화하고 교역하면 양국 모두 이득입니다. 핵심은 "절대적 생산능력"이 아닌 "상대적 기회비용"입니다. 한 나라가 모든 재화를 더 효율적으로 만들더라도(절대우위), 기회비용이 상대적으로 낮은 재화에 특화하면 무역을 통해 양국 모두 소비가능 영역이 확대됩니다. 이것이 자유무역이 이론적으로 모든 참여국에 이익이 되는 근거이며, WTO와 FTA의 경제학적 기반입니다.',
    keyTerms: [
      { term: '비교우위', definition: '다른 나라에 비해 더 낮은 기회비용으로 생산할 수 있는 능력' },
      { term: '절대우위', definition: '다른 나라보다 더 적은 자원으로 생산할 수 있는 능력' },
      { term: '특화', definition: '비교우위가 있는 재화의 생산에 집중하는 것' },
      { term: '교역조건', definition: '수출재 가격 대비 수입재 가격의 비율' },
      { term: '소비가능 영역', definition: '무역을 통해 자국 PPF 밖에서도 소비가 가능해지는 영역' },
    ],
    realWorldExamples: [
      {
        icon: 'memory',
        title: '한국의 반도체 수출',
        description: '한국은 반도체, 베트남은 의류에 비교우위 → 상호 무역으로 양국 이득',
      },
      {
        icon: 'agriculture',
        title: '호주의 농산물',
        description: '호주는 넓은 국토로 농업에 비교우위, 일본은 기술 집약 산업에 비교우위',
      },
    ],
    relatedConceptIds: ['ppf', 'gdp'],
    modelConfig: {
      id: 'comparative-advantage',
      variables: [
        {
          id: 'productivityA',
          name: 'A국 생산성',
          unit: 'Lv.',
          min: 1,
          max: 10,
          defaultValue: 5,
          step: 1,
          description: 'A국의 전체 생산성입니다. A국은 재화1(전자제품)에 비교우위가 있습니다.',
        },
        {
          id: 'productivityB',
          name: 'B국 생산성',
          unit: 'Lv.',
          min: 1,
          max: 10,
          defaultValue: 5,
          step: 1,
          description: 'B국의 전체 생산성입니다. B국은 재화2(농산물)에 비교우위가 있습니다.',
        },
        {
          id: 'tradeRatio',
          name: '교역 비율',
          unit: '%',
          min: 10,
          max: 90,
          defaultValue: 50,
          step: 10,
          description: '두 나라 간의 교역 조건을 조절합니다.',
        },
      ],
    },
  },
  {
    id: 'multiplier',
    title: '승수 효과',
    titleEn: 'Multiplier Effect',
    category: '거시경제',
    icon: 'stacked_bar_chart',
    description: '정부가 1원을 쓰면 GDP는 1원 이상 증가한다? 승수 효과의 원리를 연쇄 소비 과정으로 직접 확인합니다.',
    coreExplanation: '승수 효과란 정부지출(또는 투자) 증가분이 연쇄적인 소비를 통해 GDP를 그 이상으로 증가시키는 현상입니다. 승수 = 1/(1-MPC)로, MPC(한계소비성향)가 0.8이면 승수는 5입니다. 정부가 10조원을 지출하면 → 소득 수령자가 8조원 소비(MPC=0.8) → 그 수령자가 6.4조원 소비 → ... 이런 연쇄 과정으로 GDP가 50조원 증가합니다. 케인스는 이 원리로 불황기 정부의 적극적 재정지출을 주장했습니다.',
    keyTerms: [
      { term: '승수', definition: '초기 지출 증가가 GDP를 몇 배 증가시키는지를 나타내는 값' },
      { term: 'MPC', definition: '한계소비성향. 추가 소득 중 소비에 사용되는 비율' },
      { term: 'MPS', definition: '한계저축성향. 1-MPC. 추가 소득 중 저축되는 비율' },
      { term: '절약의 역설', definition: '개인의 저축 증가가 총소득 감소로 이어질 수 있는 역설' },
      { term: '누출', definition: '저축, 세금, 수입 등으로 승수 효과가 줄어드는 요인' },
    ],
    realWorldExamples: [
      {
        icon: 'construction',
        title: '뉴딜 정책 (1930s)',
        description: '대공황기 루즈벨트의 대규모 재정지출 → 승수 효과로 경기 회복',
      },
      {
        icon: 'payments',
        title: '코로나 재난지원금',
        description: '가계에 현금 지급 → 소비 증가 → 소상공인 매출 증가 → 연쇄 효과',
      },
    ],
    relatedConceptIds: ['gdp', 'is-lm'],
    modelConfig: {
      id: 'multiplier',
      variables: [
        {
          id: 'mpc',
          name: '한계소비성향 (MPC)',
          unit: '%',
          min: 10,
          max: 95,
          defaultValue: 70,
          step: 5,
          description: '소득이 1원 증가할 때 소비에 사용하는 비율입니다. 높을수록 승수가 커집니다.',
        },
        {
          id: 'deltaG',
          name: '정부지출 증가분',
          unit: '조원',
          min: 1,
          max: 100,
          defaultValue: 10,
          step: 1,
          description: '정부가 추가로 지출하는 금액입니다.',
        },
      ],
    },
  },
  {
    id: 'is-lm',
    title: 'IS-LM 모델',
    titleEn: 'IS-LM Model',
    category: '거시경제',
    icon: 'scatter_plot',
    description: '재정정책과 통화정책이 경제에 미치는 효과를 IS-LM 모델로 분석합니다. 정부지출과 통화공급을 조절해보세요.',
    coreExplanation: 'IS-LM 모델은 재화시장(IS)과 화폐시장(LM)의 동시 균형을 보여주는 거시경제 핵심 모델입니다. IS곡선은 우하향(이자율 상승 → 투자 감소 → 국민소득 감소)하고, LM곡선은 우상향(국민소득 증가 → 화폐수요 증가 → 이자율 상승)합니다. 정부지출 증가는 IS곡선을 우측으로, 통화공급 증가는 LM곡선을 우측으로 이동시킵니다. 두 곡선의 교차점에서 균형 이자율과 국민소득이 결정되며, 이를 통해 재정정책과 통화정책의 효과를 분석할 수 있습니다.',
    keyTerms: [
      { term: 'IS곡선', definition: '재화시장이 균형인 이자율-국민소득 조합. 우하향' },
      { term: 'LM곡선', definition: '화폐시장이 균형인 이자율-국민소득 조합. 우상향' },
      { term: '구축효과', definition: '정부지출 증가로 이자율이 올라 민간 투자가 줄어드는 효과' },
      { term: '유동성 함정', definition: '이자율이 0%에 가까워 통화정책이 무력해지는 상태' },
      { term: '정책 조합', definition: '재정정책과 통화정책을 함께 사용하는 것' },
    ],
    realWorldExamples: [
      {
        icon: 'account_balance',
        title: '2008 금융위기 대응',
        description: '미 연준 금리 0% (LM 이동) + 대규모 재정지출 (IS 이동) 동시 시행',
      },
      {
        icon: 'currency_yen',
        title: '아베노믹스 (일본)',
        description: '양적완화(LM) + 재정확장(IS) + 구조개혁의 3개 화살 정책',
      },
    ],
    relatedConceptIds: ['gdp', 'inflation', 'multiplier'],
    modelConfig: {
      id: 'is-lm',
      variables: [
        {
          id: 'govSpending',
          name: '정부지출 (G)',
          unit: '조원',
          min: 10,
          max: 100,
          defaultValue: 50,
          step: 5,
          description: '정부지출을 늘리면 IS곡선이 우측으로 이동합니다.',
        },
        {
          id: 'moneySupply',
          name: '통화공급 (Ms)',
          unit: '조원',
          min: 10,
          max: 100,
          defaultValue: 50,
          step: 5,
          description: '통화공급을 늘리면 LM곡선이 우측(하방)으로 이동합니다.',
        },
      ],
    },
  },
];

export function getConceptById(id: string): Concept | undefined {
  return concepts.find(c => c.id === id);
}

// === Iteration 3: 정훈 타겟 데이터 ===

export type DifficultyLevel = '입문' | '중급' | '심화';

export interface NewsConnection {
  headline: string;
  source: string;
  date: string;
  explanation: string;
}

export const conceptDifficulty: Record<string, DifficultyLevel> = {
  'supply-demand': '입문',
  'gdp': '입문',
  'inflation': '입문',
  'ppf': '중급',
  'elasticity': '중급',
  'multiplier': '중급',
  'comparative-advantage': '중급',
  'is-lm': '심화',
};

export const conceptOneLiner: Record<string, string> = {
  'supply-demand': '가격이 오르면 사려는 사람은 줄고, 팔려는 사람은 늘어난다',
  'gdp': '나라 경제의 크기 = 소비 + 투자 + 정부지출 + 수출 - 수입',
  'inflation': '돈이 많아지면 물건값이 오른다',
  'elasticity': '가격이 올랐을 때, 사람들이 얼마나 민감하게 반응하는지를 숫자로 표현한 것',
  'ppf': '자원이 한정되어 있으니, 하나를 더 만들려면 다른 걸 포기해야 한다',
  'comparative-advantage': '각자 잘하는 걸 만들고 교환하면 모두가 이득이다',
  'multiplier': '정부가 1원을 쓰면, 돈이 돌고 돌아 경제 전체에 몇 배의 효과가 난다',
  'is-lm': '금리와 GDP가 재정정책, 통화정책에 따라 어떻게 움직이는지 보여주는 모델',
};

export const conceptNewsConnections: Record<string, NewsConnection[]> = {
  'supply-demand': [
    {
      headline: '"삼겹살 가격 또 올랐다" — 돼지 공급 감소가 원인',
      source: '한국경제',
      date: '2025.12',
      explanation: '돼지 사육 두수 감소(공급 감소) → 공급곡선 좌측 이동 → 균형가격 상승. 수요는 그대로인데 공급만 줄어서 가격이 오른 전형적 사례.',
    },
    {
      headline: '"여름 에어컨 판매 역대 최고" — 폭염에 수요 폭증',
      source: 'MBC 뉴스',
      date: '2025.08',
      explanation: '폭염(외부 요인) → 에어컨 수요 급증 → 수요곡선 우측 이동 → 균형가격 상승 + 거래량 증가.',
    },
  ],
  'gdp': [
    {
      headline: '"올해 경제성장률 2.5% 전망" — IMF 보고서',
      source: '연합뉴스',
      date: '2026.01',
      explanation: '경제성장률 2.5% = GDP가 작년보다 2.5% 커졌다는 뜻. 소비, 투자, 수출이 골고루 늘어났다는 의미.',
    },
    {
      headline: '"정부, 추경 59조원 편성" — 경기 부양 목적',
      source: 'KBS 뉴스',
      date: '2025.09',
      explanation: 'G(정부지출) 59조 증가 → GDP 공식에서 G가 커지니 GDP도 증가. 승수 효과까지 합치면 실제 GDP 영향은 59조 이상.',
    },
  ],
  'inflation': [
    {
      headline: '"소비자물가 3.5% 상승" — 16개월째 고물가',
      source: '한국은행',
      date: '2025.11',
      explanation: '소비자물가지수(CPI)가 전년 대비 3.5% 올랐다 = 인플레이션 3.5%. 통화량 증가 + 공급 부족이 복합 원인.',
    },
    {
      headline: '"한국은행, 기준금리 3.5% 동결"',
      source: '매일경제',
      date: '2026.01',
      explanation: '기준금리를 유지 = 통화량 조절을 현 수준으로 유지. 물가가 아직 높아서 금리를 못 내리고, 경기도 약해서 못 올리는 상황.',
    },
  ],
  'elasticity': [
    {
      headline: '"유가 20% 올랐는데 주유소 매출 그대로"',
      source: '조선일보',
      date: '2025.10',
      explanation: '석유는 대체재가 거의 없는 필수재 → 비탄력적 수요(|Ed|<1). 가격이 올라도 수요가 크게 안 줄어든다.',
    },
    {
      headline: '"넷플릭스 가격 인상에 해지 급증"',
      source: 'IT조선',
      date: '2025.07',
      explanation: 'OTT는 대체재가 많음(웨이브, 티빙, 쿠팡플레이) → 탄력적 수요(|Ed|>1). 가격 올리면 소비자가 바로 이탈.',
    },
  ],
  'ppf': [
    {
      headline: '"반도체에 올인하는 한국, 다른 산업은 괜찮을까"',
      source: '중앙일보',
      date: '2025.06',
      explanation: '반도체(재화A)에 자원을 집중하면 다른 산업(재화B)에 쓸 자원이 줄어든다 = 기회비용. PPF 위에서 한쪽으로 이동하는 것.',
    },
  ],
  'comparative-advantage': [
    {
      headline: '"한-베트남 FTA 효과, 교역액 역대 최고"',
      source: '무역협회',
      date: '2025.12',
      explanation: '한국은 반도체/자동차(기술집약), 베트남은 의류/농산물(노동집약)에 비교우위. 각자 잘하는 걸 교역해서 양국 모두 이득.',
    },
  ],
  'multiplier': [
    {
      headline: '"재난지원금 10조 투입 → 소비 효과 25조" — KDI 분석',
      source: 'KDI',
      date: '2025.04',
      explanation: '승수 약 2.5. 10조원이 가계에 들어가면 소비→매출→소득→소비... 연쇄 반응으로 GDP에 25조원 효과.',
    },
  ],
  'is-lm': [
    {
      headline: '"금리 올렸더니 경기 둔화" — 통화정책 딜레마',
      source: '서울경제',
      date: '2025.11',
      explanation: '금리 인상 = LM곡선 좌측 이동 → 이자율 상승 + 국민소득 감소. 물가 잡으려고 금리 올렸는데 경기도 같이 식은 것.',
    },
  ],
};
