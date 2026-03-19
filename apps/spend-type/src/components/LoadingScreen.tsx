import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onDone: () => void;
}

const loadingSteps = [
  { text: '소비 패턴을 분석하고 있어요...', emoji: '🔍' },
  { text: 'AI가 당신의 소비 DNA를 해독 중...', emoji: '🧬' },
  { text: '유형을 매칭하고 있어요...', emoji: '🎯' },
  { text: '거의 다 됐어요!', emoji: '✨' },
];

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(10);
    const timers = [
      setTimeout(() => { setStep(1); setProgress(30); }, 700),
      setTimeout(() => { setStep(2); setProgress(60); }, 1400),
      setTimeout(() => { setStep(3); setProgress(90); }, 2100),
      setTimeout(() => setProgress(100), 2600),
      setTimeout(() => onDone(), 2900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#f7f5f8]"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif" }}
    >
      <div className="flex flex-col items-center animate-fadeIn w-full max-w-[280px]">
        {/* Spinner */}
        <div className="relative w-[88px] h-[88px] mb-8">
          <div className="absolute inset-0 rounded-full bg-[#930df2]/5" />
          <div
            className="absolute inset-[-4px] rounded-full border-[3px] border-transparent animate-spin-slow"
            style={{ borderTopColor: '#930df2', borderRightColor: '#b44dff' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[36px] animate-pulse-slow">
            {loadingSteps[step].emoji}
          </div>
        </div>

        {/* Text */}
        <p
          key={step}
          className="text-[15px] font-semibold text-gray-800 animate-fadeIn text-center mb-8"
        >
          {loadingSteps[step].text}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #930df2, #b44dff)',
            }}
          />
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {loadingSteps.map((_, i) => (
            <div
              key={i}
              className="w-[7px] h-[7px] rounded-full transition-all duration-300"
              style={{
                backgroundColor: i <= step ? '#930df2' : '#e5e7eb',
                transform: i <= step ? 'scale(1)' : 'scale(0.75)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
