import { questions } from './data'

const STORAGE_KEY = 'would-you-rather-votes'

export interface VoteData {
  votesA: number
  votesB: number
  myVote: 'A' | 'B' | null
}

function generateBaseVotes(): Record<number, { baseA: number; baseB: number }> {
  const stored = localStorage.getItem(STORAGE_KEY + '-base')
  if (stored) {
    return JSON.parse(stored)
  }
  const base: Record<number, { baseA: number; baseB: number }> = {}
  for (const q of questions) {
    const total = Math.floor(Math.random() * 151) + 50 // 50-200
    const splitA = Math.floor(Math.random() * total)
    base[q.id] = { baseA: splitA, baseB: total - splitA }
  }
  localStorage.setItem(STORAGE_KEY + '-base', JSON.stringify(base))
  return base
}

const baseVotes = generateBaseVotes()

export function getVoteData(questionId: number): VoteData {
  const base = baseVotes[questionId] || { baseA: 100, baseB: 100 }
  const stored = localStorage.getItem(`${STORAGE_KEY}-${questionId}`)
  const myVote: 'A' | 'B' | null = stored === 'A' ? 'A' : stored === 'B' ? 'B' : null

  return {
    votesA: base.baseA + (myVote === 'A' ? 1 : 0),
    votesB: base.baseB + (myVote === 'B' ? 1 : 0),
    myVote,
  }
}

export function castVote(questionId: number, choice: 'A' | 'B'): VoteData {
  localStorage.setItem(`${STORAGE_KEY}-${questionId}`, choice)
  return getVoteData(questionId)
}

export function getMyVote(questionId: number): 'A' | 'B' | null {
  const stored = localStorage.getItem(`${STORAGE_KEY}-${questionId}`)
  return stored === 'A' ? 'A' : stored === 'B' ? 'B' : null
}
