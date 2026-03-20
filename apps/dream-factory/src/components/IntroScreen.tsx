import { useState } from 'react';
import type { DreamEntry } from '../types';

interface Props {
  dreams: DreamEntry[];
  onStartDream: () => void;
  onGoGallery: () => void;
  onViewDream: (entry: DreamEntry) => void;
}

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
    <div className="bg-surface-dim text-on-surface font-body min-h-screen overflow-x-hidden relative">
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
          {/* Crystal Ball Visual */}
          <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/40 via-secondary-container/20 to-tertiary-container/30 rounded-full blur-2xl opacity-60"></div>
            <div className="relative w-48 h-48 rounded-full crystal-glow overflow-hidden border border-white/10 flex items-center justify-center bg-indigo-950/30 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
              <span className="material-symbols-outlined text-tertiary/60 text-5xl animate-pulse">flare</span>
            </div>
            {/* Orbiting star */}
            <div className="absolute -top-4 right-8 w-12 h-12 glass-card rounded-full border border-white/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-sm icon-fill">star</span>
            </div>
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
