import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

const MESSAGES = [
  '꿈의 조각을 모으는 중...',
  '상징을 해독하는 중...',
  '당신만의 꿈 해석을 완성하는 중...',
];

export default function AnalysisScreen({ onComplete }: Props) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => {
        if (prev < MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="mystic-gradient min-h-screen flex flex-col items-center justify-center overflow-hidden relative screen-enter">
      {/* Constellation Background Decoration — enhanced with more dots and draw animation */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <svg className="absolute inset-0" width="100%" height="100%">
          {/* Primary constellation */}
          <line className="constellation-draw" stroke="rgba(206,189,255,0.1)" strokeWidth="0.5" x1="20%" x2="40%" y1="30%" y2="25%" />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.1)" strokeWidth="0.5" x1="40%" x2="55%" y1="25%" y2="35%" />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.1)" strokeWidth="0.5" x1="55%" x2="45%" y1="35%" y2="50%" />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.1)" strokeWidth="0.5" x1="45%" x2="25%" y1="50%" y2="45%" />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.1)" strokeWidth="0.5" x1="25%" x2="20%" y1="45%" y2="30%" />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.06)" strokeWidth="0.5" x1="40%" x2="45%" y1="25%" y2="50%" />
          <circle className="star-dot" cx="20%" cy="30%" r="1.5" style={{ animation: 'breathe 4s ease-in-out infinite' }} />
          <circle className="star-dot" cx="40%" cy="25%" r="2" style={{ animation: 'breathe 3.5s ease-in-out infinite 0.5s' }} />
          <circle className="star-dot" cx="55%" cy="35%" r="1.5" style={{ animation: 'breathe 4.2s ease-in-out infinite 1s' }} />
          <circle className="star-dot" cx="45%" cy="50%" r="1.5" style={{ animation: 'breathe 3.8s ease-in-out infinite 1.5s' }} />
          <circle className="star-dot" cx="25%" cy="45%" r="1.8" style={{ animation: 'breathe 4.5s ease-in-out infinite 0.8s' }} />

          {/* Secondary constellation */}
          <line className="constellation-draw" stroke="rgba(206,189,255,0.08)" strokeWidth="0.5" x1="75%" x2="85%" y1="65%" y2="55%" />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.08)" strokeWidth="0.5" x1="85%" x2="70%" y1="55%" y2="45%" />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.06)" strokeWidth="0.5" x1="70%" x2="75%" y1="45%" y2="65%" />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.06)" strokeWidth="0.5" x1="85%" x2="90%" y1="55%" y2="70%" />
          <circle className="star-dot" cx="75%" cy="65%" r="1.5" style={{ animation: 'breathe 4s ease-in-out infinite 0.3s' }} />
          <circle className="star-dot" cx="85%" cy="55%" r="2" style={{ animation: 'breathe 3.5s ease-in-out infinite 0.7s' }} />
          <circle className="star-dot" cx="70%" cy="45%" r="1.5" style={{ animation: 'breathe 4.2s ease-in-out infinite 1.2s' }} />
          <circle className="star-dot" cx="90%" cy="70%" r="1" style={{ animation: 'breathe 5s ease-in-out infinite 0.4s' }} />

          {/* Tertiary scattered dots */}
          <circle className="star-dot" cx="10%" cy="15%" r="1" style={{ animation: 'breathe 5s ease-in-out infinite 2s' }} />
          <circle className="star-dot" cx="90%" cy="20%" r="0.8" style={{ animation: 'breathe 4.5s ease-in-out infinite 1.5s' }} />
          <circle className="star-dot" cx="15%" cy="75%" r="1.2" style={{ animation: 'breathe 5.5s ease-in-out infinite 0.6s' }} />
          <circle className="star-dot" cx="60%" cy="15%" r="0.8" style={{ animation: 'breathe 4s ease-in-out infinite 2.2s' }} />
          <circle className="star-dot" cx="35%" cy="80%" r="1" style={{ animation: 'breathe 4.8s ease-in-out infinite 1.8s' }} />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.04)" strokeWidth="0.5" x1="10%" x2="15%" y1="15%" y2="75%" />
          <line className="constellation-draw" stroke="rgba(206,189,255,0.04)" strokeWidth="0.5" x1="60%" x2="90%" y1="15%" y2="20%" />
        </svg>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-[430px] px-8 h-screen">
        {/* The Crystal Ball */}
        <div className="relative mb-20">
          {/* Outer Atmosphere — intensifying glow */}
          <div className="absolute -inset-16 crystal-ball-glow rounded-full opacity-60" style={{ animation: 'ringGlow 3s ease-in-out infinite' }}></div>
          {/* Sphere Body */}
          <div className="relative w-64 h-64 rounded-full border border-white/5 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Internal Swirling Light */}
            <div className="absolute w-full h-full animate-[spin_12s_linear_infinite] opacity-70 swirl-1"></div>
            <div className="absolute w-full h-full animate-[spin_8s_linear_infinite_reverse] opacity-50 swirl-2 scale-125"></div>
            {/* Reflections */}
            <div className="absolute top-8 left-12 w-16 h-8 bg-white/10 rounded-full blur-md rotate-[-35deg]"></div>
            <div className="absolute bottom-10 right-10 w-4 h-4 bg-white/5 rounded-full blur-sm"></div>
          </div>
          {/* Sphere Stand Shadow */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/40 blur-xl rounded-full"></div>
        </div>

        {/* Progress Text Stack */}
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Completed stages */}
          {MESSAGES.slice(0, msgIndex).map((msg, i) => (
            <p key={i} className="font-headline text-on-surface/40 text-sm tracking-widest font-light transition-all duration-1000">
              {msg}
            </p>
          ))}
          {/* Active Stage */}
          <div className="relative flex flex-col items-center">
            <p className="pulse-text font-headline text-on-surface text-xl tracking-[0.2rem] font-normal">
              {MESSAGES[msgIndex]}
            </p>
            {/* Subtle under-glow for active text */}
            <div className="absolute -bottom-4 w-12 h-[1px] bg-tertiary/30 blur-[1px]"></div>
          </div>
        </div>

        {/* Decorative Constellation Node */}
        <div className="absolute bottom-32 opacity-20 flex flex-col items-center">
          <span className="material-symbols-outlined text-[10px] text-tertiary">flare</span>
        </div>
      </main>

      {/* Bottom Branding */}
      <footer className="absolute bottom-12 w-full flex justify-center pointer-events-none">
        <p className="font-branding italic text-on-surface/20 text-[10px] tracking-[0.6rem] uppercase">
          꿈 공장
        </p>
      </footer>

      {/* Ritualistic Detail Overlay */}
      <div className="fixed inset-0 pointer-events-none border-[32px] border-surface-container-lowest/10 opacity-50"></div>
    </div>
  );
}
