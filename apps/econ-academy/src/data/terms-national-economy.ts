import { Term } from '../types';

export const termsNationalEconomy: Term[] = [
  {
    id: 'national-income',
    korean: '국민소득',
    english: 'National Income',
    definition: '한 나라의 국민이 일정 기간 동안 생산 활동에 참여하여 벌어들인 소득의 총합이다.',
    explanation:
      '국민소득은 한 나라의 경제 규모와 국민 생활 수준을 측정하는 가장 기본적인 거시경제 지표다. 생산, 분배, 지출의 세 가지 측면에서 측정할 수 있으며, 이론적으로 세 방법의 결과는 동일하다. 이를 국민소득 3면 등가의 법칙이라 한다.\n\n국민소득 개념은 GDP, GNI 등 다양한 파생 지표의 기초가 된다. 국가 간 경제력 비교, 경제 성장률 계산, 소득 분배 분석 등 거시경제 분석의 출발점이므로 정확히 이해해야 한다.\n\n1인당 국민소득은 국민소득을 인구수로 나눈 값으로, 국민의 평균적인 생활 수준을 나타낸다. 다만 소득 불평등이나 삶의 질 같은 요소는 반영하지 못하는 한계가 있다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['macroeconomics'],
    hasLab: false,
    keyPoints: [
      '생산·분배·지출 3면에서 측정하며 이론적으로 같은 값이다',
      'GDP, GNI 등 주요 거시지표의 기초 개념이다',
      '1인당 국민소득은 평균 생활 수준을 나타내지만 분배 상태는 반영하지 못한다',
    ],
    realWorldExample:
      '한국의 1인당 국민소득이 3만 달러를 넘어서며 선진국 반열에 올랐다는 뉴스가 대표적이다. 이는 국민소득 총액을 인구로 나눈 수치로, 경제 성장의 성과를 가늠하는 데 쓰인다.',
    newsConnection:
      '"한국 1인당 국민소득 3만5천 달러 돌파… 선진국 평균에 근접"',
  },
  {
    id: 'gdp',
    korean: '국내총생산(GDP)',
    english: 'Gross Domestic Product',
    definition: '일정 기간 동안 한 나라의 국경 안에서 생산된 모든 최종 재화와 서비스의 시장 가치 합계다.',
    explanation:
      'GDP는 국내에서 이루어진 생산 활동의 총량을 화폐 단위로 측정한 것이다. 외국인이 국내에서 생산한 것은 포함하지만, 자국민이 해외에서 생산한 것은 제외한다. 중간재는 이중 계산을 피하기 위해 제외하고 최종재만 합산한다.\n\nGDP는 지출 접근법으로 가장 많이 계산되며, 소비(C) + 투자(I) + 정부지출(G) + 순수출(NX)로 구성된다. 각 항목의 변동을 분석하면 경기 변동의 원인을 파악할 수 있다.\n\n세계 각국은 GDP를 기준으로 경제 규모를 비교한다. 한국은 세계 10위권의 GDP를 기록하고 있으며, 분기별 GDP 성장률은 경기 판단의 핵심 지표로 활용된다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['national-income'],
    hasLab: true,
    keyPoints: [
      '국경 기준으로 측정하며 최종 재화·서비스만 합산한다',
      'C + I + G + NX 지출 항목으로 분해하여 분석한다',
      '국가 간 경제 규모 비교와 경기 판단의 핵심 지표다',
    ],
    realWorldExample:
      '한국은행이 매 분기 GDP 속보치를 발표하면 언론과 시장이 즉각 반응한다. 2분기 연속 마이너스 성장이면 기술적 경기침체로 판단하는 기준이 된다.',
    newsConnection:
      '"2분기 GDP 성장률 0.6%… 내수 회복세에 소비·투자 동반 증가"',
  },
  {
    id: 'nominal-gdp',
    korean: '명목GDP',
    english: 'Nominal GDP',
    definition: '해당 연도의 시장 가격(경상가격)으로 계산한 GDP로, 물가 변동이 반영된 수치다.',
    explanation:
      '명목GDP는 생산량과 가격 변동을 모두 포함한 GDP다. 가격이 오르면 생산량이 그대로여도 명목GDP는 증가한다. 따라서 명목GDP만으로는 실제 생산량이 늘었는지 물가만 올랐는지 구분할 수 없다.\n\n이 한계를 보완하기 위해 기준 연도의 가격으로 계산하는 실질GDP 개념이 필요하다. 명목GDP와 실질GDP의 비율이 GDP 디플레이터이며, 이는 경제 전체의 물가 수준 변동을 보여준다.\n\n명목GDP는 세수 추정, 정부 예산 편성, 국가 채무 비율(국가 채무/명목GDP) 계산 등에 활용된다. 국가 재정 건전성을 평가할 때 분모로 자주 사용되므로 실무적으로 중요한 지표다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['gdp'],
    hasLab: false,
    keyPoints: [
      '경상가격으로 계산하므로 물가 변동이 포함된다',
      '실질GDP와의 비율인 GDP 디플레이터로 물가 수준을 파악한다',
      '국가 채무 비율 등 재정 지표의 분모로 활용된다',
    ],
    realWorldExample:
      '정부가 국가 채무가 GDP 대비 50%를 넘었다고 발표할 때, 여기서 GDP는 명목GDP를 의미한다. 명목GDP가 커지면 같은 채무 규모라도 비율은 낮아진다.',
    newsConnection:
      '"국가채무 GDP 대비 50% 돌파… 재정 건전성 논란 가열"',
  },
  {
    id: 'real-gdp',
    korean: '실질GDP',
    english: 'Real GDP',
    definition: '기준 연도의 가격(불변가격)으로 계산한 GDP로, 물가 변동을 제거하여 순수한 생산량 변화를 나타낸다.',
    explanation:
      '실질GDP는 물가 상승분을 걸러내고 실제 생산량의 변화만 측정한다. 경제가 진정으로 성장했는지를 판단하려면 명목GDP가 아닌 실질GDP를 봐야 한다. 한국은행은 2015년을 기준 연도로 사용하여 실질GDP를 산출한다.\n\n경제성장률은 실질GDP의 전년 대비 증가율로 계산한다. 실질GDP가 증가하면 일자리와 소득이 늘어나 국민 생활 수준이 향상되는 것으로 해석한다.\n\n실질GDP는 경기 순환 분석, 잠재 성장률 추정, 국제 비교(PPP 기준) 등에 핵심적으로 사용된다. 투자자와 정책 입안자 모두 실질GDP 추이를 가장 중요한 경제 지표 중 하나로 본다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['nominal-gdp'],
    hasLab: true,
    keyPoints: [
      '기준 연도 가격으로 계산하여 물가 변동 효과를 제거한다',
      '경제성장률은 실질GDP의 증가율로 측정한다',
      '경기 판단과 성장률 계산의 핵심 기준이 된다',
    ],
    realWorldExample:
      '한국은행이 발표하는 경제성장률이 대표적이다. 명목 성장률이 5%여도 물가가 3% 올랐다면 실질 성장률은 약 2%에 불과하다.',
    newsConnection:
      '"올해 실질GDP 성장률 2.1% 전망… 물가 감안하면 체감 성장 낮아"',
  },
  {
    id: 'gni',
    korean: '국민총소득(GNI)',
    english: 'Gross National Income',
    definition: '한 나라의 국민이 국내외에서 벌어들인 소득의 총합으로, GDP에 해외 순수취 요소소득을 더한 값이다.',
    explanation:
      'GNI는 국적 기준으로 소득을 측정한다. GDP가 영토 안의 생산을 측정하는 반면, GNI는 한국 국민이 해외에서 번 소득을 더하고 외국인이 국내에서 번 소득은 빼서 계산한다. 해외 투자나 해외 근로 소득이 많은 나라일수록 GDP와 GNI의 차이가 크다.\n\n1인당 GNI는 국민의 실질 구매력과 생활 수준을 비교하는 데 GDP보다 적합하다. 세계은행은 1인당 GNI를 기준으로 국가를 저소득·중소득·고소득 국가로 분류한다.\n\n한국은 해외 투자 소득이 증가하면서 GNI가 GDP보다 큰 폭으로 성장하는 추세다. 반대로 외국인 투자가 많이 유입된 개발도상국은 GDP가 GNI보다 클 수 있다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['gdp'],
    hasLab: false,
    keyPoints: [
      '국적 기준 소득 측정으로 GDP에 해외 순수취 요소소득을 더한다',
      '세계은행의 국가 소득 분류 기준으로 사용된다',
      '해외 투자 소득이 많을수록 GDP와 GNI의 격차가 커진다',
    ],
    realWorldExample:
      '한국 기업의 해외 공장에서 발생한 이익은 한국의 GNI에 포함되지만 해당 국가의 GDP에 잡힌다. 삼성전자 베트남 공장 매출이 대표적 사례다.',
    newsConnection:
      '"1인당 GNI 3만6천 달러… 해외 투자 소득 증가가 견인"',
  },
  {
    id: 'potential-gdp',
    korean: '잠재GDP',
    english: 'Potential GDP',
    definition: '한 나라의 노동, 자본 등 생산 요소를 정상적으로 가동했을 때 달성할 수 있는 최대 생산 수준이다.',
    explanation:
      '잠재GDP는 물가 상승 압력 없이 지속 가능한 최대 생산량을 의미한다. 실제로 관측되는 값이 아니라 추정치이며, 노동력·자본스톡·기술 수준 등을 반영하여 계산한다.\n\n잠재GDP는 경기 과열이나 침체를 판단하는 기준선 역할을 한다. 실질GDP가 잠재GDP를 넘어서면 인플레이션 압력이 생기고, 밑돌면 유휴 자원이 존재한다는 뜻이다.\n\n한국의 잠재성장률은 인구 고령화와 생산성 둔화로 점차 하락하는 추세다. 잠재성장률을 높이려면 노동 참여 확대, 기술 혁신, 규제 개혁 등 구조적 노력이 필요하다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['gdp'],
    hasLab: false,
    keyPoints: [
      '물가 안정을 유지하며 달성할 수 있는 최대 생산 수준이다',
      '경기 과열과 침체를 판단하는 기준선 역할을 한다',
      '인구 구조·기술 수준·자본 축적에 의해 결정된다',
    ],
    realWorldExample:
      '한국은행은 한국의 잠재성장률이 2%대로 하락했다고 추정한다. 이는 특별한 정책 변화 없이는 연간 2% 정도가 지속 가능한 최대 성장률이라는 뜻이다.',
    newsConnection:
      '"한국 잠재성장률 2%대 초반으로 하락… 고령화·생산성 둔화 영향"',
  },
  {
    id: 'gdp-gap',
    korean: 'GDP갭',
    english: 'GDP Gap',
    definition: '실질GDP와 잠재GDP의 차이로, 경기 상황이 과열인지 침체인지를 보여주는 지표다.',
    explanation:
      'GDP갭은 (실질GDP - 잠재GDP) / 잠재GDP × 100으로 계산한다. 양(+)이면 경기 과열(인플레이션 갭), 음(-)이면 경기 침체(디플레이션 갭)를 의미한다.\n\n중앙은행과 정부는 GDP갭을 통화·재정 정책의 핵심 판단 근거로 활용한다. GDP갭이 양이면 긴축 정책, 음이면 확장 정책이 필요하다고 판단한다.\n\n다만 잠재GDP 자체가 추정치이므로 GDP갭에도 불확실성이 존재한다. 추정 방법에 따라 결과가 달라질 수 있어, 여러 기관의 추정치를 비교하며 종합적으로 판단한다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['real-gdp', 'potential-gdp'],
    hasLab: false,
    keyPoints: [
      '양의 갭은 경기 과열, 음의 갭은 경기 침체를 나타낸다',
      '통화·재정 정책 방향을 결정하는 핵심 판단 근거다',
      '잠재GDP가 추정치이므로 GDP갭에도 불확실성이 따른다',
    ],
    realWorldExample:
      '코로나19 팬데믹 직후 한국의 GDP갭은 큰 폭의 음(-)을 기록했다. 이에 정부는 대규모 재정 지출과 한국은행의 금리 인하로 경기 부양에 나섰다.',
    newsConnection:
      '"GDP갭 마이너스 지속… 한은, 완화적 통화정책 유지 시사"',
  },
  {
    id: 'economic-growth-rate',
    korean: '경제성장률',
    english: 'Economic Growth Rate',
    definition: '실질GDP가 전년 대비 얼마나 증가했는지를 백분율로 나타낸 것으로, 경제 성장 속도를 측정하는 지표다.',
    explanation:
      '경제성장률은 (금년 실질GDP - 전년 실질GDP) / 전년 실질GDP × 100으로 계산한다. 양이면 경제가 성장한 것이고, 음이면 경제 규모가 축소된 것이다.\n\n분기별 성장률은 전분기 대비(QoQ)와 전년 동기 대비(YoY) 두 가지 방식으로 발표된다. 전분기 대비는 최근 경기 흐름을, 전년 동기 대비는 계절 요인을 제거한 추세를 파악하는 데 유용하다.\n\n한국은 1960~90년대 연 8~10%의 고도 성장을 이뤘지만, 경제 규모가 커지면서 현재는 2%대 성장이 일반적이다. 성장률 1%포인트 변화가 고용과 세수에 미치는 영향이 크므로 경제 정책의 핵심 목표가 된다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['real-gdp'],
    hasLab: false,
    keyPoints: [
      '실질GDP의 전년 대비 증가율로 계산한다',
      'QoQ(전분기비)와 YoY(전년동기비) 두 방식으로 발표된다',
      '경제 규모가 커질수록 성장률은 자연스럽게 둔화되는 경향이 있다',
    ],
    realWorldExample:
      '한국은행이 매 분기 발표하는 경제성장률은 정부 정책과 시장 전망에 직접적인 영향을 미친다. 성장률이 예상보다 낮으면 추경 편성이나 금리 인하 논의가 시작된다.',
    newsConnection:
      '"올해 경제성장률 2.1% 전망… 수출 회복이 관건"',
  },
  {
    id: 'price-index',
    korean: '물가지수',
    english: 'Price Index',
    definition: '기준 시점 대비 현재 물가 수준의 변동을 수치화한 지표로, 인플레이션과 디플레이션을 측정하는 데 사용된다.',
    explanation:
      '물가지수는 특정 상품 묶음(바스켓)의 가격을 기준 시점과 비교하여 100을 기준으로 표시한다. 지수가 105면 기준 시점 대비 물가가 5% 상승했다는 뜻이다.\n\n대표적인 물가지수로는 소비자물가지수(CPI), 생산자물가지수(PPI), GDP 디플레이터가 있다. 각각 측정 대상과 범위가 다르므로 목적에 맞는 지표를 선택해야 한다.\n\n명목GDP를 실질GDP로 전환하거나 실질 임금을 계산할 때 물가지수를 사용한다. 또한 물가지수의 변동률이 곧 물가상승률(인플레이션율)이므로, 중앙은행의 물가 안정 목표 달성 여부를 판단하는 핵심 기준이 된다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['nominal-gdp', 'real-gdp'],
    hasLab: false,
    keyPoints: [
      '기준 시점 대비 물가 변동을 100 기준 수치로 나타낸다',
      'CPI, PPI, GDP 디플레이터 등 목적별 다양한 지수가 존재한다',
      '명목 수치를 실질 수치로 변환하는 데 핵심적으로 활용된다',
    ],
    realWorldExample:
      '통계청은 매월 소비자물가지수를 발표한다. 물가지수가 전년보다 3% 이상 오르면 서민 생활이 어려워졌다는 뉴스가 나오고 금리 인상 압력이 높아진다.',
    newsConnection:
      '"3월 물가지수 전년비 3.2% 상승… 한은 물가 안정 목표 상회"',
  },
  {
    id: 'cpi',
    korean: '소비자물가지수(CPI)',
    english: 'Consumer Price Index',
    definition: '가계가 일상에서 구매하는 상품과 서비스의 가격 변동을 종합 측정한 물가지수다.',
    explanation:
      'CPI는 약 460개 품목의 가격을 매월 조사하여 가중 평균한 값이다. 쌀, 라면 같은 식료품부터 교통비, 통신비, 주거비까지 일반 소비자가 실제로 지출하는 항목들로 구성된다.\n\nCPI 상승률은 곧 소비자가 체감하는 인플레이션율이다. 한국은행은 소비자물가 상승률 목표를 2%로 설정하고, 이를 기준으로 기준금리를 조정한다. CPI가 목표를 크게 넘으면 금리를 올리고, 밑돌면 내린다.\n\n근원 물가(Core CPI)는 CPI에서 에너지와 식품처럼 변동성이 큰 품목을 제외한 지표다. 일시적 충격을 걸러내고 물가의 기조적 추세를 파악하는 데 사용한다.',
    category: 'national-economy',
    difficulty: 'intermediate',
    prerequisites: ['price-index'],
    hasLab: false,
    keyPoints: [
      '약 460개 소비 품목의 가격을 가중 평균하여 산출한다',
      '한국은행 물가 안정 목표(2%)의 기준 지표다',
      '근원 CPI는 에너지·식품을 제외하여 기조적 물가 추세를 파악한다',
    ],
    realWorldExample:
      '장바구니 물가가 오르면 CPI에 즉각 반영된다. 2022년 글로벌 에너지 가격 급등 시 한국 CPI가 6%대까지 치솟아 한국은행이 사상 처음 빅스텝(0.5%p) 금리 인상을 단행했다.',
    newsConnection:
      '"소비자물가 상승률 3%대 진입… 한은 금리 동결 여부 주목"',
  },
];
