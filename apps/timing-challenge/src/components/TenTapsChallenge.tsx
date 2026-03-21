import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChallengeResult } from '../types';
import { getTapRating, calculateScore } from '../scoring';
import { saveResult, getBestResult } from '../store';
import ResultDisplay from './ResultDisplay';

interface Props {
  onHome: () => void;
}

type Phase = 'ready' | 'tapping' | 'result';

export default function TenTapsChallenge({ onHome }: Props) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [tapCount, setTapCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3.0);
  const [tapFlash, setTapFlash] = useState(false);
  const tapCountRef = useRef(0);
  const timerRef = useRef<number>(0);
  const intervalRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const previousBestRef = useRef(getBestResult('ten-taps'));

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    tapCountRef.current = 0;
    setTapCount(0);
    setTimeLeft(3.0);
    setPhase('tapping');
    startTimeRef.current = performance.now();

    intervalRef.current = window.setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, 3.0 - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
      }
    }, 50);

    timerRef.current = window.setTimeout(() => {
      clearInterval(intervalRef.current);
      setTimeLeft(0);
      const count = tapCountRef.current;
      setTapCount(count);
      const score = calculateScore('ten-taps', count);
      const result: ChallengeResult = {
        type: 'ten-taps',
        value: count,
        score,
        playedAt: new Date().toISOString(),
      };
      saveResult(result);
      setPhase('result');
    }, 3000);
  }, []);

  const handleTap = useCallback(() => {
    if (phase !== 'tapping') return;
    tapCountRef.current += 1;
    setTapFlash(true);
    setTimeout(() => setTapFlash(false), 50);
  }, [phase]);

  const handleRetry = useCallback(() => {
    previousBestRef.current = getBestResult('ten-taps');
    setPhase('ready');
    setTapCount(0);
    setTimeLeft(3.0);
  }, []);

  if (phase === 'result') {
    const rating = getTapRating(tapCount);
    return (
      <ResultDisplay
        type="ten-taps"
        mainValue={tapCount + '번'}
        subtitle={tapCount === 10 ? undefined : `목표와 ${Math.abs(tapCount - 10)}번 차이`}
        subtitleColor={tapCount === 10 ? 'text-emerald-600' : 'text-slate-400'}
        ratingLabel={rating.label}
        ratingTier={rating.tier}
        currentScore={calculateScore('ten-taps', tapCount)}
        currentRawValue={tapCount}
        previousBest={previousBestRef.current}
        onRetry={handleRetry}
        onHome={onHome}
        challengeName="정확히 10번"
      />
    );
  }

  if (phase === 'tapping') {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen select-none ${
          tapFlash ? 'bg-slate-800' : 'bg-slate-900'
        }`}
        style={{ transition: 'none' }}
        onClick={handleTap}
        onTouchStart={(e) => {
          e.preventDefault();
          handleTap();
        }}
      >
        <p className="text-slate-400 text-sm mb-2 font-display">{timeLeft.toFixed(1)}</p>
        <p className="text-white font-bold text-5xl">탭!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <p className="text-slate-900 font-bold text-lg mb-2">정확히 10번 탭하기</p>
      <p className="text-slate-500 text-sm mb-8">3초 안에 정확히 10번!</p>
      <button
        onClick={handleStart}
        className="w-full max-w-xs h-20 bg-primary text-white text-xl font-bold rounded-xl active:scale-95 transition-transform duration-50"
      >
        시작
      </button>
    </div>
  );
}
