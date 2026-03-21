import { UserAnswer, GameStats, Question, Category } from './types';
import { questions } from './data/questions';

const STORAGE_KEY = 'balance-game';

interface StoredData {
  answers: UserAnswer[];
  stats: GameStats;
}

function getStoredData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    answers: [],
    stats: { totalAnswered: 0, streak: 0, bestStreak: 0, majorityCount: 0 },
  };
}

function setStoredData(data: StoredData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveAnswer(questionId: number, choice: 'A' | 'B'): GameStats {
  const data = getStoredData();

  // Don't duplicate
  if (data.answers.find((a) => a.questionId === questionId)) return data.stats;

  const question = questions.find((q) => q.id === questionId);
  if (!question) return data.stats;

  const answer: UserAnswer = {
    questionId,
    choice,
    answeredAt: new Date().toISOString(),
  };

  data.answers.push(answer);

  // Check if picked majority
  const majorityChoice =
    question.percentA >= question.percentB ? 'A' : 'B';
  const pickedMajority = choice === majorityChoice;

  data.stats.totalAnswered += 1;

  if (pickedMajority) {
    data.stats.majorityCount += 1;
    data.stats.streak += 1;
    if (data.stats.streak > data.stats.bestStreak) {
      data.stats.bestStreak = data.stats.streak;
    }
  } else {
    data.stats.streak = 0;
  }

  setStoredData(data);
  return data.stats;
}

export function getAnswers(): UserAnswer[] {
  return getStoredData().answers;
}

export function getStats(): GameStats {
  return getStoredData().stats;
}

export function getUnansweredQuestions(category?: Category | '전체'): Question[] {
  const answered = new Set(getStoredData().answers.map((a) => a.questionId));
  return questions.filter((q) => {
    if (answered.has(q.id)) return false;
    if (category && category !== '전체' && q.category !== category) return false;
    return true;
  });
}

export function getAnsweredQuestions(): { question: Question; answer: UserAnswer }[] {
  const data = getStoredData();
  return data.answers
    .map((a) => {
      const question = questions.find((q) => q.id === a.questionId);
      if (!question) return null;
      return { question, answer: a };
    })
    .filter(Boolean) as { question: Question; answer: UserAnswer }[];
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
