import React, { useState } from 'react'
import TimerRing from './TimerRing'
import Forest from './Forest'
import Stats from './Stats'
import { PlayIcon, PauseIcon, ResetIcon, TreeIcon } from './Icons'
import { useTimer } from './useTimer'
import { clearForest, getWeeklyStats } from './storage'

export default function App() {
  const timer = useTimer()
  const [showConfirm, setShowConfirm] = useState(false)

  const progress = timer.totalTime > 0 ? 1 - timer.timeLeft / timer.totalTime : 0

  function handleClearForest() {
    clearForest()
    timer.clearAll()
    setShowConfirm(false)
  }

  return (
    <div className="min-h-screen bg-forest-50 font-sans">
      <style>{`
        @keyframes tree-pop {
          0% { transform: scale(0); }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-tree-pop {
          animation: tree-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease forwards;
        }
      `}</style>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="text-center">
          <div className="flex items-center justify-center gap-2">
            <TreeIcon size={22} />
            <h1 className="text-xl font-bold text-forest-800 font-sans">
              뽀모도로 숲
            </h1>
          </div>
        </header>

        {/* Timer Section */}
        <section className="flex flex-col items-center gap-5">
          <TimerRing
            progress={progress}
            phase={timer.phase === 'idle' ? 'idle' : timer.phase}
            timeLeft={timer.timeLeft}
          />

          {/* Controls */}
          <div className="flex items-center gap-4">
            {!timer.isRunning ? (
              <button
                onClick={timer.start}
                className="w-14 h-14 rounded-full bg-forest-700 text-white flex items-center justify-center hover:bg-forest-800 transition-colors"
                aria-label="시작"
              >
                <PlayIcon size={28} />
              </button>
            ) : (
              <button
                onClick={timer.pause}
                className="w-14 h-14 rounded-full bg-forest-700 text-white flex items-center justify-center hover:bg-forest-800 transition-colors"
                aria-label="일시정지"
              >
                <PauseIcon size={28} />
              </button>
            )}
            <button
              onClick={timer.reset}
              className="w-11 h-11 rounded-full bg-white border border-forest-200 text-forest-700 flex items-center justify-center hover:bg-forest-50 transition-colors"
              aria-label="초기화"
            >
              <ResetIcon size={20} />
            </button>
          </div>

          {/* Phase indicator */}
          {timer.phase === 'break' && (
            <div className="animate-fade-in text-sm font-medium text-forest-600 bg-forest-100 px-4 py-1.5 rounded-full">
              쉬는 시간이에요 -- 다음 세션을 준비하세요
            </div>
          )}
        </section>

        {/* Forest Section */}
        <section>
          <h2 className="text-sm font-semibold text-gray-600 font-sans mb-2">
            나의 숲 ({timer.trees.length}그루)
          </h2>
          <Forest trees={timer.trees} newestTreeId={timer.newestTreeId} />
        </section>

        {/* Stats Section */}
        <section>
          <Stats todayStats={timer.todayStats} weeklyStats={timer.weeklyStats} />
        </section>

        {/* Clear forest button */}
        <section className="text-center pb-4">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors font-sans"
            >
              숲 초기화
            </button>
          ) : (
            <div className="animate-fade-in flex items-center justify-center gap-3">
              <span className="text-sm text-red-600 font-sans font-medium">
                정말 모든 나무를 지울까요?
              </span>
              <button
                onClick={handleClearForest}
                className="text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full transition-colors"
              >
                삭제
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-1 rounded-full border border-gray-200 transition-colors"
              >
                취소
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
