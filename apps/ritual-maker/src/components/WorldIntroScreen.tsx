import { useState, useEffect } from 'react';
import { WORLD_INTRO } from '../data';

interface Props {
  onComplete: () => void;
}

export default function WorldIntroScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const phases = [
    { text: WORLD_INTRO.story, emoji: '🌑' },
    { text: WORLD_INTRO.mission, emoji: '⚔️' },
  ];

  const handleNext = () => {
    if (phase < phases.length - 1) {
      setVisible(false);
      setTimeout(() => {
        setPhase(p => p + 1);
        setVisible(true);
      }, 400);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30 animate-breathe"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Phase icon */}
        <div className="text-6xl mb-8 animate-bounce-slow">{phases[phase].emoji}</div>

        {/* Title (only first phase) */}
        {phase === 0 && (
          <h1 className="text-xl font-bold text-amber-400 mb-6">{WORLD_INTRO.title}</h1>
        )}

        {/* Story text */}
        <p className="text-sm text-on-background leading-relaxed max-w-sm mx-auto mb-10">
          {phases[phase].text}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {phases.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === phase ? 'bg-amber-400 w-6' : i < phase ? 'bg-amber-400/40' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors active:scale-95"
        >
          {phase < phases.length - 1 ? '다음 →' : '모험 시작! ⚔️'}
        </button>

        {/* Skip */}
        <button
          onClick={onComplete}
          className="block mx-auto mt-4 text-xs text-on-surface-variant/50 hover:text-on-surface-variant"
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
