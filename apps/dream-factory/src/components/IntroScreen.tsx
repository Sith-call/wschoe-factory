import { useState, useMemo } from 'react';
import type { DreamEntry, DreamEmotionKey } from '../types';

interface Props {
  dreams: DreamEntry[];
  onStartDream: () => void;
  onGoGallery: () => void;
  onViewDream: (entry: DreamEntry) => void;
}

const EMOTION_GRADIENTS: Record<DreamEmotionKey, string> = {
  peace: 'linear-gradient(135deg, #312e81 0%, #1e3a5f 50%, #1e1b4b 100%)',
  fear: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #1a1625 100%)',
  confusion: 'linear-gradient(135deg, #2e1065 0%, #4a1942 50%, #1e1b4b 100%)',
  joy: 'linear-gradient(135deg, #4a1942 0%, #78350f 50%, #1e1b4b 100%)',
  sorrow: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #2e1065 100%)',
  anger: 'linear-gradient(135deg, #450a0a 0%, #2e1065 50%, #1e1b4b 100%)',
  surprise: 'linear-gradient(135deg, #78350f 0%, #4a1942 50%, #1e1b4b 100%)',
  longing: 'linear-gradient(135deg, #1e1b4b 0%, #164e63 50%, #1e1b4b 100%)',
};

const ONBOARDING_STEPS = [
  {
    icon: 'auto_awesome',
    title: '어젯밤 꿈이 기억나세요?',
    subtitle: '꿈의 조각을 모아 나만의 해석 카드를 만들어보세요',
  },
  {
    icon: 'psychology',
    title: '장소, 날씨, 감정을 선택하면',
    subtitle: 'AI가 당신만의 꿈 해석을 만들어드려요',
  },
  {
    icon: 'insights',
    title: '매일 기록하면 패턴이 보여요',
    subtitle: '반복되는 상징의 의미를 발견하세요',
  },
];

export default function IntroScreen({ dreams, onStartDream, onGoGallery, onViewDream }: Props) {
  const latestDream = dreams.length > 0 ? dreams[0] : null;

  // Extract most frequent emotion from dream history
  const dominantEmotion = useMemo<DreamEmotionKey | null>(() => {
    if (dreams.length === 0) return null;
    const counts: Record<string, number> = {};
    dreams.forEach(d => d.emotions.forEach(e => { counts[e] = (counts[e] || 0) + 1; }));
    let max = 0;
    let maxKey: string | null = null;
    for (const [k, v] of Object.entries(counts)) {
      if (v > max) { max = v; maxKey = k; }
    }
    return maxKey as DreamEmotionKey | null;
  }, [dreams]);

  const livingCanvasStyle = useMemo(() => {
    if (!dominantEmotion) return {};
    return {
      background: EMOTION_GRADIENTS[dominantEmotion],
      backgroundSize: '200% 200%',
    };
  }, [dominantEmotion]);

  const shouldShowOnboarding =
    dreams.length === 0 && !localStorage.getItem('dream-factory-onboarded');
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const handleOnboardingNext = () => {
    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      localStorage.setItem('dream-factory-onboarded', 'true');
      setShowOnboarding(false);
    }
  };

  return (
    <div className={`bg-surface-dim text-on-surface font-body min-h-screen overflow-x-hidden relative screen-enter ${dominantEmotion ? 'living-canvas' : ''}`} style={livingCanvasStyle}>
      {/* Top Navigation Shell */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent max-w-[430px]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-200">auto_awesome</span>
          <h1 className="text-lg font-headline tracking-widest text-indigo-200">꿈 공장</h1>
        </div>
        <button className="text-indigo-200 transition-colors duration-500 hover:text-amber-200">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </header>

      <main className="relative pt-24 pb-40 px-6 max-w-[430px] mx-auto min-h-screen flex flex-col items-center">
        {/* Celestial Star Field Background */}
        <div className="absolute inset-0 star-field opacity-40 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Hero Section */}
        <div className="relative w-full text-center space-y-8 z-10">
          {/* Abstract Constellation Visual — breathes and pulses */}
          <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/30 via-transparent to-tertiary-container/20 rounded-full blur-3xl opacity-50" style={{ animation: 'breathe 6s ease-in-out infinite' }}></div>
            {/* Concentric rings that breathe */}
            <div className="absolute w-56 h-56 rounded-full border border-white/5" style={{ animation: 'breathe 8s ease-in-out infinite' }}></div>
            <div className="absolute w-44 h-44 rounded-full border border-white/8" style={{ animation: 'breathe 6s ease-in-out infinite 1s' }}></div>
            <div className="absolute w-32 h-32 rounded-full border border-white/10" style={{ animation: 'breathe 5s ease-in-out infinite 0.5s' }}></div>
            <div className="absolute w-20 h-20 rounded-full border border-white/12" style={{ animation: 'breathe 4s ease-in-out infinite 1.5s' }}></div>
            {/* Center orb */}
            <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-tertiary/20 blur-sm" style={{ animation: 'breathe 3s ease-in-out infinite' }}></div>
            {/* Constellation dots from user's dream symbols */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
              {/* Static constellation dots */}
              <circle cx="128" cy="50" r="2" fill="#c3c0ff" opacity="0.6" style={{ animation: 'breathe 4s ease-in-out infinite 0.2s' }} />
              <circle cx="60" cy="90" r="1.5" fill="#ffb95f" opacity="0.5" style={{ animation: 'breathe 5s ease-in-out infinite 0.8s' }} />
              <circle cx="196" cy="85" r="1.8" fill="#c3c0ff" opacity="0.5" style={{ animation: 'breathe 4.5s ease-in-out infinite 1.2s' }} />
              <circle cx="80" cy="170" r="2" fill="#ffb95f" opacity="0.4" style={{ animation: 'breathe 5.5s ease-in-out infinite 0.5s' }} />
              <circle cx="180" cy="180" r="1.5" fill="#c3c0ff" opacity="0.5" style={{ animation: 'breathe 4s ease-in-out infinite 1.8s' }} />
              <circle cx="128" cy="128" r="2.5" fill="#c3c0ff" opacity="0.7" style={{ animation: 'breathe 3s ease-in-out infinite' }} />
              {/* Connecting lines */}
              <line x1="128" y1="50" x2="60" y2="90" stroke="rgba(195,192,255,0.08)" strokeWidth="0.5" className="constellation-draw" />
              <line x1="128" y1="50" x2="196" y2="85" stroke="rgba(195,192,255,0.08)" strokeWidth="0.5" className="constellation-draw" />
              <line x1="60" y1="90" x2="128" y2="128" stroke="rgba(195,192,255,0.08)" strokeWidth="0.5" className="constellation-draw" />
              <line x1="196" y1="85" x2="128" y2="128" stroke="rgba(195,192,255,0.08)" strokeWidth="0.5" className="constellation-draw" />
              <line x1="128" y1="128" x2="80" y2="170" stroke="rgba(195,192,255,0.06)" strokeWidth="0.5" className="constellation-draw" />
              <line x1="128" y1="128" x2="180" y2="180" stroke="rgba(195,192,255,0.06)" strokeWidth="0.5" className="constellation-draw" />
              <line x1="80" y1="170" x2="180" y2="180" stroke="rgba(195,192,255,0.05)" strokeWidth="0.5" className="constellation-draw" />
            </svg>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-4xl font-headline font-bold text-on-background tracking-tight leading-snug drop-shadow-[0_0_15px_rgba(195,192,255,0.4)]">
              어젯밤 무슨 꿈 꿨어?
            </h2>
            <p className="text-on-surface-variant/80 font-light tracking-wide max-w-[280px] mx-auto">
              무의식이 건네는 비밀스러운 조각들을 기록하고 그 안에 숨겨진 의미를 찾아보세요.
            </p>
          </div>

          {/* Primary Action */}
          <div className="pt-6">
            <button
              onClick={onStartDream}
              className="relative group bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-medium tracking-wider shadow-[0_0_25px_rgba(79,70,229,0.3)] transition-all duration-500 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                꿈 기록하기
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </span>
              <div className="absolute inset-0 rounded-full bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>

        {/* Recent Preview Card (Tarot Style) */}
        {latestDream && (
          <section className="w-full mt-16 z-10">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-[10px] font-label tracking-[0.2em] text-indigo-300/60 uppercase">최근 기록된 조각</span>
              <span className="w-8 h-[1px] bg-indigo-300/20"></span>
            </div>
            <button onClick={() => onViewDream(latestDream)} className="w-full text-left">
              <div className="glass-card rounded-lg p-1 border border-white/5 shadow-2xl">
                <div className="relative overflow-hidden card-radius bg-surface-container aspect-[3/4] flex flex-col justify-end p-6">
                  <div className={`absolute inset-0 gradient-${latestDream.gradientType} opacity-40 mix-blend-luminosity`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/20 to-transparent"></div>
                  <div className="relative space-y-2">
                    <div className="flex gap-2">
                      {latestDream.interpretation.keywords.map((k, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[9px] border border-tertiary/20 uppercase tracking-tighter">
                          {k}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-headline text-on-surface">{latestDream.interpretation.title}</h3>
                    <p className="text-xs text-on-surface-variant/70 font-light line-clamp-2">
                      {latestDream.interpretation.text.slice(0, 60)}...
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </section>
        )}

        {/* Footer Link */}
        <div className="mt-12 text-center pb-20">
          <button onClick={onGoGallery} className="inline-flex flex-col items-center gap-2 group">
            <span className="text-indigo-400/60 font-body text-sm tracking-widest transition-colors duration-500 group-hover:text-amber-200">
              꿈 갤러리 둘러보기
            </span>
            <span className="material-symbols-outlined text-indigo-400/40 text-sm group-hover:translate-y-1 transition-transform">expand_more</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-8 pb-8 pt-4 bg-indigo-950/60 backdrop-blur-xl rounded-t-[40px] border-t border-white/10 shadow-[0_-8px_32px_rgba(79,70,229,0.15)] max-w-[430px]">
        <button onClick={onStartDream} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">edit_note</span>
          <span className="font-label text-[10px] tracking-wider uppercase">기록</span>
        </button>
        <button onClick={onGoGallery} className="flex flex-col items-center justify-center bg-indigo-500/20 text-indigo-100 rounded-full px-6 py-2 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1 icon-fill">auto_stories</span>
          <span className="font-label text-[10px] tracking-wider uppercase">갤러리</span>
        </button>
        <button onClick={onGoGallery} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">insights</span>
          <span className="font-label text-[10px] tracking-wider uppercase">통계</span>
        </button>
      </nav>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] bg-surface-dim/95 backdrop-blur-xl flex items-center justify-center">
          <div className="w-full max-w-[430px] px-8 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-primary-container/20 flex items-center justify-center mb-10">
              <span className="material-symbols-outlined text-primary text-5xl icon-fill">
                {ONBOARDING_STEPS[onboardingStep].icon}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-headline text-2xl text-on-background leading-snug mb-4">
              {ONBOARDING_STEPS[onboardingStep].title}
            </h2>

            {/* Subtitle */}
            <p className="text-on-surface-variant/80 font-light tracking-wide max-w-[280px]">
              {ONBOARDING_STEPS[onboardingStep].subtitle}
            </p>

            {/* Dots Indicator */}
            <div className="flex gap-2 mt-12 mb-10">
              {ONBOARDING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === onboardingStep
                      ? 'w-6 bg-primary'
                      : 'w-1.5 bg-on-surface-variant/30'
                  }`}
                />
              ))}
            </div>

            {/* Action Button */}
            <button
              onClick={handleOnboardingNext}
              className="bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-medium tracking-wider shadow-[0_0_25px_rgba(79,70,229,0.3)] transition-all duration-500 hover:scale-105 active:scale-95"
            >
              {onboardingStep < ONBOARDING_STEPS.length - 1 ? '다음' : '시작하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
