import type { Difficulty, Operation, Problem } from './types'

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateBeginnerProblem(): Problem {
  const op: Operation = Math.random() < 0.5 ? '+' : '-'
  let a: number, b: number, answer: number

  if (op === '+') {
    a = randInt(1, 18)
    b = randInt(1, 20 - a)
    answer = a + b
  } else {
    a = randInt(2, 20)
    b = randInt(1, a - 1)
    answer = a - b
  }

  return { a, b, op, answer, choices: generateChoices(answer) }
}

function generateIntermediateProblem(): Problem {
  const isMultiply = Math.random() < 0.5
  let a: number, b: number, answer: number
  let op: Operation

  if (isMultiply) {
    op = '×'
    a = randInt(2, 12)
    b = randInt(2, 12)
    answer = a * b
  } else {
    op = '÷'
    b = randInt(2, 12)
    answer = randInt(2, 12)
    a = b * answer
  }

  return { a, b, op, answer, choices: generateChoices(answer) }
}

function generateAdvancedProblem(): Problem {
  const ops: Operation[] = ['+', '-', '×', '÷']
  const op = ops[randInt(0, 3)]
  let a: number, b: number, answer: number

  switch (op) {
    case '+':
      a = randInt(10, 99)
      b = randInt(2, 30)
      answer = a + b
      break
    case '-':
      a = randInt(12, 99)
      b = randInt(2, Math.min(30, a - 1))
      answer = a - b
      break
    case '×':
      a = randInt(10, 30)
      b = randInt(2, 12)
      answer = a * b
      break
    case '÷':
      b = randInt(2, 12)
      answer = randInt(3, 30)
      a = b * answer
      break
    default:
      a = 1
      b = 1
      answer = 2
  }

  return { a, b, op, answer, choices: generateChoices(answer) }
}

function generateChoices(correct: number): number[] {
  const choices = new Set<number>([correct])

  while (choices.size < 4) {
    const offset = randInt(1, 5) * (Math.random() < 0.5 ? 1 : -1)
    const candidate = correct + offset
    if (candidate > 0 && !choices.has(candidate)) {
      choices.add(candidate)
    }
  }

  return shuffle([...choices])
}

export function generateProblems(difficulty: Difficulty, count: number): Problem[] {
  const generator =
    difficulty === 'beginner'
      ? generateBeginnerProblem
      : difficulty === 'intermediate'
        ? generateIntermediateProblem
        : generateAdvancedProblem

  return Array.from({ length: count }, generator)
}

export function calculateGrade(
  correctCount: number,
  totalProblems: number,
  totalTimeMs: number,
): 'S' | 'A' | 'B' | 'C' | 'D' {
  const totalTimeSec = totalTimeMs / 1000
  if (correctCount === totalProblems && totalTimeSec < 30) return 'S'
  if (correctCount >= totalProblems - 1 && totalTimeSec < 45) return 'A'
  if (correctCount >= totalProblems - 3 && totalTimeSec < 60) return 'B'
  if (totalTimeSec < 90) return 'C'
  return 'D'
}

export function calculateScore(
  correctCount: number,
  maxStreak: number,
  totalTimeMs: number,
): number {
  const baseScore = correctCount * 100
  const streakBonus = maxStreak * 20
  const timeBonus = Math.max(0, Math.floor((120000 - totalTimeMs) / 1000) * 5)
  return baseScore + streakBonus + timeBonus
}
