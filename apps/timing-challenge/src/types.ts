export type ChallengeType = 'five-seconds' | 'reaction' | 'ten-taps' | 'three-hold';

export interface ChallengeResult {
  type: ChallengeType;
  value: number;
  score: number;
  playedAt: string;
}

export interface ChallengeInfo {
  type: ChallengeType;
  title: string;
  subtitle: string;
  instruction: string;
}

export const CHALLENGES: ChallengeInfo[] = [
  {
    type: 'five-seconds',
    title: '정확히 5초',
    subtitle: '머릿속으로 세어보세요',
    instruction: '시작을 누르고, 5초가 됐다고 느낄 때 멈춤을 누르세요.',
  },
  {
    type: 'reaction',
    title: '반응속도',
    subtitle: '얼마나 빠른가요?',
    instruction: '화면이 바뀌면 즉시 탭하세요.',
  },
  {
    type: 'ten-taps',
    title: '정확히 10번',
    subtitle: '세지 말고 느끼세요',
    instruction: '3초 안에 정확히 10번 탭하세요.',
  },
  {
    type: 'three-hold',
    title: '3초 홀드',
    subtitle: '감각을 믿으세요',
    instruction: '정확히 3초 동안 누르세요.',
  },
];
