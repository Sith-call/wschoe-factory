interface Props {
  onStart: () => void;
  onDemo: () => void;
}

export default function IntroScreen({ onStart, onDemo }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-surface">
      {/* Background Light Orbs — from Stitch */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary orb-glow" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-secondary orb-glow" />
      <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-primary orb-glow" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
        {/* Reflection Orb — from Stitch */}
        <div className="mb-12">
          <div className="reflection-orb w-48 h-48 rounded-full flex items-center justify-center">
            <span
              className="material-symbols-outlined text-6xl text-on-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              moon_stars
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-gradient font-headline text-5xl font-extrabold tracking-tight">
            하루 회고
          </h1>
          <h2 className="text-on-surface text-2xl font-bold font-body">
            오늘 하루, 나는 어땠을까?
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed max-w-[280px] mx-auto mt-2 font-body">
            퇴근 후 3분이면 충분해요. 감정, 에너지, 오늘의 기억을 기록하고 나만의 패턴을 발견하세요.
          </p>
        </div>

        <div className="flex-grow" />

        <div className="w-full flex flex-col gap-4 pb-16 mt-16">
          <button
            onClick={onStart}
            className="btn-gradient w-full py-5 rounded-full text-on-primary font-bold text-lg shadow-lg active:scale-[0.98] transition-transform font-body"
          >
            오늘의 회고 시작하기
          </button>
          <button
            onClick={onDemo}
            className="w-full py-4 rounded-full border border-outline-variant text-on-surface-variant font-medium text-base hover:bg-surface-container-low transition-colors font-body"
          >
            체험해보기
          </button>
        </div>
      </div>
    </div>
  );
}
