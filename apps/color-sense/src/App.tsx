import { useState, useCallback, useRef, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import ResultScreen from './components/ResultScreen';
import HistoryScreen from './components/HistoryScreen';
import ShareCard from './components/ShareCard';
import { useGame } from './hooks/useGame';
import { useStorage } from './hooks/useStorage';
import type { GameResult } from './hooks/useStorage';

type Screen = 'intro' | 'game' | 'gameOver' | 'result' | 'history';

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [showShare, setShowShare] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const previousBestRef = useRef(0);
  const transitionedRef = useRef(false);

  const { results, bestScore, saveResult } = useStorage();

  const handleGameEnd = useCallback(
    (result: GameResult) => {
      setLastResult(result);
      saveResult(result);
    },
    [saveResult]
  );

  const {
    phase,
    round,
    currentLevel,
    score,
    timeLeft,
    startGame,
    handleTileTap,
    maxRounds,
    roundTimeMs,
  } = useGame(handleGameEnd);

  const handleStart = useCallback(() => {
    previousBestRef.current = bestScore;
    transitionedRef.current = false;
    setLastResult(null);
    setScreen('game');
    startGame();
  }, [startGame, bestScore]);

  const handleGoToResult = useCallback(() => {
    setScreen('result');
  }, []);

  // Screen transitions based on game phase
  // Only timeout and gameOver (all 20 rounds complete) trigger transitions now.
  // Wrong taps no longer end the game — they show a brief shake and continue.
  useEffect(() => {
    if (screen !== 'game' || transitionedRef.current) return;

    if (phase === 'timeout' && lastResult) {
      transitionedRef.current = true;
      const timer = setTimeout(() => {
        setIsTimeout(true);
        setScreen('gameOver');
      }, 300);
      return () => clearTimeout(timer);
    }

    if (phase === 'gameOver' && lastResult) {
      transitionedRef.current = true;
      const timer = setTimeout(() => {
        setIsTimeout(false);
        setScreen('result');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [screen, phase, lastResult]);

  return (
    <div className="relative">
      {screen === 'intro' && (
        <IntroScreen
          bestScore={bestScore}
          hasHistory={results.length > 0}
          onStart={handleStart}
          onHistory={() => setScreen('history')}
        />
      )}

      {screen === 'game' && round && (
        <GameScreen
          phase={phase}
          round={round}
          currentLevel={currentLevel}
          score={score}
          timeLeft={timeLeft}
          maxRounds={maxRounds}
          roundTimeMs={roundTimeMs}
          onTileTap={handleTileTap}
        />
      )}

      {screen === 'gameOver' && lastResult && (
        <GameOverScreen
          lastLevel={lastResult.maxLevel + 1}
          isTimeout={isTimeout}
          onResult={handleGoToResult}
        />
      )}

      {screen === 'result' && lastResult && (
        <ResultScreen
          result={lastResult}
          previousBest={previousBestRef.current}
          onShare={() => setShowShare(true)}
          onRetry={handleStart}
          onHistory={() => setScreen('history')}
        />
      )}

      {screen === 'history' && (
        <HistoryScreen
          results={results}
          bestScore={bestScore}
          onBack={() => setScreen('intro')}
          onRetry={handleStart}
        />
      )}

      {showShare && lastResult && (
        <ShareCard
          result={lastResult}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
