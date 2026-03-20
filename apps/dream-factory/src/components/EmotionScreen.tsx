import type { DreamEmotionKey } from '../types';
import { EMOTIONS } from '../data';

interface Props {
  emotions: DreamEmotionKey[];
  vividness: 1|2|3|4|5;
  memo: string;
  onEmotionsChange: (emotions: DreamEmotionKey[]) => void;
  onVividnessChange: (v: 1|2|3|4|5) => void;
  onMemoChange: (m: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const EMOTION_ICONS: Record<string, string> = {
  peace: 'self_improvement',
  fear: 'skull',
  confusion: 'cyclone',
  joy: 'sentiment_very_satisfied',
  sorrow: 'water_drop',
  anger: 'local_fire_department',
  surprise: 'bolt',
  longing: 'favorite',
};

export default function EmotionScreen({
  emotions, vividness, memo,
  onEmotionsChange, onVividnessChange, onMemoChange,
  onNext, onBack,
}: Props) {
  const canProceed = emotions.length >= 1;

  const toggleEmotion = (key: DreamEmotionKey) => {
    if (emotions.includes(key)) {
      onEmotionsChange(emotions.filter(e => e !== key));
    } else if (emotions.length < 2) {
      onEmotionsChange([...emotions, key]);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen hide-scrollbar">
      {/* Top Navigation Shell */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 h-16 z-50 bg-surface-dim/40 backdrop-blur-xl max-w-[430px]">
        <button onClick={onBack} className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h1 className="font-headline text-lg tracking-widest text-primary">감정 선택</h1>
        <button onClick={onBack} className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-[430px] mx-auto">
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-3">
            <span className="text-label text-[10px] uppercase tracking-[0.2rem] text-primary/70">감정 단계</span>
            <span className="text-label text-xs font-medium text-primary">Step 2/3</span>
          </div>
          <div className="h-[2px] w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary-container shadow-[0_0_12px_rgba(79,70,229,0.8)]"></div>
          </div>
        </div>

        {/* Headline */}
        <section className="mb-10">
          <h2 className="font-headline text-3xl leading-snug text-on-background">
            꿈에서 어떤 감정을<br />느꼈나요?
          </h2>
        </section>

        {/* Emotion Grid (2x4) */}
        <section className="grid grid-cols-2 gap-4 mb-12">
          {EMOTIONS.map(e => {
            const isActive = emotions.includes(e.key);
            return (
              <button
                key={e.key}
                onClick={() => toggleEmotion(e.key)}
                className={`rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-all duration-500 cursor-pointer ${
                  isActive
                    ? 'glass-card active-border'
                    : 'glass-card border border-outline-variant/10 hover:bg-surface-container-high'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-primary/10' : 'bg-surface-container-highest'
                }`}>
                  <span className={`material-symbols-outlined ${isActive ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                    {EMOTION_ICONS[e.key] || 'circle'}
                  </span>
                </div>
                <span className={`font-body text-sm tracking-wide ${
                  isActive ? 'text-on-background' : 'text-on-surface-variant'
                }`}>
                  {e.label}
                </span>
              </button>
            );
          })}
        </section>

        {/* Vividness Slider */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-xl text-on-surface">선명도</h3>
            <span className="text-label text-xs text-primary font-medium tracking-widest">단계 {vividness}</span>
          </div>
          <div className="relative px-2">
            <input
              type="range"
              min={1}
              max={5}
              value={vividness}
              onChange={e => onVividnessChange(Number(e.target.value) as 1|2|3|4|5)}
              className="w-full"
            />
            {/* Labels */}
            <div className="flex justify-between mt-4">
              <span className="text-xs text-on-surface-variant font-light">흐릿</span>
              <span className="text-xs text-primary font-medium">생생함</span>
            </div>
          </div>
        </section>

        {/* Detail Capture */}
        <section className="mb-20">
          <h3 className="font-headline text-xl text-on-surface mb-4">특별한 조각들</h3>
          <div className="relative group">
            <textarea
              value={memo}
              onChange={e => onMemoChange(e.target.value.slice(0, 80))}
              placeholder="꿈에서 특별히 기억나는 것이 있다면..."
              maxLength={80}
              rows={3}
              className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-on-surface font-headline text-lg py-4 transition-all duration-700 placeholder:text-on-surface-variant/40 resize-none min-h-[120px]"
            />
            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary group-focus-within:w-full transition-all duration-1000"></div>
          </div>
          <p className="text-on-surface-variant text-[10px] text-right mt-1">{memo.length}/80</p>
        </section>
      </main>

      {/* Bottom Action Anchor */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface via-surface/90 to-transparent z-40 max-w-[430px]">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full py-5 rounded-full flex items-center justify-center gap-3 group active:scale-95 transition-all duration-500 ${
            canProceed
              ? 'bg-primary-container shadow-[0_0_30px_rgba(79,70,229,0.4)]'
              : 'bg-surface-container-highest cursor-not-allowed'
          }`}
        >
          <span className={`material-symbols-outlined group-hover:rotate-45 transition-transform duration-700 ${
            canProceed ? 'text-on-primary-container' : 'text-on-surface-variant/40'
          }`}>auto_awesome</span>
          <span className={`font-body font-semibold tracking-widest text-sm ${
            canProceed ? 'text-on-primary-container' : 'text-on-surface-variant/40'
          }`}>꿈 해석받기</span>
        </button>
      </div>

      {/* Decorative Nebula Background Element */}
      <div className="fixed top-[20%] right-[-10%] w-64 h-64 bg-primary-container/10 blur-[100px] -z-10 rounded-full"></div>
      <div className="fixed bottom-[10%] left-[-10%] w-48 h-48 bg-tertiary/5 blur-[80px] -z-10 rounded-full"></div>
    </div>
  );
}
