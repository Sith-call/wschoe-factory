import { useEffect } from 'react'
import type { Difficulty, SentenceResult } from '../types'
import { computeSessionStats, getBelt, saveCumulativeStats, getNextBeltThreshold } from '../scoring'
import BeltBadge from './BeltBadge'

interface ResultScreenProps {
  results: SentenceResult[]
  difficulty: Difficulty
  onRestart: () => void
}

export default function ResultScreen({ results, difficulty, onRestart }: ResultScreenProps) {
  const stats = computeSessionStats(results)
  const belt = getBelt(stats.bestWpm)
  const avgWpm = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.wpm, 0) / results.length)
    : 0

  // Save cumulative stats to localStorage
  useEffect(() => {
    saveCumulativeStats(stats.bestWpm)
  }, [stats.bestWpm])

  // Enter key to restart
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onRestart()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onRestart])

  // Difficulty recommendation logic
  const nextThreshold = getNextBeltThreshold(stats.bestWpm)
  const avgAccuracy = stats.averageAccuracy
  const showUpgradeHint =
    avgAccuracy > 95 &&
    nextThreshold !== null &&
    stats.bestWpm >= nextThreshold &&
    difficulty !== 'advanced'

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-sans font-bold text-2xl text-navy mb-2">
            수련 완료
          </h1>
          <p className="font-sans text-gray-500 text-sm">
            {results.length}개 문장을 완료했습니다
          </p>
        </div>

        {/* Belt badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 scale-in">
            <p className="text-xs text-gray-400 font-sans mb-2 text-center">
              현재 등급
            </p>
            <div className="flex justify-center">
              <BeltBadge wpm={stats.bestWpm} animate />
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="font-mono font-bold text-xl text-navy">{stats.bestWpm}</p>
            <p className="text-xs text-gray-400 font-sans mt-1">최고 타/분</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="font-mono font-bold text-xl text-navy">
              {stats.averageAccuracy}%
            </p>
            <p className="text-xs text-gray-400 font-sans mt-1">평균 정확도</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="font-mono font-bold text-xl text-navy">
              {stats.totalChars}
            </p>
            <p className="text-xs text-gray-400 font-sans mt-1">총 입력 글자</p>
          </div>
        </div>

        {/* Difficulty recommendation */}
        {showUpgradeHint && (
          <div className="bg-white border border-brass rounded-lg p-4 mb-8 text-center">
            <p className="font-sans text-sm text-navy">
              정확도 {avgAccuracy}%, 최고 속도 {stats.bestWpm} 타/분 — 다음 난이도를 도전해보세요!
            </p>
          </div>
        )}

        {/* Per-sentence breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-sans font-medium text-sm text-navy">
              문장별 결과
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {results.map((r, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <span className="font-mono text-xs text-gray-400 mt-0.5 w-5 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-ink truncate">
                    {r.sentence}
                  </p>
                  <div className="flex gap-4 mt-1">
                    <span className="font-mono text-xs text-gray-500">
                      {r.wpm} 타/분
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        r.accuracy >= 90
                          ? 'text-green-600'
                          : r.accuracy >= 70
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {r.accuracy}% 정확
                    </span>
                    <span className="font-mono text-xs text-gray-400">
                      {(r.elapsedMs / 1000).toFixed(1)}초
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average WPM + next belt hint */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 font-sans">
            평균 속도{' '}
            <span className="font-mono font-medium text-navy">{avgWpm}</span>{' '}
            타/분
            {belt.minWpm < 201 && (
              <>
                {' '}
                — 다음 띠까지{' '}
                <span className="font-mono font-medium text-brass">
                  {(() => {
                    const nextBelt =
                      belt.minWpm === 0
                        ? 51
                        : belt.minWpm === 51
                        ? 101
                        : belt.minWpm === 101
                        ? 151
                        : 201
                    return nextBelt - avgWpm > 0 ? nextBelt - avgWpm : 0
                  })()}
                </span>{' '}
                타/분 더
              </>
            )}
          </p>
        </div>

        {/* Restart button */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="bg-navy text-white font-sans font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-colors"
          >
            다시 수련하기
          </button>
          <p className="text-xs text-gray-400 font-sans mt-3">
            Enter 키로 다시 시작 / Esc 키로 홈 화면
          </p>
        </div>
      </div>
    </div>
  )
}
