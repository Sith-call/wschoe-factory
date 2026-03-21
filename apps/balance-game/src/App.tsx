import { useState } from 'react';
import { Category } from './types';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

type Screen = 'home' | 'game' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | '전체'>('전체');

  const handleStart = (category: Category | '전체') => {
    setSelectedCategory(category);
    setScreen('game');
  };

  const handleFinish = () => {
    setScreen('results');
  };

  const handleHome = () => {
    setScreen('home');
  };

  const handleReplay = () => {
    setScreen('home');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {screen === 'home' && (
        <HomeScreen
          onStart={handleStart}
          onShowResults={() => setScreen('results')}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          category={selectedCategory}
          onFinish={handleFinish}
          onHome={handleHome}
        />
      )}
      {screen === 'results' && (
        <ResultScreen onHome={handleHome} onReplay={handleReplay} />
      )}
    </div>
  );
}
