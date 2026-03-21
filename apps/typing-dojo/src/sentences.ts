import type { Difficulty } from './types'

const sentences: Record<Difficulty, string[]> = {
  beginner: [
    '오늘 날씨가 좋습니다',
    '감사합니다',
    '반갑습니다',
    '좋은 하루 되세요',
    '사랑합니다',
    '행복한 하루',
    '맛있는 점심',
    '열심히 하자',
  ],
  intermediate: [
    '내일은 비가 올 것 같습니다',
    '오늘 저녁에 뭐 먹을까요',
    '주말에 영화 보러 갈까요',
    '커피 한 잔 마시고 싶어요',
    '프로그래밍은 정말 재미있다',
  ],
  advanced: [
    '인공지능 기술의 발전은 우리 삶을 크게 변화시키고 있습니다',
    '꾸준한 노력만이 성공의 비결이라는 것을 잊지 마세요',
    '새로운 도전을 두려워하지 않는 사람만이 성장할 수 있습니다',
  ],
}

export function getSentences(difficulty: Difficulty, count: number): string[] {
  const pool = sentences[difficulty]
  const result: string[] = []
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length])
  }
  return result
}
