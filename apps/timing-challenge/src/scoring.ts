import { ChallengeType } from './types';

export function getTimingRating(deviationSec: number): { label: string; tier: number } {
  const abs = Math.abs(deviationSec);
  if (abs <= 0.05) return { label: '신의 영역', tier: 5 };
  if (abs <= 0.2) return { label: '거의 완벽', tier: 4 };
  if (abs <= 0.5) return { label: '좋아요', tier: 3 };
  if (abs <= 1.0) return { label: '아쉬워요', tier: 2 };
  return { label: '다시 해봐요', tier: 1 };
}

export function getReactionRating(ms: number): { label: string; tier: number } {
  if (ms < 150) return { label: '초인', tier: 5 };
  if (ms < 200) return { label: '번개', tier: 4 };
  if (ms < 250) return { label: '빠름', tier: 3 };
  if (ms < 350) return { label: '보통', tier: 2 };
  return { label: '졸았나요?', tier: 1 };
}

export function getTapRating(tapCount: number): { label: string; tier: number } {
  const diff = Math.abs(tapCount - 10);
  if (diff === 0) return { label: '완벽!', tier: 5 };
  if (diff === 1) return { label: '거의!', tier: 4 };
  if (diff === 2) return { label: '아깝다', tier: 3 };
  if (diff === 3) return { label: '흠...', tier: 2 };
  return { label: '연습이 필요해요', tier: 1 };
}

export function calculateScore(type: ChallengeType, value: number): number {
  switch (type) {
    case 'five-seconds': {
      const dev = Math.abs(value - 5000) / 1000;
      return Math.max(0, Math.round(100 - dev * 20));
    }
    case 'reaction': {
      if (value < 100) return 100;
      if (value > 500) return Math.max(0, Math.round(100 - (value - 100) * 0.2));
      return Math.max(0, Math.round(100 - (value - 100) * 0.25));
    }
    case 'ten-taps': {
      const diff = Math.abs(value - 10);
      return Math.max(0, Math.round(100 - diff * 15));
    }
    case 'three-hold': {
      const dev = Math.abs(value - 3000) / 1000;
      return Math.max(0, Math.round(100 - dev * 25));
    }
  }
}

export function getRatingStyle(tier: number): { bg: string; text: string } {
  switch (tier) {
    case 5:
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 4:
      return { bg: 'bg-rose-50', text: 'text-rose-600' };
    case 3:
      return { bg: 'bg-slate-100', text: 'text-slate-600' };
    case 2:
      return { bg: 'bg-amber-50', text: 'text-amber-700' };
    default:
      return { bg: 'bg-rose-50', text: 'text-rose-500' };
  }
}

export function formatBestValue(type: ChallengeType, value: number): string {
  switch (type) {
    case 'five-seconds':
      return (value / 1000).toFixed(3) + '초';
    case 'reaction':
      return Math.round(value) + 'ms';
    case 'ten-taps':
      return value + '번';
    case 'three-hold':
      return (value / 1000).toFixed(3) + '초';
  }
}
