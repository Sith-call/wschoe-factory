import { useState } from 'react';
import type { Screen, GameResult } from './types';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [result, setResult] = useState<GameResult | null>(null);

  const handleStart = () => {
    setResult(null);
    setScreen('game');
  };

  const handleFinish = (gameResult: GameResult) => {
    setResult(gameResult);
    setScreen('result');
  };

  const handleRestart = () => {
    setResult(null);
    setScreen('game');
  };

  const handleHome = () => {
    setScreen('start');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'game' && <GameScreen onFinish={handleFinish} />}
      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={handleRestart} onHome={handleHome} />
      )}
    </div>
  );
}

export default App;
