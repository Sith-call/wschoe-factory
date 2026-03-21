import { useState, useEffect, useCallback } from 'react'
import type { Difficulty, SentenceResult, AppScreen } from './types'
import StartScreen from './components/StartScreen'
import TypingArea from './components/TypingArea'
import ResultScreen from './components/ResultScreen'

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('start')
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [results, setResults] = useState<SentenceResult[]>([])

  const handleStart = () => {
    setScreen('typing')
  }

  const handleFinish = (r: SentenceResult[]) => {
    setResults(r)
    setScreen('result')
  }

  const handleRestart = () => {
    setResults([])
    setScreen('start')
  }

  const handleGoHome = useCallback(() => {
    setResults([])
    setScreen('start')
  }, [])

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d)
  }

  // Escape key: return to home from any screen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleGoHome()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleGoHome])

  switch (screen) {
    case 'start':
      return (
        <StartScreen
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onStart={handleStart}
        />
      )
    case 'typing':
      return (
        <TypingArea
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onFinish={handleFinish}
        />
      )
    case 'result':
      return (
        <ResultScreen
          results={results}
          difficulty={difficulty}
          onRestart={handleRestart}
        />
      )
  }
}
