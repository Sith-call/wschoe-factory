import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    emoji: '🌅',
    question: '아침 기상 시간은?',
    category: '자기관리',
    options: [
      { text: '5시 반, 새벽 운동 후 출근', value: 50, reaction: '미쳤다... 존경합니다 🫡' },
      { text: '7시, 적당히 여유있게', value: 30, reaction: '건강한 사회인이시네요 👍' },
      { text: '8시 50분, 지각 3분 전', value: 15, reaction: '슬리퍼 신고 뛰어가는 중? 🏃' },
      { text: '출근 시간이 곧 기상 시간', value: 5, reaction: '재택근무의 품격 😎' },
    ],
  },
  {
    id: 2,
    emoji: '🍱',
    question: '점심시간 활용법은?',
    category: '성장가능성',
    options: [
      { text: '자기계발 (독서, 공부)', value: 45, reaction: '점심시간에도 성장하시는군요 📚' },
      { text: '맛집 탐방', value: 30, reaction: '인생은 먹기 위해 사는 것 🍽️' },
      { text: '낮잠', value: 20, reaction: '오후 업무 효율 200% 😴' },
      { text: '유튜브 + 쇼핑', value: 10, reaction: '솔직함에 +10점 📱' },
    ],
  },
  {
    id: 3,
    emoji: '💻',
    question: '엑셀 능력은 어느 정도?',
    category: '업무능력',
    options: [
      { text: 'VBA 매크로까지 짠다', value: 50, reaction: '회사에서 마법사 취급 🧙' },
      { text: 'VLOOKUP, 피벗테이블 가능', value: 35, reaction: '실무의 정석 💪' },
      { text: 'SUM이랑 필터 정도', value: 15, reaction: '충분합니다 사실 🙂' },
      { text: '엑셀이 뭐예요?', value: 5, reaction: '구글 시트 세대 🤷' },
    ],
  },
  {
    id: 4,
    emoji: '🍺',
    question: '회식 때 나의 역할은?',
    category: '사회성',
    options: [
      { text: '분위기 메이커', value: 40, reaction: '당신이 없으면 회식이 아님 🎤' },
      { text: '경청러, 리액션 장인', value: 30, reaction: '조용하지만 없으면 허전한 🤗' },
      { text: '1차만 참석하고 칼퇴', value: 20, reaction: '워라밸의 정석 🚶' },
      { text: '불참왕', value: 10, reaction: '전설의 유령 사원 👻' },
    ],
  },
  {
    id: 5,
    emoji: '😤',
    question: '스트레스 해소법은?',
    category: '자기관리',
    options: [
      { text: '운동/명상', value: 40, reaction: '자기관리 S급 🧘' },
      { text: '맛있는 거 먹기', value: 30, reaction: '칼로리는 사랑입니다 🍰' },
      { text: '쇼핑 폭탄', value: 15, reaction: '통장이 텅장 💸' },
      { text: '퇴사 상상하기', value: 10, reaction: '매일 마음속으로 사직서 📝' },
    ],
  },
  {
    id: 6,
    emoji: '📧',
    question: '이메일 답장 속도는?',
    category: '업무능력',
    options: [
      { text: '5분 이내 즉답', value: 45, reaction: '인간 알림 센터 🔔' },
      { text: '업무 시간 내 답변', value: 30, reaction: '프로페셔널 💼' },
      { text: '다음 날 오전', value: 15, reaction: '바쁜 척의 달인 🎭' },
      { text: '읽씹 후 까먹음', value: 5, reaction: '읽씹은 예술이다 🎨' },
    ],
  },
  {
    id: 7,
    emoji: '🏠',
    question: '퇴근 후 시간은 어떻게?',
    category: '성장가능성',
    options: [
      { text: '사이드 프로젝트/공부', value: 45, reaction: '미래의 CEO 🚀' },
      { text: '취미활동 (운동, 악기 등)', value: 35, reaction: '인생이 풍요로운 🎸' },
      { text: '넷플릭스 정주행', value: 20, reaction: '오늘도 에피소드 3개 🍿' },
      { text: '침대와 하나가 됨', value: 5, reaction: '이불 밖은 위험해 🛏️' },
    ],
  },
  {
    id: 8,
    emoji: '💰',
    question: '연봉 협상 스타일은?',
    category: '재테크감각',
    options: [
      { text: '데이터 기반 논리적 설득', value: 50, reaction: 'HR이 떨고 있다 📊' },
      { text: '업계 평균 들이밀기', value: 30, reaction: '기본에 충실 📋' },
      { text: '그냥 감사히 받기', value: 10, reaction: '착한 사람 세금 😇' },
      { text: '입 다물고 이직', value: 40, reaction: '실전 협상의 정석 🤐' },
    ],
  },
  {
    id: 9,
    emoji: '☕',
    question: '카페에서 주로 주문하는 것은?',
    category: '재테크감각',
    options: [
      { text: '아메리카노 (얼죽아)', value: 25, reaction: '한국 직장인의 기본 ☕' },
      { text: '라떼/프라푸치노', value: 20, reaction: '달달한 위로가 필요해 🧋' },
      { text: '차 종류', value: 30, reaction: '차분한 선비 스타일 🍵' },
      { text: '안 마심, 물이 최고', value: 35, reaction: '건강 자산 극대화 💧' },
    ],
  },
  {
    id: 10,
    emoji: '🔮',
    question: '미래 계획은?',
    category: '성장가능성',
    options: [
      { text: '5년 뒤 창업 예정', value: 50, reaction: '비전이 있는 사람 🌟' },
      { text: '현 직장에서 승진 목표', value: 35, reaction: '안정적 성장파 📈' },
      { text: '어디서든 먹고살 수 있게', value: 25, reaction: '유연한 생존주의자 🦎' },
      { text: '계획? 일단 오늘을 살자', value: 10, reaction: '현재에 충실한 철학자 🧘' },
    ],
  },
];
