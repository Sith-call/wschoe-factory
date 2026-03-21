import type { DiagnosisResult, Challenge, Category, SpendingType } from './types';
import { spendingTypes, categoryToSpendingType, wasteMultipliers } from './data/types';

const KEYS = {
  diagnosis: 'spending-reform:diagnosis',
  challenges: 'spending-reform:challenges',
  previousDiagnosis: 'spending-reform:previousDiagnosis',
} as const;

// --- Storage helpers (localStorage fallback for SDK) ---

export function saveDiagnosis(result: DiagnosisResult): void {
  localStorage.setItem(KEYS.diagnosis, JSON.stringify(result));
}

export function getDiagnosis(): DiagnosisResult | null {
  const raw = localStorage.getItem(KEYS.diagnosis);
  return raw ? JSON.parse(raw) : null;
}

export function savePreviousDiagnosis(result: DiagnosisResult): void {
  localStorage.setItem(KEYS.previousDiagnosis, JSON.stringify(result));
}

export function getPreviousDiagnosis(): DiagnosisResult | null {
  const raw = localStorage.getItem(KEYS.previousDiagnosis);
  return raw ? JSON.parse(raw) : null;
}

export function getChallenges(): Challenge[] {
  const raw = localStorage.getItem(KEYS.challenges);
  return raw ? JSON.parse(raw) : [];
}

export function saveChallenges(challenges: Challenge[]): void {
  localStorage.setItem(KEYS.challenges, JSON.stringify(challenges));
}

export function getActiveChallenge(): Challenge | null {
  const challenges = getChallenges();
  return challenges.find((c) => c.status === 'active') || null;
}

export function saveChallenge(challenge: Challenge): void {
  const challenges = getChallenges();
  const idx = challenges.findIndex((c) => c.id === challenge.id);
  if (idx >= 0) {
    challenges[idx] = challenge;
  } else {
    challenges.unshift(challenge);
  }
  saveChallenges(challenges);
}

export function checkIn(challengeId: string, day: number, success: boolean): Challenge | null {
  const challenges = getChallenges();
  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge) return null;

  const today = new Date().toISOString().split('T')[0];
  const existingIdx = challenge.checkIns.findIndex((ci) => ci.day === day);
  if (existingIdx >= 0) {
    challenge.checkIns[existingIdx] = { date: today, day, success };
  } else {
    challenge.checkIns.push({ date: today, day, success });
  }

  if (challenge.checkIns.length >= 7) {
    challenge.status = 'completed';
  }

  saveChallenges(challenges);
  return challenge;
}

// --- Calculation helpers ---

export function calculateScores(answers: number[]): Record<Category, number> {
  const categoryMap: Category[] = [
    'cafe', 'delivery', 'shopping', 'subscription', 'transport', 'nightlife',
    'cafe', 'delivery', 'shopping', 'subscription', 'transport', 'nightlife',
  ];

  const scores: Record<Category, number> = {
    cafe: 0, delivery: 0, shopping: 0, subscription: 0, transport: 0, nightlife: 0,
  };

  answers.forEach((answer, idx) => {
    const cat = categoryMap[idx];
    scores[cat] += answer;
  });

  return scores;
}

export function calculateType(scores: Record<Category, number>): SpendingType {
  let maxCategory: Category = 'cafe';
  let maxScore = 0;

  const entries = Object.entries(scores) as [Category, number][];
  for (const [cat, score] of entries) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = cat;
    }
  }

  return categoryToSpendingType(maxCategory) as SpendingType;
}

export function calculateWaste(scores: Record<Category, number>): number {
  // Sort categories by score, take top 3, sum their waste
  const entries = Object.entries(scores) as [Category, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const top3 = entries.slice(0, 3);

  let total = 0;
  for (const [cat, score] of top3) {
    total += score * (wasteMultipliers[cat] || 1);
  }

  return Math.round(total);
}

export function createChallenge(diagnosis: DiagnosisResult): Challenge {
  const typeInfo = spendingTypes[diagnosis.type];
  const categoryForType: Record<SpendingType, Category> = {
    cafe: 'cafe',
    delivery: 'delivery',
    impulse: 'shopping',
    subscription: 'subscription',
    taxi: 'transport',
    nightlife: 'nightlife',
  };

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
    type: diagnosis.type,
    title: typeInfo.challengeTitle,
    rule: typeInfo.challengeRule,
    dailySaving: typeInfo.dailySaving,
    targetSaving: typeInfo.targetSaving,
    startDate: new Date().toISOString().split('T')[0],
    checkIns: [],
    status: 'active',
    beforeScore: diagnosis.scores[categoryForType[diagnosis.type]],
  };
}

export function getCurrentDay(challenge: Challenge): number {
  const start = new Date(challenge.startDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diff, 0), 6);
}

export function getStreak(challenge: Challenge): number {
  let streak = 0;
  const sorted = [...challenge.checkIns].sort((a, b) => b.day - a.day);
  for (const ci of sorted) {
    if (ci.success) streak++;
    else break;
  }
  return streak;
}

export function getSuccessCount(challenge: Challenge): number {
  return challenge.checkIns.filter((ci) => ci.success).length;
}

export function getSavedAmount(challenge: Challenge): number {
  return getSuccessCount(challenge) * challenge.dailySaving;
}

export function getTotalSaved(): number {
  const challenges = getChallenges();
  return challenges
    .filter((c) => c.status === 'completed')
    .reduce((sum, c) => sum + getSavedAmount(c), 0);
}

export function hasCheckedInToday(challenge: Challenge): boolean {
  const currentDay = getCurrentDay(challenge);
  return challenge.checkIns.some((ci) => ci.day === currentDay);
}

// --- Demo data ---

export function getDemoData(): { diagnosis: DiagnosisResult; challenge: Challenge } {
  const diagnosis: DiagnosisResult = {
    type: 'cafe',
    scores: { cafe: 7, delivery: 5, shopping: 4, subscription: 3, transport: 6, nightlife: 4 },
    estimatedWaste: 32,
    completedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  };

  const challenge: Challenge = {
    id: 'demo-challenge-1',
    type: 'cafe',
    title: '7일 카페 절약 챌린지',
    rule: '7일 동안 카페 방문을 3회 이하로 줄여보세요',
    dailySaving: 5000,
    targetSaving: 35000,
    startDate: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    checkIns: [
      { date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], day: 0, success: true },
      { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], day: 1, success: true },
      { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], day: 2, success: false },
      { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], day: 3, success: true },
    ],
    status: 'active',
    beforeScore: 7,
  };

  return { diagnosis, challenge };
}
