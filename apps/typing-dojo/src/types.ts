export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface DifficultyOption {
  key: Difficulty
  label: string
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { key: 'beginner', label: '초급' },
  { key: 'intermediate', label: '중급' },
  { key: 'advanced', label: '고급' },
]

export interface SentenceResult {
  sentence: string
  typed: string
  wpm: number
  accuracy: number
  elapsedMs: number
}

export interface SessionStats {
  bestWpm: number
  averageAccuracy: number
  totalChars: number
}

export interface CumulativeStats {
  totalSessions: number
  bestWpm: number
  currentBelt: string
}

export type AppScreen = 'start' | 'typing' | 'result'

export interface Belt {
  name: string
  color: string
  minWpm: number
}
