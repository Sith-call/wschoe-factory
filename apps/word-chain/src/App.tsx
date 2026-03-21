import { useState, useCallback, useEffect, useRef } from 'react'
import type { ChatMessage, GameState } from './types'
import { findAiWord, findHintWord, isValidKoreanWord, checkWordChain } from './dictionary'
import StartScreen from './components/StartScreen'
import ChatArea from './components/ChatArea'
import InputBar from './components/InputBar'
import GameOverScreen from './components/GameOverScreen'

const MAX_TIME = 10
const HINT_TIME = 3 // Show hint when this many seconds are left
const BEST_SCORE_KEY = 'word-chain-best-score'

function getBestScore(): number {
  try {
    const val = localStorage.getItem(BEST_SCORE_KEY)
    return val ? parseInt(val, 10) || 0 : 0
  } catch {
    return 0
  }
}

function saveBestScore(score: number) {
  try {
    const prev = getBestScore()
    if (score > prev) {
      localStorage.setItem(BEST_SCORE_KEY, String(score))
    }
  } catch { /* ignore */ }
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set())
  const [lastWord, setLastWord] = useState('')
  const [turn, setTurn] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOverReason, setGameOverReason] = useState('')
  const [timeLeft, setTimeLeft] = useState(MAX_TIME)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [combo, setCombo] = useState(0)
  const [hint, setHint] = useState('')
  const [bestScore, setBestScore] = useState(getBestScore)
  const [aiTyping, setAiTyping] = useState(false)
  const nextId = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getId = () => ++nextId.current

  const addMessage = useCallback((text: string, sender: ChatMessage['sender'], turnNum: number) => {
    setMessages(prev => [...prev, { id: getId(), text, sender, turn: turnNum }])
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const endGame = useCallback((reason: string, finalScore?: number) => {
    stopTimer()
    setGameState('gameover')
    setGameOverReason(reason)
    setHint('')
    const s = finalScore ?? score
    saveBestScore(s)
    setBestScore(getBestScore())
  }, [stopTimer, score])

  const startTimer = useCallback(() => {
    stopTimer()
    setTimeLeft(MAX_TIME)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [stopTimer])

  // Watch for time running out
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing' && isPlayerTurn) {
      endGame('시간이 초과되었습니다!')
    }
  }, [timeLeft, gameState, isPlayerTurn, endGame])

  // Show hint when time is running low
  useEffect(() => {
    if (timeLeft === HINT_TIME && gameState === 'playing' && isPlayerTurn && lastWord) {
      const lastChar = lastWord[lastWord.length - 1]
      const hintWord = findHintWord(lastChar, usedWords)
      if (hintWord) {
        setHint(hintWord[0])
      }
    }
  }, [timeLeft, gameState, isPlayerTurn, lastWord, usedWords])

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer()
  }, [stopTimer])

  const handleStart = () => {
    setGameState('playing')
    setMessages([])
    setUsedWords(new Set())
    setLastWord('')
    setTurn(1)
    setScore(0)
    setCombo(0)
    setHint('')
    setAiTyping(false)
    setIsPlayerTurn(true)
    nextId.current = 0
    addMessage('게임 시작! 아무 단어나 입력해주세요.', 'system', 0)
    startTimer()
  }

  const handlePlayerSubmit = (word: string) => {
    if (gameState !== 'playing' || !isPlayerTurn) return

    // Validate Korean
    if (!isValidKoreanWord(word)) {
      addMessage('2글자 이상의 한글 단어만 입력할 수 있어요!', 'system', turn)
      return
    }

    // Check duplicate
    if (usedWords.has(word)) {
      addMessage('이미 사용한 단어예요!', 'system', turn)
      return
    }

    // Check word chain (skip on first turn)
    if (lastWord && !checkWordChain(lastWord, word)) {
      const lastChar = lastWord[lastWord.length - 1]
      addMessage(`"${lastChar}"(으)로 시작하는 단어를 입력해주세요!`, 'system', turn)
      return
    }

    stopTimer()
    setHint('')

    // Valid player word
    const currentTurn = turn
    const newCombo = combo + 1
    setCombo(newCombo)
    addMessage(word, 'player', currentTurn)
    const newUsed = new Set(usedWords)
    newUsed.add(word)
    setUsedWords(newUsed)
    setLastWord(word)
    setIsPlayerTurn(false)

    // Show AI typing indicator
    setAiTyping(true)

    // AI responds after a realistic thinking delay (500-800ms)
    const delay = 500 + Math.random() * 300
    setTimeout(() => {
      setAiTyping(false)
      const lastChar = word[word.length - 1]
      const aiWord = findAiWord(lastChar, newUsed)

      if (!aiWord) {
        // AI can't find a word - player wins this round
        addMessage('으으... 단어를 찾을 수 없어요. 당신이 이겼습니다!', 'system', currentTurn)
        setScore(currentTurn)
        endGame('AI가 단어를 찾지 못했습니다! 축하합니다!', currentTurn)
        return
      }

      addMessage(aiWord, 'ai', currentTurn)
      newUsed.add(aiWord)
      setUsedWords(new Set(newUsed))
      setLastWord(aiWord)
      setTurn(currentTurn + 1)
      setScore(currentTurn)
      setIsPlayerTurn(true)
      startTimer()
    }, delay)
  }

  const handleQuit = () => {
    stopTimer()
    setGameState('start')
  }

  if (gameState === 'start') {
    return <StartScreen onStart={handleStart} bestScore={bestScore} />
  }

  if (gameState === 'gameover') {
    return (
      <GameOverScreen
        score={score}
        reason={gameOverReason}
        onRestart={handleStart}
        onHome={() => setGameState('start')}
      />
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleQuit}
            className="p-1 -ml-1 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="나가기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-800">끝말잇기</h1>
        </div>
        <div className="flex items-center gap-2">
          {combo >= 2 && (
            <span
              className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full transition-all"
              style={{ transform: `scale(${Math.min(1 + (combo - 2) * 0.05, 1.3)})` }}
            >
              {combo} 연속!
            </span>
          )}
          {lastWord && (
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
              끝 글자: <strong className="text-primary">{lastWord[lastWord.length - 1]}</strong>
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-sm font-semibold text-primary font-en">{score}</span>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <ChatArea messages={messages} aiTyping={aiTyping} />

      {/* Input */}
      <InputBar
        onSubmit={handlePlayerSubmit}
        disabled={!isPlayerTurn}
        timeLeft={timeLeft}
        maxTime={MAX_TIME}
        hint={hint}
      />
    </div>
  )
}
