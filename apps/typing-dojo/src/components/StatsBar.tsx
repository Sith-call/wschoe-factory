interface StatsBarProps {
  wpm: number
  accuracy: number
  currentSentence: number
  totalSentences: number
  streak: number
}

export default function StatsBar({
  wpm,
  accuracy,
  currentSentence,
  totalSentences,
  streak,
}: StatsBarProps) {
  const isStreakGlow = streak >= 20

  return (
    <div
      className={`flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 transition-shadow duration-300 ${
        isStreakGlow ? 'stats-glow' : ''
      }`}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {/* Speed icon (Heroicon: bolt) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-brass"
          >
            <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
          </svg>
          <span className="font-mono font-bold text-navy text-lg">{wpm}</span>
          <span className="text-gray-400 text-xs">타/분</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Accuracy icon (Heroicon: check-badge) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-brass"
          >
            <path
              fillRule="evenodd"
              d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-mono font-bold text-navy text-lg">
            {accuracy}%
          </span>
          <span className="text-gray-400 text-xs">정확도</span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5">
            <span className={`font-mono font-bold text-lg ${isStreakGlow ? 'text-brass' : 'text-navy'}`}>
              {streak}
            </span>
            <span className="text-gray-400 text-xs">연속 정타</span>
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 font-sans">
        <span className="font-mono font-medium text-navy">{currentSentence}</span>
        <span> / {totalSentences}</span>
      </div>
    </div>
  )
}
