export type SpendType =
  | 'flex'
  | 'value'
  | 'aesthetic'
  | 'analyst'
  | 'giver'
  | 'planner'
  | 'explorer'
  | 'stress';

export interface ResultType {
  id: SpendType;
  name: string;
  emoji: string;
  title: string;
  description: string;
  traits: string[];
  color: string;
  gradient: string;
}

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    scores: Partial<Record<SpendType, number>>;
  }[];
}

export const resultTypes: Record<SpendType, ResultType> = {
  flex: {
    id: 'flex',
    name: '플렉스 대장',
    emoji: '🛍️',
    title: '플렉스 대장',
    description:
      '사고 싶으면 지르는 YOLO 소비 타입! 인생은 한 번뿐이라는 마인드로, 원하는 건 바로 결제합니다. 카드값은 나중에 생각하는 스타일이지만, 그만큼 삶을 즐길 줄 아는 사람이에요.',
    traits: ['충동 구매율 MAX', '위시리스트 = 장바구니', '카드값은 미래의 내가 해결'],
    color: '#FF6B6B',
    gradient: 'from-red-400 to-pink-500',
  },
  value: {
    id: 'value',
    name: '가성비 전사',
    emoji: '💰',
    title: '가성비 전사',
    description:
      '1원이라도 아끼는 알뜰살뜰 타입! 할인 없으면 안 사고, 쿠폰은 무조건 수집합니다. 같은 물건이면 가장 싼 곳에서 사는 게 당연하죠. 현명한 소비의 달인!',
    traits: ['쿠폰 수집가', '가격 비교 앱 3개 이상', '정가 구매는 있을 수 없는 일'],
    color: '#4ECDC4',
    gradient: 'from-teal-400 to-emerald-500',
  },
  aesthetic: {
    id: 'aesthetic',
    name: '감성 소비러',
    emoji: '🎨',
    title: '감성 소비러',
    description:
      '예쁘면 삽니다. 브랜드와 디자인에 약한 감성 충만 타입! 카페 인테리어에 감동받고, 패키지가 예쁘면 지갑이 열립니다. 삶의 미적 가치를 중시하는 심미안의 소유자.',
    traits: ['예쁜 패키지에 약함', '브랜드 로열티 높음', '인스타 갬성 추구'],
    color: '#A88BEB',
    gradient: 'from-purple-400 to-violet-500',
  },
  analyst: {
    id: 'analyst',
    name: '데이터 분석가',
    emoji: '📊',
    title: '데이터 분석가',
    description:
      '사기 전에 비교, 리뷰, 스펙 분석은 기본! 결정에 최소 3일은 걸리는 신중파입니다. 하지만 한번 산 물건은 절대 후회 없는 완벽한 소비를 합니다.',
    traits: ['리뷰 100개는 기본', '스펙 비교표 제작', '결정장애 아닌 신중함'],
    color: '#45B7D1',
    gradient: 'from-cyan-400 to-blue-500',
  },
  giver: {
    id: 'giver',
    name: '관계 투자자',
    emoji: '🎁',
    title: '관계 투자자',
    description:
      '내 것보다 남 주는 데 더 쓰는 따뜻한 마음의 소유자! 선물의 달인이자, 주변 사람들의 행복이 곧 나의 행복인 타입. 인간관계에 투자하는 현명한 소비자예요.',
    traits: ['선물 고르기 장인', '밥값은 내가 쏨', '주변 사람 생일 다 기억'],
    color: '#FF8A65',
    gradient: 'from-orange-400 to-amber-500',
  },
  planner: {
    id: 'planner',
    name: '미래 설계자',
    emoji: '🏦',
    title: '미래 설계자',
    description:
      '저축이 취미이자 특기인 미래지향형 타입! 적금 3개 이상은 기본이고, 소비는 투자의 적이라 생각합니다. 안정적인 미래를 위해 오늘의 소비를 절제하는 의지의 한국인.',
    traits: ['적금 3개 이상 보유', '가계부 앱 매일 기록', '노후 대비 이미 시작'],
    color: '#66BB6A',
    gradient: 'from-green-400 to-emerald-600',
  },
  explorer: {
    id: 'explorer',
    name: '경험 수집가',
    emoji: '✈️',
    title: '경험 수집가',
    description:
      '물건보다 경험에 투자하는 타입! 여행, 맛집, 공연에 아낌없이 쓰는 경험주의자입니다. 소유보다 경험이 더 큰 가치라고 믿으며, 추억을 사는 데 돈을 아끼지 않아요.',
    traits: ['여행 적금 별도 운영', '맛집 리스트 200개+', '페스티벌은 무조건 참여'],
    color: '#FFD93D',
    gradient: 'from-yellow-400 to-orange-400',
  },
  stress: {
    id: 'stress',
    name: '스트레스 해소러',
    emoji: '🍕',
    title: '스트레스 해소러',
    description:
      '힘들면 지르는 감정 소비 타입! 야식, 쇼핑이 최고의 힐링이라 생각합니다. 스트레스를 돈으로 해결하지만, 그만큼 자기 자신을 소중히 여기는 사람이에요.',
    traits: ['야식은 치유의 맛', '기분 전환용 쇼핑', '자기 위로 전문가'],
    color: '#FF7EB3',
    gradient: 'from-pink-400 to-rose-500',
  },
};

export const questions: Question[] = [
  {
    id: 1,
    text: '월급이 들어왔다! 첫 번째로 하는 행동은?',
    options: [
      {
        text: '위시리스트에 담아둔 거 바로 결제 🔥',
        scores: { flex: 2 },
      },
      {
        text: '적금 자동이체 확인하고 남은 금액 계산',
        scores: { planner: 2 },
      },
      {
        text: '이번 달 할인 행사 뭐 있나 체크',
        scores: { value: 2 },
      },
      {
        text: '친구들한테 "밥 쏠게~" 연락',
        scores: { giver: 2 },
      },
    ],
  },
  {
    id: 2,
    text: '친구 생일 선물을 고르는 나의 방식은?',
    options: [
      {
        text: '평소에 갖고 싶다고 한 거 기억해뒀다가 선물',
        scores: { giver: 2 },
      },
      {
        text: '요즘 SNS에서 핫한 예쁜 걸로 골라줌',
        scores: { aesthetic: 2 },
      },
      {
        text: '가격 대비 만족도 높은 실용적인 선물',
        scores: { value: 1, analyst: 1 },
      },
      {
        text: '같이 맛집이나 놀러 가는 경험을 선물',
        scores: { explorer: 2 },
      },
    ],
  },
  {
    id: 3,
    text: '카페에 갔다. 메뉴 고르는 기준은?',
    options: [
      {
        text: '제일 비싼 시그니처 메뉴 도전!',
        scores: { flex: 1, explorer: 1 },
      },
      {
        text: '인테리어가 예뻐서 여기 온 거임. 포토제닉한 메뉴',
        scores: { aesthetic: 2 },
      },
      {
        text: '아메리카노가 가성비 최고지',
        scores: { value: 2 },
      },
      {
        text: '리뷰 좋은 메뉴 검색해서 주문',
        scores: { analyst: 2 },
      },
    ],
  },
  {
    id: 4,
    text: '스트레스 만땅인 날, 나의 해소법은?',
    options: [
      {
        text: '일단 배달 앱 켜고 야식부터 시킨다',
        scores: { stress: 2 },
      },
      {
        text: '쇼핑몰 들어가서 장바구니 폭격',
        scores: { stress: 1, flex: 1 },
      },
      {
        text: '통장 잔고 보면서 마음의 안정을 찾는다',
        scores: { planner: 2 },
      },
      {
        text: '친구 불러서 맛집 가자고 한다',
        scores: { explorer: 1, giver: 1 },
      },
    ],
  },
  {
    id: 5,
    text: '여행 계획을 세울 때 나는?',
    options: [
      {
        text: '예쁜 숙소랑 카페 위주로 코스 짠다',
        scores: { aesthetic: 2 },
      },
      {
        text: '최저가 항공권, 숙소 가격 비교가 먼저',
        scores: { value: 1, analyst: 1 },
      },
      {
        text: '즉흥적으로 "내일 출발!" 스타일',
        scores: { flex: 1, explorer: 1 },
      },
      {
        text: '여행 적금 깨서 제대로 즐긴다',
        scores: { explorer: 2 },
      },
    ],
  },
  {
    id: 6,
    text: '대형 세일 기간이 왔다! 나의 반응은?',
    options: [
      {
        text: '미리 위시리스트 정리해두고 오픈런 한다',
        scores: { value: 2 },
      },
      {
        text: '세일이든 아니든 필요하면 산다',
        scores: { flex: 2 },
      },
      {
        text: '정말 필요한 건지 3일 고민 후 결정',
        scores: { analyst: 1, planner: 1 },
      },
      {
        text: '주변 사람들 필요한 거 물어보고 같이 주문',
        scores: { giver: 2 },
      },
    ],
  },
  {
    id: 7,
    text: '배달 앱을 열었을 때 나의 패턴은?',
    options: [
      {
        text: '기분에 따라 먹고 싶은 거 바로 주문',
        scores: { stress: 1, flex: 1 },
      },
      {
        text: '할인 쿠폰부터 확인. 쿠폰 있는 데서 시킨다',
        scores: { value: 2 },
      },
      {
        text: '리뷰 평점 4.5 이상만 필터링',
        scores: { analyst: 2 },
      },
      {
        text: '혼자 안 먹음. 같이 먹을 사람부터 찾는다',
        scores: { giver: 1, explorer: 1 },
      },
    ],
  },
  {
    id: 8,
    text: '친구가 "이거 좀 비싸긴 한데 같이 살래?" 할 때?',
    options: [
      {
        text: '"ㅇㅋ 바로 결제 ㄱ"',
        scores: { flex: 2 },
      },
      {
        text: '"잠깐, 다른 데 더 싼 데 없나 볼게"',
        scores: { value: 1, analyst: 1 },
      },
      {
        text: '"이번 달 예산 초과라 다음에..."',
        scores: { planner: 2 },
      },
      {
        text: '"요즘 힘들었잖아, 그냥 내가 쏠게"',
        scores: { giver: 1, stress: 1 },
      },
    ],
  },
  {
    id: 9,
    text: '통장 잔고를 확인하는 빈도는?',
    options: [
      {
        text: '거의 안 봄. 모르는 게 약이다',
        scores: { flex: 1, stress: 1 },
      },
      {
        text: '매일 확인. 가계부도 쓴다',
        scores: { planner: 2 },
      },
      {
        text: '뭔가 사기 전에만 확인',
        scores: { analyst: 1, value: 1 },
      },
      {
        text: '잔고보다 이번 달 경험 리스트가 중요',
        scores: { explorer: 2 },
      },
    ],
  },
  {
    id: 10,
    text: '나의 소비 인생 좌우명은?',
    options: [
      {
        text: '"인생은 한 번뿐이다. 즐기자!" 🎉',
        scores: { flex: 1, explorer: 1 },
      },
      {
        text: '"아끼는 게 버는 거다" 💪',
        scores: { value: 1, planner: 1 },
      },
      {
        text: '"예쁘게 살자, 예쁜 것을 사자" ✨',
        scores: { aesthetic: 2 },
      },
      {
        text: '"힘들 땐 나한테 투자하는 거야" 💆',
        scores: { stress: 2 },
      },
    ],
  },
];
