interface GameOverScreenProps {
  score: number
  reason: string
  onRestart: () => void
  onHome?: () => void
}

export default function GameOverScreen({ score, reason, onRestart, onHome }: GameOverScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="flex flex-col items-center gap-5 bg-white rounded-2xl p-8 shadow-sm max-w-sm w-full">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-800">게임 오버</h2>
        <p className="text-slate-500 text-center text-sm">{reason}</p>

        <div className="flex flex-col items-center gap-1 bg-bg rounded-xl px-8 py-4 w-full">
          <span className="text-sm text-slate-400">최종 점수</span>
          <span className="text-4xl font-bold text-primary font-en">{score}</span>
          <span className="text-xs text-slate-400">라운드</span>
        </div>

        <button
          onClick={onRestart}
          className="bg-primary text-white font-semibold text-base px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors w-full mt-2"
        >
          다시 시작
        </button>
        {onHome && (
          <button
            onClick={onHome}
            className="text-slate-400 text-sm hover:text-slate-600 transition-colors"
          >
            처음으로
          </button>
        )}
      </div>
    </div>
  )
}
