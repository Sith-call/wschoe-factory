import { useState, useCallback } from 'react';
import IntroScreen from './components/IntroScreen';
import QuestionScreen from './components/QuestionScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import { type SpendType } from './data';

type Screen = 'intro' | 'quiz' | 'loading' | 'result';

function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [scores, setScores] = useState<Record<SpendType, number> | null>(null);
  const [topType, setTopType] = useState<SpendType>('flex');

  const handleStart = () => setScreen('quiz');

  const handleQuizComplete = (finalScores: Record<SpendType, number>) => {
    setScores(finalScores);

    // Determine top type
    let maxScore = -1;
    let maxType: SpendType = 'flex';
    for (const [type, score] of Object.entries(finalScores)) {
      if (score > maxScore) {
        maxScore = score;
        maxType = type as SpendType;
      }
    }
    setTopType(maxType);
    setScreen('loading');
  };

  const handleLoadingDone = useCallback(() => {
    setScreen('result');
  }, []);

  const handleRetry = () => {
    setScores(null);
    setScreen('intro');
  };

  return (
    <div className="max-w-[430px] mx-auto min-h-screen relative bg-[#f7f5f8]" style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif" }}>
      {screen === 'intro' && <IntroScreen onStart={handleStart} />}
      {screen === 'quiz' && <QuestionScreen onComplete={handleQuizComplete} />}
      {screen === 'loading' && <LoadingScreen onDone={handleLoadingDone} />}
      {screen === 'result' && scores && (
        <ResultScreen topType={topType} scores={scores} onRetry={handleRetry} />
      )}

{/* Demo footer removed to match Stitch design exactly */}
    </div>
  );
}

export default App;
