export const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
] as const;

export type MbtiType = typeof MBTI_TYPES[number];

export interface TypeInfo {
  label: string;
  nickname: string;
  funFact: string;
}

export const TYPE_INFO: Record<MbtiType, TypeInfo> = {
  INTJ: { label: 'INTJ', nickname: '용의주도한 전략가', funFact: '전체 인구의 2%만 INTJ. 체스 그랜드마스터 중 가장 많은 유형.' },
  INTP: { label: 'INTP', nickname: '논리적인 사색가', funFact: '아인슈타인이 대표적 INTP. 밤에 가장 생산적인 유형.' },
  ENTJ: { label: 'ENTJ', nickname: '대담한 통솔자', funFact: 'CEO 중 가장 많은 유형. "비효율"이라는 단어를 가장 싫어함.' },
  ENTP: { label: 'ENTP', nickname: '뜨거운 논쟁가', funFact: '토론에서 상대편 입장도 즐겨 대변. 아이디어 생성 속도가 가장 빠름.' },
  INFJ: { label: 'INFJ', nickname: '선의의 옹호자', funFact: '가장 희귀한 유형(1%). 상대방의 거짓말을 가장 잘 감지.' },
  INFP: { label: 'INFP', nickname: '열정적인 중재자', funFact: '작가/시인 중 가장 많은 유형. 머릿속에 항상 배경음악이 흐름.' },
  ENFJ: { label: 'ENFJ', nickname: '정의로운 사회운동가', funFact: '타인의 잠재력을 가장 잘 끌어내는 유형. 갈등 중재의 달인.' },
  ENFP: { label: 'ENFP', nickname: '재기발랄한 활동가', funFact: '새 취미 시작률 1위, 완주율은 비밀. 에너지 드링크 없이도 항상 하이텐션.' },
  ISTJ: { label: 'ISTJ', nickname: '청렴결백한 논리주의자', funFact: '약속 시간 5분 전 도착률 1위. 엑셀 시트를 사랑하는 유형.' },
  ISFJ: { label: 'ISFJ', nickname: '용감한 수호자', funFact: '가장 많은 비율을 차지하는 유형 중 하나. 냉장고 정리의 달인.' },
  ESTJ: { label: 'ESTJ', nickname: '엄격한 관리자', funFact: '조별과제에서 자동 조장이 되는 유형. 규칙 없는 게임은 못 참음.' },
  ESFJ: { label: 'ESFJ', nickname: '사교적인 외교관', funFact: '생일을 절대 잊지 않는 유형. 단톡방 분위기 메이커.' },
  ISTP: { label: 'ISTP', nickname: '만능 재주꾼', funFact: '위기 상황에서 가장 침착한 유형. 설명서 없이 가구 조립 가능.' },
  ISFP: { label: 'ISFP', nickname: '호기심 많은 예술가', funFact: '감각적 취향이 독보적. 플레이리스트 큐레이션 능력 최상위.' },
  ESTP: { label: 'ESTP', nickname: '모험을 즐기는 사업가', funFact: '즉흥 여행 계획률 1위. "일단 해보자"가 인생 모토.' },
  ESFP: { label: 'ESFP', nickname: '자유로운 영혼의 연예인', funFact: '파티 분위기를 200% 끌어올리는 유형. 지루함 알레르기 보유.' },
};

// Golden pairs with specific scores
const GOLDEN_PAIRS: Record<string, number> = {
  'INTJ-ENFP': 95,
  'INFJ-ENTP': 93,
  'INFP-ENFJ': 92,
  'INTP-ENTJ': 91,
  'ISTJ-ESFP': 88,
  'ISFJ-ESTP': 87,
  'ISTP-ESFJ': 86,
  'ISFP-ESTJ': 85,
};

function pairKey(a: MbtiType, b: MbtiType): string {
  return [a, b].sort().join('-');
}

function sharedLetters(a: MbtiType, b: MbtiType): number {
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (a[i] === b[i]) count++;
  }
  return count;
}

export function getCompatibilityScore(a: MbtiType, b: MbtiType): number {
  if (a === b) return 75;

  const key = pairKey(a, b);
  if (GOLDEN_PAIRS[key] !== undefined) return GOLDEN_PAIRS[key];

  const shared = sharedLetters(a, b);

  if (shared === 3) {
    // Similar types: 70-80
    return 70 + Math.floor(Math.random() * 0) + (a.charCodeAt(0) + b.charCodeAt(0)) % 11;
  }

  if (shared === 0) {
    // Opposite types: 40-55
    return 40 + (a.charCodeAt(1) + b.charCodeAt(1)) % 16;
  }

  if (shared === 2) {
    return 58 + (a.charCodeAt(2) + b.charCodeAt(2)) % 14;
  }

  // shared === 1
  return 50 + (a.charCodeAt(3) + b.charCodeAt(3)) % 15;
}

// Deterministic score (remove randomness from shared=3 case)
export function getScore(a: MbtiType, b: MbtiType): number {
  if (a === b) return 75;

  const key = pairKey(a, b);
  if (GOLDEN_PAIRS[key] !== undefined) return GOLDEN_PAIRS[key];

  const shared = sharedLetters(a, b);

  if (shared === 3) {
    return 70 + (a.charCodeAt(0) + b.charCodeAt(0)) % 11;
  }
  if (shared === 0) {
    return 40 + (a.charCodeAt(1) + b.charCodeAt(1)) % 16;
  }
  if (shared === 2) {
    return 58 + (a.charCodeAt(2) + b.charCodeAt(2)) % 14;
  }
  return 50 + (a.charCodeAt(3) + b.charCodeAt(3)) % 15;
}

export interface Analysis {
  strengths: string[];
  watchOuts: string[];
  tips: string[];
}

const DETAILED_ANALYSES: Record<string, Analysis> = {
  'ENFP-INTJ': {
    strengths: [
      'ENFP의 창의성과 INTJ의 전략적 사고가 만나면 무적의 팀이 됩니다',
      'ENFP가 INTJ의 닫힌 세계를 넓혀주고, INTJ가 ENFP의 아이디어를 현실화합니다',
      '서로의 부족한 부분을 자연스럽게 채워주는 이상적 조합',
    ],
    watchOuts: [
      'INTJ의 직설적 피드백이 ENFP의 감정을 상하게 할 수 있어요',
      'ENFP의 계획 변경이 INTJ를 답답하게 만들 수 있어요',
      '갈등 해결 방식이 다름: INTJ는 논리, ENFP는 감정 우선',
    ],
    tips: [
      'INTJ는 칭찬을 먼저, 피드백은 나중에 주세요',
      'ENFP는 중요한 약속은 꼭 지켜주세요 (INTJ에게 신뢰가 핵심)',
      '주 1회 깊은 대화 시간을 정해두면 관계가 더 탄탄해져요',
    ],
  },
  'ENTP-INFJ': {
    strengths: [
      'ENTP의 지적 호기심과 INFJ의 통찰력이 끝없는 대화를 만듭니다',
      '둘 다 직관형(N)이라 추상적 주제로 밤새 토론 가능',
      'INFJ가 ENTP에게 방향성을, ENTP가 INFJ에게 유연성을 줍니다',
    ],
    watchOuts: [
      'ENTP의 논쟁 본능이 INFJ를 지치게 할 수 있어요',
      'INFJ의 감정적 니즈를 ENTP가 놓칠 수 있어요',
      '둘 다 결정을 미루는 경향이 있어 실행이 늦어질 수 있어요',
    ],
    tips: [
      'ENTP는 가끔 논쟁을 멈추고 그냥 들어주세요',
      'INFJ는 불만을 쌓지 말고 바로 표현하세요 (ENTP는 눈치 없어요)',
      '함께 새로운 경험을 하면 관계가 깊어져요',
    ],
  },
  'ENFJ-INFP': {
    strengths: [
      '둘 다 이상주의자라 가치관이 잘 맞아요',
      'ENFJ의 리더십이 INFP의 꿈을 실현시켜 줍니다',
      '감정적 유대가 매우 깊고, 서로를 진심으로 이해해요',
    ],
    watchOuts: [
      'ENFJ가 INFP를 변화시키려 할 수 있어요',
      'INFP의 혼자만의 시간 필요성을 ENFJ가 이해해야 해요',
      '둘 다 갈등을 회피하면 문제가 커질 수 있어요',
    ],
    tips: [
      'ENFJ는 INFP의 속도를 존중해주세요',
      'INFP는 ENFJ의 노력을 말로 인정해주세요',
      '각자의 혼자 시간을 보장하되, 연결 시간도 정기적으로 가져요',
    ],
  },
  'ENTJ-INTP': {
    strengths: [
      'ENTJ의 실행력과 INTP의 분석력은 최강 조합입니다',
      '지적 존중이 관계의 기반이 되어요',
      '효율적이고 생산적인 파트너십을 만들 수 있어요',
    ],
    watchOuts: [
      'ENTJ의 지배적 성향이 INTP를 압도할 수 있어요',
      'INTP의 결정 지연이 ENTJ를 답답하게 해요',
      '감정 표현이 둘 다 서툴러서 오해가 생길 수 있어요',
    ],
    tips: [
      'ENTJ는 INTP에게 생각할 시간을 주세요',
      'INTP는 결론부터 말하는 연습을 해보세요',
      '논리로 소통하되, 가끔은 감정도 꺼내보세요',
    ],
  },
  'ESFP-ISTJ': {
    strengths: [
      'ESFP의 활력이 ISTJ의 일상에 색깔을 더해줘요',
      'ISTJ의 안정감이 ESFP에게 든든한 기반이 됩니다',
      '서로의 세계를 넓혀주는 보완적 관계예요',
    ],
    watchOuts: [
      'ESFP의 즉흥성과 ISTJ의 계획성이 충돌할 수 있어요',
      'ISTJ가 ESFP를 무책임하게 느낄 수 있어요',
      '여가 활동 취향이 매우 다를 수 있어요',
    ],
    tips: [
      '주중은 ISTJ 스타일로, 주말은 ESFP 스타일로 타협해보세요',
      'ESFP는 중요한 일정은 미리 공유해주세요',
      'ISTJ는 가끔 계획 없는 하루를 즐겨보세요',
    ],
  },
  'ESTP-ISFJ': {
    strengths: [
      'ESTP의 대담함과 ISFJ의 세심함이 균형을 이뤄요',
      'ISFJ의 헌신에 ESTP가 감동받고, ESTP의 모험에 ISFJ가 설렘을 느껴요',
      '일상과 모험의 밸런스가 좋은 관계예요',
    ],
    watchOuts: [
      'ESTP의 위험 감수가 ISFJ를 불안하게 할 수 있어요',
      'ISFJ의 감정을 ESTP가 가볍게 여길 수 있어요',
      '소통 방식의 차이: ESTP는 직설, ISFJ는 간접 표현',
    ],
    tips: [
      'ESTP는 ISFJ의 걱정을 무시하지 말고 안심시켜 주세요',
      'ISFJ는 불만을 돌려 말하지 말고 솔직하게 표현해보세요',
      '서로의 방식을 존중하는 것이 핵심이에요',
    ],
  },
  'ESFJ-ISTP': {
    strengths: [
      'ESFJ의 사교성과 ISTP의 독립성이 서로에게 매력적이에요',
      'ESFJ가 사회적 연결을 담당하고, ISTP가 실용적 문제를 해결해요',
      '서로 다른 강점이 팀으로서 시너지를 내요',
    ],
    watchOuts: [
      'ESFJ의 감정 표현 요구가 ISTP를 부담스럽게 할 수 있어요',
      'ISTP의 혼자 시간 필요성을 ESFJ가 거부로 느낄 수 있어요',
      '사회적 활동 빈도에서 충돌이 있을 수 있어요',
    ],
    tips: [
      'ESFJ는 ISTP의 혼자 시간을 개인적으로 받아들이지 마세요',
      'ISTP는 가끔 ESFJ의 모임에 함께 해주세요',
      '각자의 사회적 에너지 레벨을 이해하고 존중해요',
    ],
  },
  'ESTJ-ISFP': {
    strengths: [
      'ESTJ의 체계성과 ISFP의 감성이 균형 잡힌 조합이에요',
      'ESTJ가 구조를 만들고, ISFP가 아름다움을 더해줘요',
      '현실적이면서도 감성적인 관계가 가능해요',
    ],
    watchOuts: [
      'ESTJ의 통제 욕구가 ISFP의 자유를 억압할 수 있어요',
      'ISFP의 감정 기반 결정이 ESTJ를 답답하게 할 수 있어요',
      '갈등 시 ESTJ는 맞서고 ISFP는 피하려 해요',
    ],
    tips: [
      'ESTJ는 항상 효율만 추구하지 말고 과정도 즐겨보세요',
      'ISFP는 자신의 니즈를 명확히 전달하는 연습을 해보세요',
      '서로의 결정 방식을 인정하는 것이 관계의 열쇠예요',
    ],
  },
  'ENFP-INFJ': {
    strengths: [
      '둘 다 직관형이라 깊은 대화가 자연스러워요',
      'ENFP의 열정과 INFJ의 통찰이 영감을 주고받아요',
      '가치관 중심의 깊은 유대가 형성돼요',
    ],
    watchOuts: [
      'ENFP의 에너지가 INFJ를 지치게 할 수 있어요',
      'INFJ가 ENFP의 표면적 사교를 피상적으로 느낄 수 있어요',
      '둘 다 이상이 높아 현실과의 괴리가 생길 수 있어요',
    ],
    tips: [
      'INFJ의 충전 시간을 존중해주세요',
      'ENFP는 깊이 있는 1:1 시간을 자주 만들어주세요',
      '함께 의미 있는 프로젝트를 하면 관계가 더욱 돈독해져요',
    ],
  },
  'ENTP-INTJ': {
    strengths: [
      '지적 대화의 수준이 매우 높아요',
      'ENTP의 발산적 사고와 INTJ의 수렴적 사고가 시너지를 내요',
      '서로의 독립성을 존중하는 성숙한 관계가 가능해요',
    ],
    watchOuts: [
      'ENTP의 끊임없는 아이디어 전환이 INTJ를 피곤하게 할 수 있어요',
      '둘 다 감정 표현에 서툴러 정서적 거리감이 생길 수 있어요',
      '논쟁이 승부욕으로 번질 수 있어요',
    ],
    tips: [
      '논쟁의 목적은 이기는 것이 아니라 함께 성장하는 것임을 기억하세요',
      '가끔은 논리를 내려놓고 감정적으로 연결되는 시간을 가져요',
      '서로의 프로젝트에 진심으로 관심을 가져주세요',
    ],
  },
};

export function getAnalysis(a: MbtiType, b: MbtiType): Analysis {
  const key = pairKey(a, b);
  if (DETAILED_ANALYSES[key]) return DETAILED_ANALYSES[key];

  // Generate a generic analysis based on shared letters
  const shared = sharedLetters(a, b);
  const score = getScore(a, b);

  if (a === b) {
    return {
      strengths: [
        '서로를 깊이 이해할 수 있는 관계예요',
        '같은 가치관과 생활 방식으로 갈등이 적어요',
        '말하지 않아도 통하는 부분이 많아요',
      ],
      watchOuts: [
        '같은 약점을 공유해서 보완이 어려울 수 있어요',
        '익숙함이 지루함으로 변할 수 있어요',
        '성장을 위한 자극이 부족할 수 있어요',
      ],
      tips: [
        '각자 다른 취미나 관심사를 가져보세요',
        '가끔 서로의 의견에 건설적으로 도전해보세요',
        '새로운 경험을 함께 시도하며 신선함을 유지하세요',
      ],
    };
  }

  if (score >= 85) {
    return {
      strengths: [
        '서로의 부족한 점을 자연스럽게 채워주는 관계예요',
        '다름에서 오는 매력이 강한 조합이에요',
        '함께 있으면 시너지가 나는 파트너십이에요',
      ],
      watchOuts: [
        '차이점이 초반엔 매력이지만 나중엔 갈등 원인이 될 수 있어요',
        '서로의 소통 방식 차이를 이해하는 노력이 필요해요',
        '에너지 레벨이나 사교 선호도 차이에 주의하세요',
      ],
      tips: [
        '서로의 다름을 "틀림"이 아닌 "다름"으로 받아들이세요',
        '정기적으로 깊은 대화 시간을 가져보세요',
        '갈등이 생기면 상대의 관점에서 한번 생각해보세요',
      ],
    };
  }

  if (score >= 65) {
    return {
      strengths: [
        '공통점과 차이점이 적당히 섞여 균형 잡힌 관계예요',
        '서로에게 새로운 관점을 제공해줄 수 있어요',
        '노력하면 좋은 팀워크를 만들 수 있어요',
      ],
      watchOuts: [
        '의사소통 방식의 차이를 인식하고 조율해야 해요',
        '결정을 내리는 기준이 달라 충돌이 있을 수 있어요',
        '서로의 니즈를 명확히 표현하는 것이 중요해요',
      ],
      tips: [
        '서로의 강점을 인정하고 역할 분담을 해보세요',
        '오해가 생기면 즉시 대화로 풀어보세요',
        '함께 즐길 수 있는 공통 관심사를 찾아보세요',
      ],
    };
  }

  return {
    strengths: [
      '서로 매우 다른 관점을 가지고 있어 배울 점이 많아요',
      '성공적으로 관계를 유지하면 둘 다 크게 성장해요',
      '서로에게 없는 능력을 가지고 있어 보완이 가능해요',
    ],
    watchOuts: [
      '근본적인 가치관이나 생활 방식 차이가 클 수 있어요',
      '소통 방식이 달라 오해가 자주 생길 수 있어요',
      '갈등 해결이 쉽지 않아 인내심이 많이 필요해요',
    ],
    tips: [
      '상대방의 유형 특성을 공부하고 이해하려 노력하세요',
      '서로의 경계를 존중하고 강요하지 마세요',
      '작은 공통점부터 찾아 관계의 기반을 다져보세요',
    ],
  };
}

export function getScoreLabel(score: number): { label: string; color: string; bgColor: string } {
  if (score >= 90) return { label: '최고', color: '#16a34a', bgColor: '#dcfce7' };
  if (score >= 70) return { label: '좋음', color: '#2563eb', bgColor: '#dbeafe' };
  if (score >= 50) return { label: '보통', color: '#d97706', bgColor: '#fef3c7' };
  return { label: '어려움', color: '#dc2626', bgColor: '#fee2e2' };
}
