import React from 'react';
import { ChallengeType, CHALLENGES } from '../types';
import { getBestResult, getTotalPlays } from '../store';
import { TimerIcon, BoltIcon, TapIcon, HoldIcon } from '../icons';
import { formatBestValue } from '../scoring';

const ICONS: Record<ChallengeType, React.FC<{ className?: string; size?: number }>> = {
  'five-seconds': TimerIcon,
  reaction: BoltIcon,
  'ten-taps': TapIcon,
  'three-hold': HoldIcon,
};

interface HomeScreenProps {
  onSelectChallenge: (type: ChallengeType) => void;
}

export default function HomeScreen({ onSelectChallenge }: HomeScreenProps) {
  const totalPlays = getTotalPlays();

  return (
    <div className="min-h-screen px-5 py-12 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-slate-900 mb-1 mt-4">찰나의 순간</h1>
      <p className="text-slate-500 text-sm mb-10">당신의 타이밍 감각을 시험하세요</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {CHALLENGES.map((ch) => {
          const Icon = ICONS[ch.type];
          const best = getBestResult(ch.type);
          return (
            <button
              key={ch.type}
              onClick={() => onSelectChallenge(ch.type)}
              className="bg-white border border-slate-200 rounded-lg p-4 text-left shadow-sm active:scale-95 transition-transform duration-50 flex flex-col"
            >
              <Icon size={32} className="text-primary mb-3" />
              <span className="font-bold text-sm text-slate-900 mb-0.5">{ch.title}</span>
              <span className="text-xs text-slate-400 leading-tight">{ch.subtitle}</span>
              {best && (
                <span className="text-xs text-primary font-medium mt-3">
                  {formatBestValue(ch.type, best.value)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {totalPlays > 0 && (
        <p className="text-slate-400 text-xs mt-10">총 {totalPlays}번 도전</p>
      )}
    </div>
  );
}
