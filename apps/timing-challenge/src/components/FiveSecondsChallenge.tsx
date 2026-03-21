import React, { useState, useRef, useCallback } from 'react';
import { ChallengeResult } from '../types';
import { getTimingRating, calculateScore } from '../scoring';
import { saveResult, getBestResult } from '../store';
import ResultDisplay from './ResultDisplay';

interface Props {
  onHome: () => void;
}

type Phase = 'ready' | 'running' | 'result';

export default function FiveSecondsChallenge({ onHome }: Props) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const previousBestRef = useRef(getBestResult('five-seconds'));

  const handleStart = useCallback(() => {
    startRef.current = performance.now();
    setPhase('running');
  }, []);

  const handleStop = useCallback(() => {
    const ms = performance.now() - startRef.current;
    setElapsed(ms);
    const score = calculateScore('five-seconds', ms);
    const result: ChallengeResult = {
      type: 'five-seconds',
      value: ms,
      score,
      playedAt: new Date().toISOString(),
    };
    saveResult(result);
    setPhase('result');
  }, []);

  const handleRetry = useCallback(() => {
    previousBestRef.current = getBestResult('five-seconds');
    setPhase('ready');
    setElapsed(0);
  }, []);

  if (phase === 'result') {
    const seconds = elapsed / 1000;
    const deviation = seconds - 5;
    const rating = getTimingRating(deviation);
    const sign = deviation >= 0 ? '+' : '';
    const deviationColor = Math.abs(deviation) <= 0.2 ? 'text-emerald-600' : 'text-primary';

    return (
      <ResultDisplay
        type="five-seconds"
        mainValue={seconds.toFixed(3) + '초'}
        subtitle={sign + deviation.toFixed(3) + '초'}
        subtitleColor={deviationColor}
        ratingLabel={rating.label}
        ratingTier={rating.tier}
        currentScore={calculateScore('five-seconds', elapsed)}
        currentRawValue={elapsed}
        previousBest={previousBestRef.current}
        onRetry={handleRetry}
        onHome={onHome}
        challengeName="정확히 5초"
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {phase === 'ready' && (
        <>
          <p className="text-slate-500 text-sm mb-8">시작을 누르고, 5초가 됐다고 느낄 때 멈춤을 누르세요.</p>
          <button
            onClick={handleStart}
            className="w-full max-w-xs h-20 bg-primary text-white text-xl font-bold rounded-xl active:scale-95 transition-transform duration-50"
          >
            시작
          </button>
        </>
      )}
      {phase === 'running' && (
        <>
          <p className="text-slate-400 text-sm mb-8">지금 5초를 세고 있어요...</p>
          <button
            onClick={handleStop}
            className="w-full max-w-xs h-20 bg-slate-900 text-white text-xl font-bold rounded-xl active:scale-95 transition-transform duration-50"
          >
            멈춤!
          </button>
        </>
      )}
    </div>
  );
}
