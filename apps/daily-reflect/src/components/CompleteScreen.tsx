import { useEffect, useState } from 'react';
import { EmotionType, EMOTIONS } from '../types';
import { getStreak } from '../store';

interface Props {
  emotion: EmotionType;
  energy: number;
  highlightText: string;
  gratitude: string;
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

const EMOTION_MESSAGES: Record<EmotionType, string> = {
  happy: '좋은 하루였네요!',
  calm: '평온한 하루, 소중해요',
  grateful: '감사는 행복의 시작이에요',
  tired: '오늘 수고 많았어요',
  anxious: '괜찮아요, 내일은 더 나을 거예요',
  sad: '기록한 것만으로 충분해요',
};

export default function CompleteScreen({ emotion, energy, highlightText, gratitude, onHome }: Props) {
  const streak = getStreak();
  const emotionData = EMOTIONS.find(e => e.type === emotion);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일 ${['일', '월', '화', '수', '목', '금', '토'][today.getDay()]}요일`;

  const handleShare = async () => {
    const shareText = [
      `🌙 ${dateStr} 하루 회고`,
      `감정: ${emotionData?.label} | 에너지: ${energy}/5`,
      highlightText ? `"${highlightText}"` : '',
      gratitude ? `감사: ${gratitude}` : '',
      streak > 1 ? `🔥 ${streak}일 연속 기록 중` : '',
      '',
      '#하루회고 #DailyReflect',
    ].filter(Boolean).join('\n');

    if (navigator.share) {
      await navigator.share({ text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('클립보드에 복사되었어요!');
    }
  };

  return (
    <div className="min-h-screen px-6 pt-14 pb-8 flex flex-col items-center relative overflow-hidden">
      <Particles color={emotionData?.color || '#f5c16c'} />

      <div className={`text-center mb-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div
          className="w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            width: 72, height: 72,
            backgroundColor: `${emotionData?.color}20`,
            boxShadow: `0 0 40px ${emotionData?.color}30, 0 0 80px ${emotionData?.color}15`,
          }}
        >
          <span className="material-symbols-outlined text-4xl" style={{ color: emotionData?.color }}>
            check_circle
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-1">오늘의 회고 완료!</h2>
        <p className="text-night-300 text-sm">{EMOTION_MESSAGES[emotion]}</p>
      </div>

      {/* 공유 가능한 회고 카드 */}
      <div
        className={`w-full rounded-2xl overflow-hidden mb-4 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{
          background: `linear-gradient(135deg, ${emotionData?.color}15, ${emotionData?.color}05, #12123310)`,
          border: `1px solid ${emotionData?.color}20`,
        }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-night-400">{dateStr}</div>
            <div className="flex items-center gap-1 text-xs" style={{ color: emotionData?.color }}>
              <span className="material-symbols-outlined text-sm">{emotionData?.icon}</span>
              {emotionData?.label}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${emotionData?.color}20` }}
            >
              <span className="material-symbols-outlined text-3xl" style={{ color: emotionData?.color }}>
                {emotionData?.icon}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-end gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <div
                    key={n}
                    className="w-3 rounded-sm"
                    style={{
                      height: `${n * 3 + 6}px`,
                      backgroundColor: n <= energy ? '#f5c16c' : '#1a1a4540',
                    }}
                  />
                ))}
                <span className="text-xs text-night-400 ml-1">에너지 {energy}/5</span>
              </div>
            </div>
          </div>

          {highlightText && (
            <p className="text-sm text-night-100 mb-2 leading-relaxed">"{highlightText}"</p>
          )}
          {gratitude && (
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-warm-orange text-sm">favorite</span>
              <p className="text-xs text-night-400">{gratitude}</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: `${emotionData?.color}10` }}>
          <span className="text-[10px] text-night-500">하루 회고</span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            style={{ color: emotionData?.color, backgroundColor: `${emotionData?.color}15` }}
          >
            <span className="material-symbols-outlined text-sm">share</span>
            공유하기
          </button>
        </div>
      </div>

      {streak > 0 && (
        <div
          className={`w-full bg-gradient-to-r from-warm-amber/10 to-warm-orange/10 border border-warm-amber/20 rounded-2xl p-4 text-center transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="material-symbols-outlined text-warm-amber text-xl">local_fire_department</span>
          <span className="text-2xl font-bold text-warm-amber ml-2">{streak}일</span>
          <span className="text-sm text-night-300 ml-1">연속 기록</span>
        </div>
      )}

      <div className={`mt-auto pt-6 w-full transition-all duration-700 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
