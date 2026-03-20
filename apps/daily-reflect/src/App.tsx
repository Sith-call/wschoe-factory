import { useState, useEffect } from 'react';
import { EmotionType, HighlightCategory } from './types';
import { isFirstVisit, markVisited, saveReflection, getTodayStr, loadDemoData } from './store';
import IntroScreen from './components/IntroScreen';
import EmotionScreen from './components/EmotionScreen';
import EnergyScreen from './components/EnergyScreen';
import HighlightScreen from './components/HighlightScreen';
import CompleteScreen from './components/CompleteScreen';
import HomeScreen from './components/HomeScreen';
import GalleryScreen from './components/GalleryScreen';
import InsightScreen from './components/InsightScreen';
import ProfileScreen from './components/ProfileScreen';

type Screen = 'intro' | 'emotion' | 'energy' | 'highlight' | 'complete' | 'home' | 'gallery' | 'insight' | 'profile';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [emotion, setEmotion] = useState<EmotionType | null>(null);
  const [emotionIntensity, setEmotionIntensity] = useState(3);
  const [energy, setEnergy] = useState(0);
  const [highlightCategory, setHighlightCategory] = useState<HighlightCategory | null>(null);
  const [highlightText, setHighlightText] = useState('');
  const [gratitude, setGratitude] = useState('');

  useEffect(() => {
    if (isFirstVisit()) {
      setScreen('intro');
    }
  }, []);

  const startReflection = () => {
    setEmotion(null);
    setEmotionIntensity(3);
    setEnergy(0);
    setHighlightCategory(null);
    setHighlightText('');
    setGratitude('');
    setScreen('emotion');
  };

  const handleComplete = () => {
    if (!emotion || !energy || !highlightCategory) return;
    saveReflection({
      date: getTodayStr(),
      emotion,
      emotionIntensity,
      energy,
      highlightCategory,
      highlightText,
      gratitude,
      createdAt: new Date().toISOString(),
    });
    setScreen('complete');
  };

  const handleIntroStart = () => {
    markVisited();
    startReflection();
  };

  const handleDemoMode = () => {
    loadDemoData();
    setScreen('home');
  };

  const tabBar = (
    <nav className="fixed bottom-0 left-0 right-0 bg-night-800/95 backdrop-blur-sm border-t border-night-700 flex justify-around py-2 px-4 max-w-[430px] mx-auto">
      {[
        { id: 'home' as Screen, icon: 'home', label: '홈' },
        { id: 'gallery' as Screen, icon: 'calendar_month', label: '갤러리' },
        { id: 'insight' as Screen, icon: 'insights', label: '인사이트' },
        { id: 'profile' as Screen, icon: 'person', label: '프로필' },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setScreen(tab.id)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            screen === tab.id ? 'text-warm-amber' : 'text-night-300 hover:text-night-100'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );

  const showTabBar = ['home', 'gallery', 'insight', 'profile'].includes(screen);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-night-900 relative">
      {screen === 'intro' && <IntroScreen onStart={handleIntroStart} onDemo={handleDemoMode} />}
      {screen === 'emotion' && (
        <EmotionScreen
          selected={emotion}
          intensity={emotionIntensity}
          onSelect={setEmotion}
          onIntensity={setEmotionIntensity}
          onNext={() => setScreen('energy')}
        />
      )}
      {screen === 'energy' && (
        <EnergyScreen
          selected={energy}
          onSelect={setEnergy}
          onNext={() => setScreen('highlight')}
          onBack={() => setScreen('emotion')}
        />
      )}
      {screen === 'highlight' && (
        <HighlightScreen
          category={highlightCategory}
          text={highlightText}
          gratitude={gratitude}
          onCategory={setHighlightCategory}
          onText={setHighlightText}
          onGratitude={setGratitude}
          onComplete={handleComplete}
          onBack={() => setScreen('energy')}
        />
      )}
      {screen === 'complete' && (
        <CompleteScreen
          emotion={emotion!}
          energy={energy}
          highlightText={highlightText}
          gratitude={gratitude}
          onHome={() => setScreen('home')}
        />
      )}
      {screen === 'home' && <HomeScreen onStartReflection={startReflection} />}
      {screen === 'gallery' && <GalleryScreen />}
      {screen === 'insight' && <InsightScreen />}
      {screen === 'profile' && <ProfileScreen />}
      {showTabBar && tabBar}
    </div>
  );
}
