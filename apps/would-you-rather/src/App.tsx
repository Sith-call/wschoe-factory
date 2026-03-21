import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { questions, Question } from './data'
import { getVoteData, castVote, VoteData, getMyVote } from './store'
import { ArrowRightIcon, ShareIcon, CheckIcon, ReplayIcon } from './icons'

type SlideDirection = 'none' | 'enter' | 'exit'

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function App() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>(() => shuffleArray(questions))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [voteData, setVoteData] = useState<VoteData | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [slide, setSlide] = useState<SlideDirection>('none')
  const [selectedPulse, setSelectedPulse] = useState<'A' | 'B' | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [myChoices, setMyChoices] = useState<Array<{ question: Question; choice: 'A' | 'B' }>>([])
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const question = shuffledQuestions[currentIndex]
  const isLast = currentIndex === shuffledQuestions.length - 1
  const total = shuffledQuestions.length

  // Load existing vote on mount / index change
  useEffect(() => {
    const data = getVoteData(question.id)
    if (data.myVote) {
      setVoteData(data)
      setShowResult(true)
    } else {
      setVoteData(null)
      setShowResult(false)
    }
    setCopied(false)
    setSelectedPulse(null)
  }, [currentIndex, question.id])

  const handleVote = useCallback(
    (choice: 'A' | 'B') => {
      if (voteData?.myVote) return
      const data = castVote(question.id, choice)
      setVoteData(data)
      setSelectedPulse(choice)
      setMyChoices((prev) => [...prev, { question, choice }])
      // Delay showing result for pulse effect
      setTimeout(() => {
        setShowResult(true)
      }, 200)
    },
    [question, voteData]
  )

  const goNext = useCallback(() => {
    if (isLast) return
    setSlide('exit')
    setTimeout(() => {
      setCurrentIndex((i) => i + 1)
      setSlide('enter')
      setTimeout(() => setSlide('none'), 350)
    }, 250)
  }, [isLast])

  const restart = useCallback(() => {
    setSlide('exit')
    setTimeout(() => {
      setCurrentIndex(0)
      setSlide('enter')
      setTimeout(() => setSlide('none'), 350)
    }, 250)
  }, [])

  const handleShare = useCallback(async () => {
    if (!voteData?.myVote) return
    const chosen = voteData.myVote === 'A' ? question.optionA : question.optionB
    const totalVotes = voteData.votesA + voteData.votesB
    const pctA = Math.round((voteData.votesA / totalVotes) * 100)
    const pctB = 100 - pctA
    const text = `나는 ${chosen} 파! ${pctA}% vs ${pctB}%`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [voteData, question])

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (diff > 60 && showResult && !isLast) {
      goNext()
    }
  }

  // Percentages
  const totalVotes = voteData ? voteData.votesA + voteData.votesB : 0
  const pctA = totalVotes > 0 && voteData ? Math.round((voteData.votesA / totalVotes) * 100) : 50
  const pctB = totalVotes > 0 ? 100 - pctA : 50

  const slideClass =
    slide === 'enter'
      ? 'translate-x-full opacity-0'
      : slide === 'exit'
        ? '-translate-x-full opacity-0'
        : 'translate-x-0 opacity-100'

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className="w-full bg-gray-100 h-1.5">
        <div
          className="h-full bg-gray-800 transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <span className="text-sm text-gray-400 font-medium">
          <span className="font-sora font-semibold text-gray-800">{currentIndex + 1}</span>
          <span className="mx-1">/</span>
          <span className="font-sora">{total}</span>
        </span>
        <h1 className="text-base font-semibold text-gray-800 tracking-tight">이거 vs 저거</h1>
        <div className="w-10" />
      </div>

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-out ${slideClass}`}
      >
        {/* VS Label */}
        <div className="text-center pt-4 pb-2">
          <span className="font-sora font-bold text-lg text-gray-300 tracking-widest">
            WOULD YOU RATHER
          </span>
        </div>

        {/* Choice cards */}
        <div className="flex-1 flex flex-col">
          {/* Option A - Rose side */}
          <button
            onClick={() => handleVote('A')}
            disabled={!!voteData?.myVote}
            className={`flex-1 flex flex-col items-center justify-center px-6 transition-transform duration-200 ${
              !voteData?.myVote
                ? 'hover:bg-rose-100 active:scale-[0.98] cursor-pointer'
                : 'cursor-default'
            } ${selectedPulse === 'A' ? 'animate-pulse-once' : ''}`}
            style={{ backgroundColor: '#fff1f2' }}
          >
            <span
              className={`text-2xl font-semibold transition-colors duration-300 ${
                voteData?.myVote === 'A' ? 'text-rose-500' : 'text-gray-800'
              }`}
            >
              {question.optionA}
            </span>

            {showResult && voteData && (
              <div className="w-full max-w-xs mt-5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    {voteData.myVote === 'A' && (
                      <CheckIcon className="inline-block mr-1 text-rose-500 -mt-0.5" />
                    )}
                    {voteData.votesA.toLocaleString()}표
                  </span>
                  <span className="font-sora font-bold text-rose-500 text-lg">{pctA}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: showResult ? `${pctA}%` : '0%',
                      backgroundColor: '#f43f5e',
                    }}
                  />
                </div>
              </div>
            )}
          </button>

          {/* VS Divider */}
          <div className="relative flex items-center justify-center h-0">
            <div className="absolute z-10 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
              <span className="font-sora font-bold text-gray-800 text-sm">VS</span>
            </div>
          </div>

          {/* Option B - Teal side */}
          <button
            onClick={() => handleVote('B')}
            disabled={!!voteData?.myVote}
            className={`flex-1 flex flex-col items-center justify-center px-6 transition-transform duration-200 ${
              !voteData?.myVote
                ? 'hover:bg-teal-100 active:scale-[0.98] cursor-pointer'
                : 'cursor-default'
            } ${selectedPulse === 'B' ? 'animate-pulse-once' : ''}`}
            style={{ backgroundColor: '#f0fdfa' }}
          >
            <span
              className={`text-2xl font-semibold transition-colors duration-300 ${
                voteData?.myVote === 'B' ? 'text-teal-500' : 'text-gray-800'
              }`}
            >
              {question.optionB}
            </span>

            {showResult && voteData && (
              <div className="w-full max-w-xs mt-5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    {voteData.myVote === 'B' && (
                      <CheckIcon className="inline-block mr-1 text-teal-500 -mt-0.5" />
                    )}
                    {voteData.votesB.toLocaleString()}표
                  </span>
                  <span className="font-sora font-bold text-teal-500 text-lg">{pctB}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: showResult ? `${pctB}%` : '0%',
                      backgroundColor: '#14b8a6',
                    }}
                  />
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Bottom actions */}
        <div className="px-5 pb-6 pt-3 space-y-3 bg-white">
          {showResult && (
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 h-12 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                {copied ? (
                  <>
                    <CheckIcon className="text-green-500" />
                    복사 완료
                  </>
                ) : (
                  <>
                    <ShareIcon />
                    결과 공유
                  </>
                )}
              </button>

              {!isLast ? (
                <button
                  onClick={goNext}
                  className="flex-1 h-12 rounded-lg bg-gray-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-gray-900 active:bg-gray-700"
                >
                  다음 질문
                  <ArrowRightIcon className="text-white" />
                </button>
              ) : (
                <button
                  onClick={restart}
                  className="flex-1 h-12 rounded-lg bg-gray-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-gray-900 active:bg-gray-700"
                >
                  처음부터
                  <ReplayIcon className="text-white" />
                </button>
              )}
            </div>
          )}

          {!showResult && (
            <p className="text-center text-sm text-gray-400">
              위 또는 아래를 탭해서 선택하세요
            </p>
          )}

          {showResult && (
            <p className="text-center text-xs text-gray-300 font-sora">
              {totalVotes.toLocaleString()} total votes
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulseOnce {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animate-pulse-once {
          animation: pulseOnce 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default App
