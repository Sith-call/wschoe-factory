import { format, subDays } from 'date-fns';
import type { GratitudeEntry } from '../types';
import { setEntriesBulk, getAllEntries } from './storage';

const SAMPLE_ITEMS: string[][] = [
  [
    '아침에 마신 따뜻한 커피가 좋았다',
    '동료가 코드리뷰를 꼼꼼히 해줬다',
    '퇴근길 벚꽃이 예뻤다',
  ],
  [
    '엄마랑 통화해서 마음이 따뜻했다',
    '점심에 먹은 김치찌개가 맛있었다',
    '오후에 잠깐 산책해서 기분 전환됐다',
  ],
  [
    '친구가 응원 메시지를 보내줬다',
    '좋아하는 노래를 들으며 출근했다',
    '오늘 회의에서 내 의견이 반영됐다',
  ],
  [
    '집 근처 빵집에서 새 빵을 발견했다',
    '저녁에 좋아하는 드라마를 봤다',
    '비 온 뒤 공기가 맑아서 상쾌했다',
  ],
  [
    '후배가 고맙다고 말해줬다',
    '점심에 동료들과 웃으며 밥 먹었다',
    '퇴근 후 요가로 몸이 풀렸다',
  ],
  [
    '아침 햇살이 따뜻해서 기분 좋았다',
    '오랜만에 책을 한 챕터 읽었다',
    '건강하게 하루를 보낸 것에 감사하다',
  ],
  [
    '주말에 맛있는 브런치를 먹었다',
    '가족과 함께 시간을 보냈다',
    '좋아하는 카페에서 여유를 즐겼다',
  ],
  [
    '새로 산 운동화가 편해서 좋았다',
    '동네 고양이를 만나서 기분이 좋았다',
    '잠을 푹 자서 개운했다',
  ],
  [
    '프로젝트가 무사히 마무리됐다',
    '팀원들이 수고했다고 박수쳐줬다',
    '퇴근 후 치맥이 맛있었다',
  ],
  [
    '오늘 날씨가 화창해서 기분 좋았다',
    '점심에 새로운 식당을 발견했다',
    '택배가 빨리 와서 기뻤다',
  ],
  [
    '아이가 그림을 그려줬다',
    '남편이 저녁을 차려줬다',
    '따뜻한 물로 샤워하니 피로가 풀렸다',
  ],
  [
    '버스를 딱 맞춰 탔다',
    '좋아하는 팟캐스트 새 에피소드가 나왔다',
    '마감을 여유있게 맞출 수 있었다',
  ],
  [
    '동료가 커피를 사줬다',
    '오랜 친구에게 연락이 왔다',
    '저녁 노을이 아름다웠다',
  ],
  [
    '새로운 기술을 배워서 뿌듯했다',
    '건강검진 결과가 좋게 나왔다',
    '집에서 만든 파스타가 맛있었다',
  ],
  [
    '아침 조깅을 했더니 하루가 활기찼다',
    '동생이 안부를 물어봐줬다',
    '좋은 책 추천을 받았다',
  ],
  [
    '회사에서 칭찬을 받았다',
    '점심에 먹은 된장찌개가 집밥 같았다',
    '퇴근 후 공원에서 벤치에 앉아 쉬었다',
  ],
  [
    '어려운 문제를 해결해서 뿌듯했다',
    '편의점 새 아이스크림이 맛있었다',
    '잠들기 전 고양이가 옆에 와줬다',
  ],
  [
    '오늘 하루 무탈하게 지나서 감사하다',
    '맛있는 과일을 먹었다',
    '좋은 꿈을 꿨다',
  ],
  [
    '친구와 오랜만에 밥을 먹었다',
    '새 프로젝트가 재미있을 것 같다',
    '오후에 간식으로 먹은 호떡이 맛있었다',
  ],
  [
    '아침에 새소리를 들으며 일어났다',
    '동료가 도움을 줘서 일이 빨리 끝났다',
    '저녁에 따뜻한 차를 마시며 쉬었다',
  ],
  [
    '주말 계획을 세워서 설렌다',
    '맛있는 라떼를 마셨다',
    '가족이 건강해서 감사하다',
  ],
];

export function generateDemoData(): void {
  const existing = getAllEntries();
  const today = new Date();
  const daysToGenerate = 14 + Math.floor(Math.random() * 8); // 14-21 days
  const entries: GratitudeEntry[] = [...existing];

  for (let i = 0; i < daysToGenerate; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    if (entries.some((e) => e.date === date)) continue;

    const sampleIndex = i % SAMPLE_ITEMS.length;
    const ts = subDays(today, i).toISOString();

    entries.push({
      id: date,
      date,
      items: [...SAMPLE_ITEMS[sampleIndex]],
      createdAt: ts,
      updatedAt: ts,
    });
  }

  setEntriesBulk(entries);
}
