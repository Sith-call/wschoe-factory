import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChallengeResult } from '../types';
import { getReactionRating, calculateScore } from '../scoring';
import { saveResult, getBestResult } from '../store';
import ResultDisplay from './ResultDisplay';

interface Props {
  onHome: () => void;
}

type Phase = 'intro' | 'waiting' | 'go' | 'too-early' | 'result';

export default function ReactionChallenge({ onHome }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [reactionTime, setReactionTime] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const goTimeRef = useRef(0);
  const timerRef = useRef<number>(0);
  const previousBestRef = useRef(getBestResult('reaction'));

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startWaiting = useCallback(() => {
    setPhase('waiting');
    const delay = 1500 + Math.random() * 3500;
    timerRef.current = window.setTimeout(() => {
      goTimeRef.current = performance.now();
      setPhase('go');
    }, delay);
  }, []);

  const handleScreenTap = useCallback(() => {
    if (phase === 'intro') {
      startWaiting();
      return;
    }

    if (phase === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase('too-early');
      return;
    }

    if (phase === 'go') {
      const ms = performance.now() - goTimeRef.current;
      setReactionTime(ms);
      const newResults = [...results, ms];
      setResults(newResults);

      if (newResults.length >= 3) {
        const best = Math.min(...newResults);
        const score = calculateScore('reaction', best);
        const res: ChallengeResult = {
          type: 'reaction',
          value: best,
          score,
          playedAt: new Date().toISOString(),
        };
        saveResult(res);
        setReactionTime(best);
        setPhase('result');
      } else {
        setAttempt(newResults.length);
        setPhase('result');
      }
      return;
    }

    if (phase === 'too-early') {
      startWaiting();
      return;
    }
  }, [phase, results, startWaiting]);

  const handleRetry = useCallback(() => {
    previousBestRef.current = getBestResult('reaction');
    setPhase('intro');
    setResults([]);
    setAttempt(0);
    setReactionTime(0);
  }, []);

  // Final result (after 3 attempts)
  if (phase === 'result' && results.length >= 3) {
    const best = Math.min(...results);
    const rating = getReactionRating(best);
    return (
      <ResultDisplay
        type="reaction"
        mainValue={Math.round(best) + 'ms'}
        subtitle={`3회 결과: ${results.map((r) => Math.round(r) + 'ms').join(' / ')}`}
        subtitleColor="text-slate-400"
        ratingLabel={rating.label}
        ratingTier={rating.tier}
        currentScore={calculateScore('reaction', best)}
        currentRawValue={best}
        previousBest={previousBestRef.current}
        onRetry={handleRetry}
        onHome={onHome}
        challengeName="반응속도"
      />
    );
  }

  // Intermediate result (between attempts)
  if (phase === 'result' && results.length < 3) {
    const lastMs = results[results.length - 1];
    const rating = getReactionRating(lastMs);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6" onClick={() => startWaiting()}>
        <p className="text-slate-400 text-xs mb-4">{results.length}/3 시도</p>
        <p className="font-display font-bold text-5xl text-slate-900 mb-2">{Math.round(lastMs)}ms</p>
        <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getRatingBg(rating.tier)} mb-8`}>
          {rating.label}
        </span>
        <p className="text-slate-400 text-sm">화면을 탭해서 다음 시도</p>
      </div>
    );
  }

  // Full-screen interactive phases
  const isGo = phase === 'go';
  const bgColor = isGo ? 'bg-primary' : 'bg-white';
  const textColor = isGo ? 'text-white' : 'text-slate-900';

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-6 select-none ${bgColor}`}
      style={{ transition: 'none' }}
      onClick={handleScreenTap}
      onTouchStart={(e) => {
        if (phase === 'go') {
          e.preventDefault();
          handleScreenTap();
        }
      }}
    >
      {phase === 'intro' && (
        <>
          <p className="text-slate-900 font-bold text-lg mb-2">반응속도 테스트</p>
          <p className="text-slate-500 text-sm mb-8">화면이 바뀌면 즉시 탭하세요</p>
          <p className="text-slate-400 text-sm">3회 중 가장 빠른 기록을 저장합니다</p>
          <p className="text-primary font-medium text-sm mt-8">화면을 탭해서 시작</p>
        </>
      )}

      {phase === 'waiting' && (
        <p className="text-slate-400 text-lg font-medium">기다리세요...</p>
      )}

      {phase === 'go' && (
        <p className={`${textColor} font-bold text-7xl`}>지금!</p>
      )}

      {phase === 'too-early' && (
        <>
          <p className="text-primary font-bold text-xl mb-2">너무 빨라요!</p>
          <p className="text-slate-400 text-sm">화면을 탭해서 다시 시도</p>
        </>
      )}
    </div>
  );
}

function getRatingBg(tier: number): string {
  switch (tier) {
    case 5: return 'bg-emerald-100 text-emerald-700';
    case 4: return 'bg-rose-50 text-rose-600';
    case 3: return 'bg-slate-100 text-slate-600';
    case 2: return 'bg-amber-50 text-amber-700';
    default: return 'bg-rose-50 text-rose-500';
  }
}
