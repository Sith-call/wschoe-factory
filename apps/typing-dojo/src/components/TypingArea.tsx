import { useState, useEffect, useRef, useCallback } from 'react'
import type { Difficulty, SentenceResult } from '../types'
import { DIFFICULTY_OPTIONS } from '../types'
import { getSentences } from '../sentences'
import { calculateWpm, calculateAccuracy } from '../scoring'
import StatsBar from './StatsBar'

const SENTENCES_PER_ROUND = 5

interface TypingAreaProps {
  difficulty: Difficulty
  onDifficultyChange: (d: Difficulty) => void
  onFinish: (results: SentenceResult[]) => void
}

export default function TypingArea({
  difficulty,
  onDifficultyChange,
  onFinish,
}: TypingAreaProps) {
  const [sentences, setSentences] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [currentWpm, setCurrentWpm] = useState(0)
  const [currentAccuracy, setCurrentAccuracy] = useState(100)
  const [results, setResults] = useState<SentenceResult[]>([])
  const [streak, setStreak] = useState(0)
  const [progressFlash, setProgressFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const s = getSentences(difficulty, SENTENCES_PER_ROUND)
    setSentences(s)
    setCurrentIndex(0)
    setTyped('')
    setStartTime(null)
    setCurrentWpm(0)
    setCurrentAccuracy(100)
    setResults([])
    setStreak(0)
    setProgressFlash(false)
  }, [difficulty])

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex, sentences])

  const currentSentence = sentences[currentIndex] ?? ''

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (!startTime) {
        setStartTime(Date.now())
      }

      setTyped(value)

      // Update streak: check the last typed character
      if (value.length > 0) {
        const lastIndex = value.length - 1
        if (lastIndex < currentSentence.length && value[lastIndex] === currentSentence[lastIndex]) {
          setStreak((s) => s + 1)
        } else {
          setStreak(0)
        }
      }

      const elapsed = startTime ? Date.now() - startTime : 1
      setCurrentWpm(calculateWpm(value.length, elapsed))
      setCurrentAccuracy(calculateAccuracy(currentSentence, value))

      // Check if sentence complete
      if (value.length >= currentSentence.length) {
        const elapsedMs = startTime ? Date.now() - startTime : 1
        const wpm = calculateWpm(value.length, elapsedMs)
        const accuracy = calculateAccuracy(currentSentence, value)
        const result: SentenceResult = {
          sentence: currentSentence,
          typed: value,
          wpm,
          accuracy,
          elapsedMs,
        }
        const newResults = [...results, result]

        if (currentIndex + 1 >= SENTENCES_PER_ROUND) {
          onFinish(newResults)
        } else {
          // Flash progress bar green briefly
          setProgressFlash(true)
          setTimeout(() => {
            setProgressFlash(false)
            setResults(newResults)
            setCurrentIndex((i) => i + 1)
            setTyped('')
            setStartTime(null)
            setCurrentWpm(0)
            setCurrentAccuracy(100)
          }, 200)
        }
      }
    },
    [startTime, currentSentence, results, currentIndex, onFinish]
  )

  // Update WPM in real-time
  useEffect(() => {
    if (!startTime || typed.length === 0) return
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      setCurrentWpm(calculateWpm(typed.length, elapsed))
    }, 200)
    return () => clearInterval(interval)
  }, [startTime, typed])

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top difficulty segment */}
      <div className="flex items-center justify-between px-6 py-4 bg-cream border-b border-gray-200">
        <div className="inline-flex bg-white border border-gray-200 rounded-lg p-0.5">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onDifficultyChange(opt.key)}
              className={`px-4 py-1.5 text-xs font-sans font-medium rounded transition-colors ${
                difficulty === opt.key
                  ? 'bg-navy text-white'
                  : 'text-gray-500 hover:text-navy'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="font-sans text-sm text-gray-400">타자 도장</span>
      </div>

      {/* Stats bar */}
      <StatsBar
        wpm={currentWpm}
        accuracy={currentAccuracy}
        currentSentence={currentIndex + 1}
        totalSentences={SENTENCES_PER_ROUND}
        streak={streak}
      />

      {/* Main typing area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          {/* Target sentence display */}
          <div className="mb-8">
            <p className="text-xs text-gray-400 font-sans mb-3 uppercase tracking-wider">
              아래 문장을 입력하세요
            </p>
            <div className="font-sans text-2xl leading-relaxed tracking-wide">
              {currentSentence.split('').map((char, i) => {
                let className = 'text-gray-300' // pending
                if (i < typed.length) {
                  if (typed[i] === char) {
                    className = 'text-navy char-correct'
                  } else {
                    className = 'bg-red-100 text-red-600'
                  }
                }
                const isCursor = i === typed.length
                return (
                  <span key={i} className={`relative inline ${className}`}>
                    {isCursor && (
                      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-brass cursor-blink" />
                    )}
                    {char}
                  </span>
                )
              })}
              {typed.length >= currentSentence.length && currentSentence.length > 0 && (
                <span className="relative">
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-brass cursor-blink" />
                </span>
              )}
            </div>
          </div>

          {/* Input field */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={handleInput}
              className="w-full font-sans text-lg px-4 py-4 bg-white border-2 border-gray-200 focus:border-navy focus:outline-none transition-colors"
              style={{ borderRadius: 0 }}
              placeholder="여기에 입력..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {/* Progress bar under input */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 transition-all duration-100 ${
                progressFlash ? 'bg-green-500 progress-flash' : 'bg-brass'
              }`}
              style={{
                width: progressFlash
                  ? '100%'
                  : `${Math.min((typed.length / currentSentence.length) * 100, 100)}%`,
              }}
            />
          </div>

          {/* Hint */}
          <p className="text-xs text-gray-400 font-sans mt-3 text-center">
            문장을 끝까지 입력하면 자동으로 다음 문장으로 넘어갑니다
          </p>
        </div>
      </div>
    </div>
  )
}
