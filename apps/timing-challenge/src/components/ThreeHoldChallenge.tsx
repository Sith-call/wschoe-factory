import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChallengeResult } from '../types';
import { getTimingRating, calculateScore } from '../scoring';
import { saveResult, getBestResult } from '../store';
import ResultDisplay from './ResultDisplay';

interface Props {
  onHome: () => void;
}

type Phase = 'ready' | 'holding' | 'result';

export default function ThreeHoldChallenge({ onHome }: Props) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [barWidth, setBarWidth] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef<number>(0);
  const previousBestRef = useRef(getBestResult('three-hold'));

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updateBar = useCallback(() => {
    const now = performance.now();
    const realProgress = (now - startRef.current) / 3000;
    // Deceptive bar: sine-wave wobble
    const fake = realProgress + 0.15 * Math.sin(realProgress * Math.PI * 4);
    setBarWidth(Math.min(fake * 100, 100));

    if (realProgress < 1.5) {
      // Allow holding up to 4.5 seconds before auto-stopping
      rafRef.current = requestAnimationFrame(updateBar);
    }
  }, []);

  const handlePressStart = useCallback(() => {
    startRef.current = performance.now();
    setPhase('holding');
    setBarWidth(0);
    rafRef.current = requestAnimationFrame(updateBar);
  }, [updateBar]);

  const handleRelease = useCallback(() => {
    if (phase !== 'holding') return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const ms = performance.now() - startRef.current;
    setElapsed(ms);
    const score = calculateScore('three-hold', ms);
    const result: ChallengeResult = {
      type: 'three-hold',
      value: ms,
      score,
      playedAt: new Date().toISOString(),
    };
    saveResult(result);
    setPhase('result');
  }, [phase]);

  const handleRetry = useCallback(() => {
    previousBestRef.current = getBestResult('three-hold');
    setPhase('ready');
    setBarWidth(0);
    setElapsed(0);
  }, []);

  if (phase === 'result') {
    const seconds = elapsed / 1000;
    const deviation = seconds - 3;
    const rating = getTimingRating(deviation);
    const sign = deviation >= 0 ? '+' : '';
    const deviationColor = Math.abs(deviation) <= 0.2 ? 'text-emerald-600' : 'text-primary';

    return (
      <ResultDisplay
        type="three-hold"
        mainValue={seconds.toFixed(3) + '초'}
        subtitle={sign + deviation.toFixed(3) + '초'}
        subtitleColor={deviationColor}
        ratingLabel={rating.label}
        ratingTier={rating.tier}
        currentScore={calculateScore('three-hold', elapsed)}
        currentRawValue={elapsed}
        previousBest={previousBestRef.current}
        onRetry={handleRetry}
        onHome={onHome}
        challengeName="3초 홀드"
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {phase === 'ready' && (
        <>
          <p className="text-slate-900 font-bold text-lg mb-2">3초 홀드</p>
          <p className="text-slate-500 text-sm mb-8">정확히 3초 동안 누르고 있으세요</p>
          <p className="text-slate-400 text-xs mb-4">진행 바가 거짓말을 합니다</p>
        </>
      )}

      {/* Progress bar */}
      <div className="w-full max-w-xs h-3 bg-slate-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: barWidth + '%', transition: 'none' }}
        />
      </div>

      {phase === 'holding' && (
        <p className="text-slate-400 text-sm mb-6">누르고 있어요...</p>
      )}

      <button
        onMouseDown={phase === 'ready' ? handlePressStart : undefined}
        onMouseUp={phase === 'holding' ? handleRelease : undefined}
        onMouseLeave={phase === 'holding' ? handleRelease : undefined}
        onTouchStart={phase === 'ready' ? (e) => { e.preventDefault(); handlePressStart(); } : undefined}
        onTouchEnd={phase === 'holding' ? (e) => { e.preventDefault(); handleRelease(); } : undefined}
        className={`w-36 h-36 rounded-full border-4 flex items-center justify-center text-lg font-bold transition-transform duration-50 select-none ${
          phase === 'holding'
            ? 'bg-primary border-primary-dark text-white scale-95'
            : 'bg-white border-primary text-primary active:scale-95'
        }`}
      >
        {phase === 'holding' ? '놓으세요' : '꾹 누르기'}
      </button>
    </div>
  );
}
