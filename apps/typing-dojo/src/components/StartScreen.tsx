import type { Difficulty } from '../types'
import { DIFFICULTY_OPTIONS } from '../types'
import { loadCumulativeStats } from '../scoring'

interface StartScreenProps {
  difficulty: Difficulty
  onDifficultyChange: (d: Difficulty) => void
  onStart: () => void
}

export default function StartScreen({
  difficulty,
  onDifficultyChange,
  onStart,
}: StartScreenProps) {
  const cumulative = loadCumulativeStats()
  const hasPreviousData = cumulative.totalSessions > 0

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Dojo icon (Heroicon: academic-cap) */}
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-12 h-12 text-navy"
          >
            <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
            <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286a48.4 48.4 0 0 1 7.667 3.282 49.85 49.85 0 0 1 2.12-1.998Z" />
          </svg>
        </div>

        <h1 className="font-sans font-bold text-3xl text-navy mb-2">
          타자 도장
        </h1>
        <p className="font-sans text-gray-500 text-sm mb-10">
          한글 타자 연습으로 실력을 키우세요
        </p>

        {/* Cumulative stats */}
        {hasPreviousData && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 text-left">
            <h2 className="font-sans font-medium text-sm text-navy mb-3">
              통산 기록
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="font-mono font-bold text-lg text-navy">
                  {cumulative.totalSessions}
                </p>
                <p className="text-xs text-gray-400 font-sans mt-0.5">총 수련</p>
              </div>
              <div className="text-center">
                <p className="font-mono font-bold text-lg text-navy">
                  {cumulative.bestWpm}
                </p>
                <p className="text-xs text-gray-400 font-sans mt-0.5">최고 타/분</p>
              </div>
              <div className="text-center">
                <p className="font-mono font-bold text-lg text-navy">
                  {cumulative.currentBelt}
                </p>
                <p className="text-xs text-gray-400 font-sans mt-0.5">현재 등급</p>
              </div>
            </div>
          </div>
        )}

        {/* Difficulty selector */}
        <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1 mb-10">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onDifficultyChange(opt.key)}
              className={`px-5 py-2 text-sm font-sans font-medium rounded transition-colors ${
                difficulty === opt.key
                  ? 'bg-navy text-white'
                  : 'text-gray-500 hover:text-navy'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={onStart}
            className="bg-navy text-white font-sans font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-colors"
          >
            시작하기
          </button>
        </div>

        {/* Belt info */}
        <div className="mt-12 text-left bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="font-sans font-medium text-sm text-navy mb-3">
            띠 등급 기준
          </h2>
          <div className="space-y-2">
            {[
              { name: '흰띠', range: '0-50 타/분', color: '#ffffff', border: true },
              { name: '노랑띠', range: '51-100 타/분', color: '#eab308', border: false },
              { name: '초록띠', range: '101-150 타/분', color: '#22c55e', border: false },
              { name: '파랑띠', range: '151-200 타/분', color: '#3b82f6', border: false },
              { name: '검은띠', range: '201+ 타/분', color: '#1a1a2e', border: false },
            ].map((b) => (
              <div key={b.name} className="flex items-center gap-3">
                <div
                  className="w-10 h-3 rounded-sm"
                  style={{
                    backgroundColor: b.color,
                    border: b.border ? '1px solid #d1d5db' : 'none',
                  }}
                />
                <span className="text-xs text-gray-600 font-sans">
                  {b.name}
                </span>
                <span className="text-xs text-gray-400 font-mono ml-auto">
                  {b.range}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 font-sans mt-6">
          Esc 키로 홈 화면으로 돌아갈 수 있습니다
        </p>
      </div>
    </div>
  )
}
