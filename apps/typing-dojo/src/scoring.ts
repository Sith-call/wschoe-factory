import type { Belt, CumulativeStats, SentenceResult, SessionStats } from './types'

export const BELTS: Belt[] = [
  { name: '흰띠', color: '#ffffff', minWpm: 0 },
  { name: '노랑띠', color: '#eab308', minWpm: 51 },
  { name: '초록띠', color: '#22c55e', minWpm: 101 },
  { name: '파랑띠', color: '#3b82f6', minWpm: 151 },
  { name: '검은띠', color: '#1a1a2e', minWpm: 201 },
]

export function getBelt(wpm: number): Belt {
  let current = BELTS[0]
  for (const belt of BELTS) {
    if (wpm >= belt.minWpm) {
      current = belt
    }
  }
  return current
}

export function calculateWpm(charsTyped: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0
  const minutes = elapsedMs / 60000
  return Math.round((charsTyped / 5) / minutes)
}

export function calculateAccuracy(target: string, typed: string): number {
  if (typed.length === 0) return 0
  let correct = 0
  const len = Math.min(target.length, typed.length)
  for (let i = 0; i < len; i++) {
    if (target[i] === typed[i]) correct++
  }
  return Math.round((correct / target.length) * 100)
}

export function computeSessionStats(results: SentenceResult[]): SessionStats {
  if (results.length === 0) {
    return { bestWpm: 0, averageAccuracy: 0, totalChars: 0 }
  }
  const bestWpm = Math.max(...results.map((r) => r.wpm))
  const averageAccuracy = Math.round(
    results.reduce((sum, r) => sum + r.accuracy, 0) / results.length
  )
  const totalChars = results.reduce((sum, r) => sum + r.typed.length, 0)
  return { bestWpm, averageAccuracy, totalChars }
}

const CUMULATIVE_KEY = 'typing-dojo-cumulative'

export function loadCumulativeStats(): CumulativeStats {
  try {
    const raw = localStorage.getItem(CUMULATIVE_KEY)
    if (raw) return JSON.parse(raw) as CumulativeStats
  } catch { /* ignore */ }
  return { totalSessions: 0, bestWpm: 0, currentBelt: '흰띠' }
}

export function saveCumulativeStats(sessionBestWpm: number): CumulativeStats {
  const prev = loadCumulativeStats()
  const newBestWpm = Math.max(prev.bestWpm, sessionBestWpm)
  const updated: CumulativeStats = {
    totalSessions: prev.totalSessions + 1,
    bestWpm: newBestWpm,
    currentBelt: getBelt(newBestWpm).name,
  }
  localStorage.setItem(CUMULATIVE_KEY, JSON.stringify(updated))
  return updated
}

export function getNextBeltThreshold(wpm: number): number | null {
  for (const belt of BELTS) {
    if (belt.minWpm > wpm) return belt.minWpm
  }
  return null
}
