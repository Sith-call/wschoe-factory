import React from 'react';
import { ChallengeType } from '../types';
import { getBestResult } from '../store';
import { getRatingStyle, formatBestValue } from '../scoring';
import { ShareIcon, TrophyIcon } from '../icons';

interface ResultDisplayProps {
  type: ChallengeType;
  mainValue: string;
  subtitle?: string;
  subtitleColor?: string;
  ratingLabel: string;
  ratingTier: number;
  currentScore: number;
  currentRawValue: number;
  previousBest: ReturnType<typeof getBestResult>;
  onRetry: () => void;
  onHome: () => void;
  challengeName: string;
}

export default function ResultDisplay({
  type,
  mainValue,
  subtitle,
  subtitleColor = 'text-slate-500',
  ratingLabel,
  ratingTier,
  currentScore,
  currentRawValue,
  previousBest,
  onRetry,
  onHome,
  challengeName,
}: ResultDisplayProps) {
  const style = getRatingStyle(ratingTier);
  const isNewRecord = !previousBest || currentScore > previousBest.score;

  const handleShare = () => {
    const shareText = `찰나의 순간 | ${challengeName}: ${mainValue} | ${ratingLabel} #찰나의순간`;
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).catch(() => {});
      alert('결과가 클립보드에 복사됐어요!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12" style={{ opacity: 1, animation: 'fadeIn 200ms ease-out' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>

      {isNewRecord && (
        <div className="flex items-center gap-1.5 mb-4 text-emerald-600">
          <TrophyIcon size={20} className="text-emerald-600" />
          <span className="font-medium text-sm">새 기록!</span>
        </div>
      )}

      <p className="font-display font-bold text-[64px] leading-none text-slate-900 mb-2">
        {mainValue}
      </p>

      {subtitle && (
        <p className={`text-lg font-medium mb-6 ${subtitleColor}`}>{subtitle}</p>
      )}

      <span
        className={`inline-block px-4 py-1.5 rounded-md font-medium text-sm ${style.bg} ${style.text} mb-8`}
      >
        {ratingLabel}
      </span>

      {previousBest && !isNewRecord && (
        <p className="text-slate-400 text-sm mb-8">
          최고 기록: {formatBestValue(type, previousBest.value)}
        </p>
      )}

      <div className="w-full max-w-xs flex flex-col gap-3">
        <button
          onClick={onRetry}
          className="w-full h-14 bg-primary text-white font-bold rounded-xl text-base active:scale-95 transition-transform duration-50"
        >
          다시 하기
        </button>
        <button
          onClick={onHome}
          className="w-full h-14 border-2 border-slate-200 text-slate-700 font-medium rounded-xl text-base active:scale-95 transition-transform duration-50"
        >
          다른 챌린지
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 text-slate-400 text-sm mt-2"
        >
          <ShareIcon size={16} />
          공유하기
        </button>
      </div>
    </div>
  );
}
