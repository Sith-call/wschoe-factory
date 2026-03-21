import { useState, useRef, useCallback, useEffect } from 'react'
import { TimerPhase, FOCUS_DURATION, BREAK_DURATION, PlantedTree } from './types'
import { getRandomTreeType, addTree, recordSession, getTodayStats, getWeeklyStats, getTrees } from './storage'
import type { DayStats } from './types'

interface TimerState {
  phase: TimerPhase
  timeLeft: number
  totalTime: number
  isRunning: boolean
  trees: PlantedTree[]
  newestTreeId: string | null
  todayStats: DayStats
  weeklyStats: DayStats[]
  start: () => void
  pause: () => void
  reset: () => void
  clearAll: () => void
}

export function useTimer(): TimerState {
  const [phase, setPhase] = useState<TimerPhase>('idle')
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION)
  const [totalTime, setTotalTime] = useState(FOCUS_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [trees, setTrees] = useState<PlantedTree[]>(getTrees)
  const [newestTreeId, setNewestTreeId] = useState<string | null>(null)
  const [todayStats, setTodayStats] = useState<DayStats>(getTodayStats)
  const [weeklyStats, setWeeklyStats] = useState<DayStats[]>(getWeeklyStats)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const completeSession = useCallback(() => {
    // Plant a tree
    const newTree: PlantedTree = {
      id: Date.now().toString(),
      type: getRandomTreeType(),
      plantedAt: new Date().toISOString(),
    }
    const updatedTrees = addTree(newTree)
    setTrees(updatedTrees)
    setNewestTreeId(newTree.id)

    // Record stats
    const stats = recordSession()
    setTodayStats(getTodayStats())
    setWeeklyStats(getWeeklyStats())

    // Transition to break
    setPhase('break')
    setTimeLeft(BREAK_DURATION)
    setTotalTime(BREAK_DURATION)
  }, [])

  const completeBreak = useCallback(() => {
    clearInterval_()
    setIsRunning(false)
    setPhase('idle')
    setTimeLeft(FOCUS_DURATION)
    setTotalTime(FOCUS_DURATION)
    setNewestTreeId(null)
  }, [clearInterval_])

  useEffect(() => {
    if (!isRunning) {
      clearInterval_()
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'focus') {
            completeSession()
          } else if (phase === 'break') {
            completeBreak()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return clearInterval_
  }, [isRunning, phase, completeSession, completeBreak, clearInterval_])

  const start = useCallback(() => {
    if (phase === 'idle') {
      setPhase('focus')
      setTimeLeft(FOCUS_DURATION)
      setTotalTime(FOCUS_DURATION)
    }
    setIsRunning(true)
  }, [phase])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    clearInterval_()
    setIsRunning(false)
    setPhase('idle')
    setTimeLeft(FOCUS_DURATION)
    setTotalTime(FOCUS_DURATION)
    setNewestTreeId(null)
  }, [clearInterval_])

  const clearAll = useCallback(() => {
    reset()
    setTrees([])
    setTodayStats({ date: '', sessions: 0, focusMinutes: 0 })
    setWeeklyStats(getWeeklyStats())
    // storage is cleared externally
  }, [reset])

  return {
    phase,
    timeLeft,
    totalTime,
    isRunning,
    trees,
    newestTreeId,
    todayStats,
    weeklyStats,
    start,
    pause,
    reset,
    clearAll,
  }
}
