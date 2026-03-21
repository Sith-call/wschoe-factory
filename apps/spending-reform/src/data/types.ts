import type { SpendingTypeInfo } from '../types';

export const spendingTypes: Record<string, SpendingTypeInfo> = {
  cafe: {
    type: 'cafe',
    label: '카페 중독형',
    description: '커피 없이 못 사는 당신, 라떼 한 잔이 모이면 해외여행이에요',
    challengeTitle: '7일 카페 절약 챌린지',
    challengeRule: '7일 동안 카페 방문을 3회 이하로 줄여보세요',
    dailySaving: 5000,
    targetSaving: 35000,
  },
  delivery: {
    type: 'delivery',
    label: '배달 의존형',
    description: '자취생의 생명줄, 하지만 배달비까지 합치면 외식보다 비싸요',
    challengeTitle: '7일 배달 절약 챌린지',
    challengeRule: '7일 동안 배달 주문을 2회 이하로 줄여보세요',
    dailySaving: 8000,
    targetSaving: 56000,
  },
  impulse: {
    type: 'impulse',
    label: '충동 구매형',
    description: '장바구니에 넣으면 이미 산 것 같은 당신, 24시간만 기다려봐요',
    challengeTitle: '7일 장바구니 24시간 규칙',
    challengeRule: '7일 동안 모든 온라인 구매를 24시간 기다린 후 결정하세요',
    dailySaving: 10000,
    targetSaving: 70000,
  },
  subscription: {
    type: 'subscription',
    label: '구독 과다형',
    description: '매달 자동결제되는 서비스, 정말 다 쓰고 계신가요?',
    challengeTitle: '7일 구독 정리 챌린지',
    challengeRule: '사용하지 않는 구독 서비스 1개를 해지하세요',
    dailySaving: 5000,
    targetSaving: 35000,
  },
  taxi: {
    type: 'taxi',
    label: '택시 습관형',
    description: '걸어서 10분이면 되는 거리도 택시, 합리화의 달인이에요',
    challengeTitle: '7일 대중교통 챌린지',
    challengeRule: '7일 동안 대중교통만 이용하세요',
    dailySaving: 7000,
    targetSaving: 49000,
  },
  nightlife: {
    type: 'nightlife',
    label: '유흥 올인형',
    description: '인생은 한 번뿐이라지만, 통장도 한 번뿐이에요',
    challengeTitle: '7일 절주 챌린지',
    challengeRule: '7일 동안 음주 모임을 1회 이하로 줄여보세요',
    dailySaving: 15000,
    targetSaving: 105000,
  },
};

// Map Category to SpendingType
export function categoryToSpendingType(category: string): string {
  const map: Record<string, string> = {
    cafe: 'cafe',
    delivery: 'delivery',
    shopping: 'impulse',
    subscription: 'subscription',
    transport: 'taxi',
    nightlife: 'nightlife',
  };
  return map[category] || category;
}

// Waste multipliers per category (만원 per point)
export const wasteMultipliers: Record<string, number> = {
  cafe: 1.875,
  delivery: 2.5,
  shopping: 3.125,
  subscription: 1.25,
  transport: 1.875,
  nightlife: 2.5,
};
