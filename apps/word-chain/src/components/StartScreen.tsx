interface StartScreenProps {
  onStart: () => void
  bestScore: number
}

function ChainIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default function StartScreen({ onStart, bestScore }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="flex flex-col items-center gap-6">
        <ChainIcon />
        <h1 className="text-3xl font-bold text-slate-800">
          끝말잇기
        </h1>
        {bestScore > 0 && (
          <span className="text-sm text-primary font-semibold bg-primary/10 px-4 py-1.5 rounded-full">
            최고 기록: {bestScore}턴
          </span>
        )}
        <p className="text-slate-500 text-center leading-relaxed">
          AI와 끝말잇기 대결!<br />
          단어의 마지막 글자로 시작하는<br />
          새로운 단어를 이어가세요.
        </p>

        <div className="flex flex-col gap-3 text-sm text-slate-500 bg-white rounded-xl p-5 w-full max-w-xs">
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>2글자 이상의 한글 단어만 가능</span>
          </div>
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>턴당 10초 제한 시간</span>
          </div>
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span>같은 단어는 두 번 사용 불가</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="bg-primary text-white font-semibold text-lg px-10 py-3 rounded-lg hover:bg-primary-dark transition-colors mt-2"
        >
          게임 시작
        </button>
      </div>
    </div>
  )
}
