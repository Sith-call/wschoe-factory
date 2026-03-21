import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, Session } from '../types';
import { getSettings, saveSession, getTodaysSessions, getPetStage, didPetJustEvolve, checkAchievements, getAchievements } from '../store';
import QuoteCard from './QuoteCard';
import BossMode from './BossMode';

interface TimerScreenProps {
  onToast?: (emoji: string, message: string, subMessage?: string) => void;
}

export default function TimerScreen({ onToast }: TimerScreenProps) {
  const settings = getSettings();
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(settings.focusDuration * 60);
  const [totalSeconds, setTotalSeconds] = useState(settings.focusDuration * 60);
  const [showEnergyCheck, setShowEnergyCheck] = useState(false);
  const [selectedEnergy, setSelectedEnergy] = useState(0);
  const [todaySessions, setTodaySessions] = useState(getTodaysSessions());
  const [celebrating, setCelebrating] = useState(false);
  const [petStage, setPetStage] = useState(getPetStage());
  const [showEvolution, setShowEvolution] = useState(false);
  const [showQuoteCard, setShowQuoteCard] = useState(false);
  const [showBossMode, setShowBossMode] = useState(false);

  const startTimeRef = useRef<number>(0);
  const pausedRemainingRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previousStateRef = useRef<'focus' | 'break'>('focus');

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const remaining = Math.max(0, pausedRemainingRef.current - elapsed);
    setRemainingSeconds(Math.ceil(remaining));

    if (remaining <= 0) {
      clearTimer();
      if (previousStateRef.current === 'focus') {
        // Focus session complete — show energy check
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 500);
        setShowEnergyCheck(true);
      } else {
        // Break complete — go idle
        const s = getSettings();
        setTimerState('idle');
        setRemainingSeconds(s.focusDuration * 60);
        setTotalSeconds(s.focusDuration * 60);
      }
    }
  }, [clearTimer]);

  const startTimer = useCallback((mode: 'focus' | 'break', seconds?: number) => {
    clearTimer();
    const s = getSettings();
    const duration = seconds ?? (mode === 'focus' ? s.focusDuration * 60 : s.breakDuration * 60);
    previousStateRef.current = mode;
    startTimeRef.current = Date.now();
    pausedRemainingRef.current = duration;
    setTotalSeconds(duration);
    setRemainingSeconds(duration);
    setTimerState(mode);
    intervalRef.current = setInterval(tick, 250);
  }, [clearTimer, tick]);

  const handleStart = () => {
    if (timerState === 'idle') {
      startTimer('focus');
    } else if (timerState === 'paused') {
      // Resume
      startTimeRef.current = Date.now();
      pausedRemainingRef.current = remainingSeconds;
      setTimerState(previousStateRef.current);
      intervalRef.current = setInterval(tick, 250);
    } else {
      // Pause
      clearTimer();
      pausedRemainingRef.current = remainingSeconds;
      setTimerState('paused');
    }
  };

  const handleReset = () => {
    clearTimer();
    const s = getSettings();
    setTimerState('idle');
    setRemainingSeconds(s.focusDuration * 60);
    setTotalSeconds(s.focusDuration * 60);
    previousStateRef.current = 'focus';
  };

  const handleSkip = () => {
    clearTimer();
    if (previousStateRef.current === 'focus') {
      // Skip to break
      setShowEnergyCheck(true);
    } else {
      // Skip break, go idle
      const s = getSettings();
      setTimerState('idle');
      setRemainingSeconds(s.focusDuration * 60);
      setTotalSeconds(s.focusDuration * 60);
    }
  };

  const handleEnergySelect = (energy: number) => {
    setSelectedEnergy(energy);
  };

  const handleEnergyConfirm = () => {
    if (selectedEnergy === 0) return;
    const s = getSettings();
    const session: Session = {
      date: new Date().toISOString().split('T')[0],
      focusMinutes: s.focusDuration,
      energy: selectedEnergy,
      completedAt: new Date().toISOString(),
    };
    saveSession(session);
    setTodaySessions(getTodaysSessions());

    // Check pet evolution
    const evolved = didPetJustEvolve();
    const newPetStage = getPetStage();
    setPetStage(newPetStage);
    if (evolved) {
      setShowEvolution(true);
      setTimeout(() => setShowEvolution(false), 2500);
      onToast?.(newPetStage.emoji, '\uC9C4\uD654\uD588\uC5B4\uC694!', `${newPetStage.name}(\uC73C)\uB85C \uC9C4\uD654!`);
    }

    // Check achievements
    const newAchievements = checkAchievements();
    if (newAchievements.length > 0) {
      const allAchievements = getAchievements();
      // Show toast for first newly unlocked achievement (with delay if pet evolved)
      const delay = evolved ? 3200 : 0;
      newAchievements.forEach((id, idx) => {
        const ach = allAchievements.find(a => a.id === id);
        if (ach) {
          setTimeout(() => {
            onToast?.(ach.icon, '\uC5C5\uC801 \uB2EC\uC131!', ach.name);
          }, delay + idx * 3200);
        }
      });
    }

    setShowEnergyCheck(false);
    setSelectedEnergy(0);
    // Show quote card before starting break
    setShowQuoteCard(true);
  };

  const handleQuoteDismiss = () => {
    setShowQuoteCard(false);
    // Start break after quote card dismissed
    startTimer('break');
  };

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Refresh settings when returning to idle
  useEffect(() => {
    if (timerState === 'idle') {
      const s = getSettings();
      setRemainingSeconds(s.focusDuration * 60);
      setTotalSeconds(s.focusDuration * 60);
      setTodaySessions(getTodaysSessions());
      setPetStage(getPetStage());
    }
  }, [timerState]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0;

  const modeLabel = timerState === 'focus' ? '\uC9D1\uC911 \uC911' :
                    timerState === 'break' ? '\uD734\uC2DD \uC911' :
                    timerState === 'paused' ? '\uC77C\uC2DC\uC815\uC9C0' : '\uC900\uBE44';

  const isRunning = timerState === 'focus' || timerState === 'break';

  // SVG ring params
  const size = 260;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center px-6 pt-8">
      {/* Boss Mode button — subtle top-right */}
      <button
        onClick={() => setShowBossMode(true)}
        className="fixed top-3 right-3 z-40 w-8 h-8 flex items-center justify-center rounded-full opacity-30 hover:opacity-70 transition-opacity text-[16px]"
        aria-label="Boss Mode"
      >
        {'\uD83D\uDD76\uFE0F'}
      </button>

      {/* Focus Pet */}
      <div className="mb-4 text-center relative">
        <div className={`text-[64px] leading-none ${showEvolution ? 'animate-pet-evolve' : 'animate-pet-bounce'}`}>
          {petStage.emoji}
        </div>
        <p className="text-[13px] font-bold text-on-surface mt-1">{petStage.name}</p>
        <div className="mt-1 px-3 py-1 bg-surface-container rounded-full inline-block">
          <p className="text-[12px] text-on-surface-variant">{petStage.message}</p>
        </div>
        {showEvolution && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[14px] font-bold text-primary animate-fade-in">
            진화했어요!
          </div>
        )}
      </div>

      {/* Session counter */}
      <div className="mb-6 text-center">
        <p className="text-on-surface-variant text-[14px]">
          오늘 {todaySessions.length > 0 ? `${todaySessions.length}번째` : '첫 번째'} 집중
        </p>
        <div className="flex gap-2 justify-center mt-2">
          {Array.from({ length: Math.max(todaySessions.length, 1) }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i < todaySessions.length ? 'bg-primary' : 'bg-outline-variant'
              }`}
            />
          ))}
          {todaySessions.length > 0 && (
            <div className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
          )}
        </div>
      </div>

      {/* Timer ring */}
      <div className={`relative mb-8 ${celebrating ? 'animate-celebrate' : ''}`}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#323539"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbc00" />
              <stop offset="100%" stopColor="#ffb77d" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline text-[48px] font-bold text-on-surface leading-none">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className={`text-[14px] mt-2 font-medium ${
            timerState === 'focus' ? 'text-primary' :
            timerState === 'break' ? 'text-secondary' :
            'text-on-surface-variant'
          }`}>
            {modeLabel}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Reset */}
        {(isRunning || timerState === 'paused') && (
          <button
            onClick={handleReset}
            className="min-w-[44px] min-h-[44px] w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">refresh</span>
          </button>
        )}

        {/* Start / Pause */}
        <button
          onClick={handleStart}
          className="min-w-[44px] min-h-[44px] w-16 h-16 rounded-full btn-gradient flex items-center justify-center text-on-primary shadow-lg hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[32px]">
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Skip */}
        {(isRunning || timerState === 'paused') && (
          <button
            onClick={handleSkip}
            className="min-w-[44px] min-h-[44px] w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">skip_next</span>
          </button>
        )}
      </div>

      {/* Energy check overlay */}
      {showEnergyCheck && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Panel */}
          <div className="relative w-full max-w-md bg-surface-container rounded-t-3xl p-6 pb-10 animate-slide-up">
            <h3 className="text-[18px] font-headline font-bold text-center mb-2">
              집중 완료!
            </h3>
            <p className="text-[14px] text-on-surface-variant text-center mb-6">
              에너지 레벨을 체크해주세요
            </p>
            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleEnergySelect(level)}
                  className={`min-w-[44px] min-h-[44px] w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                    selectedEnergy === level
                      ? 'bg-primary text-on-primary scale-110'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {level <= 2 ? 'battery_low' : level <= 4 ? 'battery_horiz_050' : 'battery_full'}
                  </span>
                  <span className="text-[11px] mt-0.5">{level}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleEnergyConfirm}
              disabled={selectedEnergy === 0}
              className={`w-full h-[48px] rounded-2xl font-semibold text-[16px] transition-all duration-200 ${
                selectedEnergy > 0
                  ? 'btn-gradient text-on-primary'
                  : 'bg-surface-container-high text-outline cursor-not-allowed'
              }`}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Quote card overlay — shown after energy check */}
      {showQuoteCard && (
        <QuoteCard onDismiss={handleQuoteDismiss} />
      )}

      {/* Boss Mode overlay */}
      {showBossMode && (
        <BossMode onDismiss={() => setShowBossMode(false)} />
      )}
    </div>
  );
}
