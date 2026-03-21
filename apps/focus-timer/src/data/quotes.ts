export interface Quote {
  text: string;
  author?: string;
}

export const quotes: Quote[] = [
  { text: '시작이 반이다' },
  { text: '고생 끝에 낙이 온다' },
  { text: '천 리 길도 한 걸음부터', author: '노자' },
  { text: '실패는 성공의 어머니다', author: '토마스 에디슨' },
  { text: '할 수 있다고 믿으면 이미 반은 이룬 것이다', author: '시어도어 루스벨트' },
  { text: '오늘 할 수 있는 일을 내일로 미루지 마라', author: '벤저민 프랭클린' },
  { text: '꿈을 크게 가져라. 작은 꿈에는 사람의 마음을 움직이는 힘이 없다', author: '괴테' },
  { text: '행동이 모든 성공의 기본 열쇠다', author: '파블로 피카소' },
  { text: '끊임없이 노력하는 것, 그것이 천재다', author: '뉴턴' },
  { text: '가장 큰 영광은 한 번도 실패하지 않음이 아니라 실패할 때마다 다시 일어서는 것이다', author: '공자' },
  { text: '성공은 매일 반복한 작은 노력의 합이다', author: '로버트 콜리어' },
  { text: '미래는 현재 우리가 무엇을 하는가에 달려 있다', author: '마하트마 간디' },
  { text: '배움에는 왕도가 없다', author: '유클리드' },
  { text: '작은 기회로부터 종종 위대한 업적이 시작된다', author: '데모스테네스' },
  { text: '될 때까지 하면 된다' },
  { text: '노력은 배신하지 않는다' },
  { text: '오늘 흘린 땀은 내일의 눈물을 막아준다' },
  { text: '포기하지 않는 한 실패는 없다', author: '마이클 조던' },
  { text: '위대한 일은 작은 일들이 모여 이루어진다', author: '빈센트 반 고흐' },
  { text: '지금 이 순간에 집중하라. 그것이 가장 큰 선물이다', author: '스티브 잡스' },
];

const SHOWN_KEY = 'focus-timer-shown-quotes';

export function getRandomQuote(): Quote {
  const shownRaw = sessionStorage.getItem(SHOWN_KEY);
  let shown: number[] = shownRaw ? JSON.parse(shownRaw) : [];

  // Reset if all shown
  if (shown.length >= quotes.length) {
    shown = [];
  }

  const available = quotes
    .map((_, i) => i)
    .filter((i) => !shown.includes(i));

  const idx = available[Math.floor(Math.random() * available.length)];
  shown.push(idx);
  sessionStorage.setItem(SHOWN_KEY, JSON.stringify(shown));

  return quotes[idx];
}
