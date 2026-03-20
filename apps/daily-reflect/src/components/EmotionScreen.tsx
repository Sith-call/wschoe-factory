import { EmotionType, EMOTIONS } from '../types';

interface Props {
  selected: EmotionType | null;
  intensity: number;
  onSelect: (e: EmotionType) => void;
  onIntensity: (n: number) => void;
  onNext: () => void;
}

const EMOTION_MESSAGES: Record<EmotionType, string> = {
  happy: '좋은 하루였네요! 이 기분을 기억해두세요 ☀️',
  calm: '평온한 하루, 소중한 순간이에요 🌿',
  grateful: '감사할 수 있다는 건 행복한 거예요 🧡',
  tired: '수고했어요. 오늘은 푹 쉬어요 🌙',
  anxious: '괜찮아요, 이 감정도 지나갈 거예요 🫂',
  sad: '힘든 날도 기록하는 당신이 대단해요 💙',
};

const EMOTION_GRADIENTS: Record<EmotionType, string> = {
  happy: 'from-yellow-900/20 via-night-900 to-night-900',
  calm: 'from-green-900/20 via-night-900 to-night-900',
  grateful: 'from-orange-900/20 via-night-900 to-night-900',
  tired: 'from-purple-900/20 via-night-900 to-night-900',
  anxious: 'from-red-900/20 via-night-900 to-night-900',
  sad: 'from-blue-900/20 via-night-900 to-night-900',
};

export default function EmotionScreen({ selected, intensity, onSelect, onIntensity, onNext }: Props) {
  const bgGradient = selected ? EMOTION_GRADIENTS[selected] : '';

  return (
    <div className={`min-h-screen px-6 pt-12 pb-8 flex flex-col transition-all duration-700 ${selected ? `bg-gradient-to-b ${bgGradient}` : ''}`}>
      <div className="mb-2">
        <div className="flex gap-1 mb-6">
          <div className="h-1 flex-1 rounded-full bg-warm-amber" />
          <div className="h-1 flex-1 rounded-full bg-night-700" />
          <div className="h-1 flex-1 rounded-full bg-night-700" />
        </div>
        <h2 className="text-2xl font-bold mb-2">오늘의 감정은?</h2>
        <p className="text-night-300 text-sm">가장 가까운 감정을 골라주세요</p>
      </div>

      <div className="grid grid-cols-3 gap-3 my-6">
        {EMOTIONS.map(e => (
          <button
            key={e.type}
            onClick={() => onSelect(e.type)}
            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
              selected === e.type
                ? 'border-current scale-105 shadow-lg'
                : selected && selected !== e.type
                  ? 'border-night-800 opacity-40 scale-95'
                  : 'border-night-700 hover:border-night-500 hover:scale-102'
            }`}
            style={{
              color: selected === e.type ? e.color : undefined,
              '--glow-color': `${e.color}40`,
              boxShadow: selected === e.type ? `0 0 30px ${e.color}25, 0 0 60px ${e.color}10` : undefined,
              backgroundColor: selected === e.type ? `${e.color}10` : undefined,
            } as React.CSSProperties}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
              selected === e.type ? 'scale-110' : ''
            }`}
              style={{
                backgroundColor: selected === e.type ? `${e.color}20` : `${e.color}10`,
              }}
            >
              <span
                className="material-symbols-outlined text-3xl"
                style={{ color: e.color }}
              >
                {e.icon}
              </span>
            </div>
            <span className={`text-sm font-medium ${selected === e.type ? '' : 'text-night-200'}`}>
              {e.label}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="animate-fade-in-up mt-4">
          <div className="text-center mb-4 py-2">
            <p className="text-sm text-night-200 italic">{EMOTION_MESSAGES[selected]}</p>
          </div>
          <p className="text-sm text-night-300 mb-3">강도는 어느 정도?</p>
          <div className="flex justify-between items-center gap-2 px-2">
            <span className="text-xs text-night-400">약함</span>
            <div className="flex gap-2 flex-1 justify-center">
              {[1, 2, 3, 4, 5].map(n => {
                const emotionColor = EMOTIONS.find(e => e.type === selected)?.color;
                return (
                  <button
                    key={n}
                    onClick={() => onIntensity(n)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      n <= intensity
                        ? 'text-night-900 scale-110'
                        : 'bg-night-700 text-night-400 hover:bg-night-600'
                    }`}
                    style={n <= intensity ? {
                      backgroundColor: emotionColor,
                      boxShadow: `0 0 12px ${emotionColor}40`,
                    } : {}}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-night-400">강함</span>
          </div>
        </div>
      )}

      <div className="mt-auto pt-6">
        <button
          onClick={onNext}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-semibold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-warm-amber to-warm-orange text-night-900 active:scale-95 shadow-lg shadow-warm-amber/20"
        >
          다음
        </button>
      </div>
    </div>
  );
}
