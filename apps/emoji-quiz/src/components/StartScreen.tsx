interface StartScreenProps {
  onStart: () => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      {/* Quiz icon as SVG */}
      <div className="w-20 h-20 bg-rose-600 rounded-2xl flex items-center justify-center mb-8">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-rose-900 mb-2">
        이모지 퀴즈
      </h1>
      <p className="text-base text-rose-600 font-medium mb-1">Emoji Quiz</p>
      <p className="text-sm text-rose-400 text-center mb-10 max-w-xs">
        이모지 조합을 보고 영화, 속담, 음식을 맞춰보세요!
      </p>

      <button
        onClick={onStart}
        className="w-full max-w-xs bg-rose-600 text-white font-semibold text-lg py-3.5 rounded-lg active:scale-[0.97] transition-transform"
      >
        시작하기
      </button>

      <div className="mt-8 flex gap-6 text-sm text-rose-400">
        <div className="flex items-center gap-1.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
          3 카테고리
        </div>
        <div className="flex items-center gap-1.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          15초 제한
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
