import React, { useState, useCallback } from 'react';
import { ChallengeType } from './types';
import { BackIcon } from './icons';
import HomeScreen from './components/HomeScreen';
import FiveSecondsChallenge from './components/FiveSecondsChallenge';
import ReactionChallenge from './components/ReactionChallenge';
import TenTapsChallenge from './components/TenTapsChallenge';
import ThreeHoldChallenge from './components/ThreeHoldChallenge';

type Screen = 'home' | 'challenge';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [challengeType, setChallengeType] = useState<ChallengeType | null>(null);
  const [challengeKey, setChallengeKey] = useState(0);

  const handleSelectChallenge = useCallback((type: ChallengeType) => {
    setChallengeType(type);
    setChallengeKey((k) => k + 1);
    setScreen('challenge');
  }, []);

  const handleHome = useCallback(() => {
    setScreen('home');
    setChallengeType(null);
  }, []);

  if (screen === 'home') {
    return <HomeScreen onSelectChallenge={handleSelectChallenge} />;
  }

  // Reaction challenge uses full screen — no back button overlay during active phases
  const isReaction = challengeType === 'reaction';

  return (
    <div className="relative min-h-screen">
      {!isReaction && (
        <button
          onClick={handleHome}
          className="absolute top-4 left-4 z-10 p-2 text-slate-400 hover:text-slate-600"
        >
          <BackIcon size={24} />
        </button>
      )}

      {challengeType === 'five-seconds' && (
        <FiveSecondsChallenge key={challengeKey} onHome={handleHome} />
      )}
      {challengeType === 'reaction' && (
        <ReactionChallenge key={challengeKey} onHome={handleHome} />
      )}
      {challengeType === 'ten-taps' && (
        <TenTapsChallenge key={challengeKey} onHome={handleHome} />
      )}
      {challengeType === 'three-hold' && (
        <ThreeHoldChallenge key={challengeKey} onHome={handleHome} />
      )}
    </div>
  );
}
