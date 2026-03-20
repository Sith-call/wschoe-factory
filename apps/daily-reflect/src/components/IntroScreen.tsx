interface Props {
  onStart: () => void;
  onDemo: () => void;
}

export default function IntroScreen({ onStart, onDemo }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-gradient-to-b from-night-950 via-night-900 to-night-800 relative overflow-hidden">
      {/* Decorative glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-warm-amber/5 blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-warm-orange/5 blur-3xl" />

      <div className="animate-fade-in-up text-center relative z-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-warm-amber via-warm-orange to-warm-pink flex items-center justify-center mx-auto mb-8 shadow-lg shadow-warm-amber/30">
          <span className="material-symbols-outlined text-5xl text-night-900">nights_stay</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-warm-amber via-warm-orange to-warm-pink bg-clip-text text-transparent">
          하루 회고
        </h1>
        <p className="text-night-100 text-lg leading-relaxed mb-2">
          오늘 하루, 나는 어땠을까?
        </p>
        <p className="text-night-400 text-sm leading-relaxed mb-12 max-w-[280px] mx-auto">
          퇴근 후 3분이면 충분해요.<br/>
          감정, 에너지, 하이라이트를 기록하고<br/>
          나만의 패턴을 발견하세요.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-xs">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-warm-amber to-warm-orange text-night-900 font-bold text-lg shadow-xl shadow-warm-amber/25 active:scale-95 transition-transform animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          오늘의 회고 시작하기
        </button>

        <button
          onClick={onDemo}
          className="w-full mt-4 py-3 rounded-2xl border border-night-600 text-night-300 text-sm font-medium hover:border-night-400 hover:text-night-100 transition-all animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          데모 모드로 둘러보기
        </button>
      </div>
    </div>
  );
}
