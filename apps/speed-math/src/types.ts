export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type Operation = '+' | '-' | '×' | '÷'
export type Screen = 'start' | 'game' | 'result'

export interface Problem {
  a: number
  b: number
  op: Operation
  answer: number
  choices: number[]
}

export interface GameResult {
  difficulty: Difficulty
  totalTime: number
  correctCount: number
  totalProblems: number
  maxStreak: number
  score: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  answers: AnswerRecord[]
}

export interface AnswerRecord {
  problem: Problem
  selected: number
  correct: boolean
  timeMs: number
}
