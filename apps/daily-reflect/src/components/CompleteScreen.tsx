import { useEffect, useState } from 'react';
import { EmotionType, EMOTIONS } from '../types';
import { getStreak } from '../store';

interface Props {
  emotion: EmotionType;
  energy: number;
  highlightText: string;
  onHome: () => void;
}

function Particles({ color }: { color: string }) {
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      size: Math.random() * 6 + 4,
      duration: Math.random() * 1 + 1.5,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '40%',
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: 0,
            animation: `particle-rise ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

export default function CompleteScreen({ emotion, energy, highlightText, onHome }: Props) {
  const streak = getStreak();
  const emotionData = EMOTIONS.find(e => e.type === emotion);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen px-6 pt-16 pb-8 flex flex-col items-center relative overflow-hidden">
      <Particles color={emotionData?.color || '#f5c16c'} />

      <div className={`text-center mb-8 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            backgroundColor: `${emotionData?.color}20`,
            boxShadow: `0 0 40px ${emotionData?.color}30, 0 0 80px ${emotionData?.color}15`,
          }}
        >
          <span className="material-symbols-outlined text-4xl" style={{ color: emotionData?.color }}>
            check_circle
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">오늘의 회고 완료!</h2>
        <p className="text-night-300 text-sm">수고했어요, 오늘 하루도 잘 보냈어요</p>
      </div>

      <div
        className={`w-full bg-night-800/80 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-night-700 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${emotionData?.color}20` }}
          >
            <span className="material-symbols-outlined text-xl" style={{ color: emotionData?.color }}>
              {emotionData?.icon}
            </span>
          </div>
          <div>
            <div className="font-semibold">{emotionData?.label}</div>
            <div className="text-xs text-night-400">오늘의 감정</div>
          </div>
          <div className="ml-auto flex items-end gap-0.5">
            {[1, 2, 3, 4, 5].map(n => (
              <div
                key={n}
                className="w-2.5 rounded-sm transition-all"
                style={{
                  height: `${n * 4 + 8}px`,
                  backgroundColor: n <= energy ? '#f5c16c' : '#1a1a45',
                }}
              />
            ))}
          </div>
        </div>
        {highlightText && (
          <div className="border-t border-night-700 pt-3">
            <p className="text-sm text-night-200 italic">"{highlightText}"</p>
          </div>
        )}
      </div>

      {streak > 0 && (
        <div
          className={`w-full bg-gradient-to-r from-warm-amber/10 to-warm-orange/10 border border-warm-amber/20 rounded-2xl p-5 text-center transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="material-symbols-outlined text-warm-amber text-2xl mb-1">local_fire_department</span>
          <div className="text-3xl font-bold text-warm-amber">{streak}일</div>
          <div className="text-sm text-night-300 mt-1">연속 기록 중</div>
        </div>
      )}

      <div className={`mt-auto pt-8 w-full transition-all duration-700 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button
          onClick={onHome}
          className="w-full py-4 rounded-2xl font-semibold text-lg bg-night-700 text-night-100 hover:bg-night-600 active:scale-95 transition-all"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
