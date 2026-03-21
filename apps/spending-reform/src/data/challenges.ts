export const encourageMessagesSuccess = [
  '오늘도 성공! 절약한 돈으로 뭐 할 거예요?',
  '습관이 바뀌고 있어요. 당신은 대단해요!',
  '이 페이스 유지하면 한 달에 큰 돈을 아껴요.',
  '작은 실천이 큰 변화를 만들어요!',
  '오늘 하루도 잘 버텼어요. 자랑스러워요!',
];

export const encourageMessagesFail = [
  '괜찮아요, 내일 다시 도전해봐요!',
  '포기하지 마세요. 인식하는 것이 변화의 시작이에요.',
  '완벽하지 않아도 괜찮아요. 계속하는 게 중요해요.',
  '실패는 성장의 일부예요. 내일은 더 잘할 수 있어요!',
];

export const failTips: Record<string, string[]> = {
  cafe: [
    '내일은 카페 대신 텀블러에 커피를 내려보세요',
    '카페 앱 알림을 꺼두면 유혹이 줄어요',
    '동료에게 "오늘은 카페 패스!"라고 선언해보세요',
  ],
  delivery: [
    '내일 점심은 편의점 도시락으로 도전해보세요',
    '배달 앱을 홈 화면에서 폴더 안으로 숨겨보세요',
    '냉동실에 비상 식량 하나만 넣어두면 유혹을 이겨요',
  ],
  impulse: [
    '장바구니에 넣고 앱을 닫아보세요, 내일 다시 확인!',
    '사고 싶은 물건 가격만큼 저금통에 넣어보세요',
    '쇼핑 앱 알림을 끄면 충동이 절반으로 줄어요',
  ],
  subscription: [
    '지금 바로 구독 목록을 열어 마지막 사용일을 확인하세요',
    '무료 체험 끝나기 전에 달력에 해지 알림을 설정하세요',
    '비슷한 서비스끼리 묶어서 하나만 남겨보세요',
  ],
  taxi: [
    '내일 약속 시간 10분 일찍 출발해보세요',
    '지하철역까지 걸으면 운동도 되고 택시비도 절약!',
    '비 올 때만 택시 타기로 규칙을 정해보세요',
  ],
  nightlife: [
    '다음 모임은 카페나 영화관으로 제안해보세요',
    '2차 안 가기만 해도 한 번에 5만원 절약이에요',
    '무알콜 음료를 주문해보세요, 의외로 재밌어요',
  ],
};

export const completionMessages: Record<string, { rating: string; message: string }> = {
  '7': { rating: '완벽한 한 주!', message: '당신은 진정한 절약 마스터!' },
  '6': { rating: '거의 완벽해요!', message: '이 정도면 습관 변화 시작!' },
  '5': { rating: '거의 완벽해요!', message: '이 정도면 습관 변화 시작이에요.' },
  '4': { rating: '절반 이상 성공!', message: '대단한 첫 걸음이에요.' },
  '3': { rating: '절반 이상 성공!', message: '대단한 첫 걸음이에요.' },
  '2': { rating: '도전한 것 자체가 대단해요.', message: '다음에 더 잘할 수 있어요.' },
  '1': { rating: '도전한 것 자체가 대단해요.', message: '다음에 더 잘할 수 있어요.' },
  '0': { rating: '괜찮아요.', message: '인식하는 것이 변화의 시작이에요.' },
};

export function getCompletionMessage(successDays: number): { rating: string; message: string } {
  return completionMessages[String(successDays)] || completionMessages['0'];
}
