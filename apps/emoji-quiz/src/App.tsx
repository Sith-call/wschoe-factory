import { useState, useCallback, useEffect } from 'react';
import { Screen, Category, QuizState, BestScores } from './types';
import { getQuizItems } from './quiz-data';
import StartScreen from './components/StartScreen';
import CategorySelect from './components/CategorySelect';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

const BEST_SCORES_KEY = 'emoji-quiz-best-scores';

function loadBestScores(): BestScores {
  try {
    const raw = localStorage.getItem(BEST_SCORES_KEY);
    if (raw) return JSON.parse(raw) as BestScores;
  } catch { /* ignore */ }
  return {};
}

function saveBestScores(scores: BestScores) {
  localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(scores));
}

const initialQuizState: QuizState = {
  category: null,
  currentIndex: 0,
  score: 0,
  answers: [],
  questions: [],
  selectedChoices: [],
  streak: 0,
  maxStreak: 0,
};

function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);
  const [bestScores, setBestScores] = useState<BestScores>(loadBestScores);

  // Save best score when reaching result screen
  useEffect(() => {
    if (screen === 'result' && quizState.category) {
      const cat = quizState.category;
      const current = bestScores[cat] ?? -1;
      if (quizState.score > current) {
        const updated = { ...bestScores, [cat]: quizState.score };
        setBestScores(updated);
        saveBestScores(updated);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const handleStart = useCallback(() => {
    setScreen('category');
  }, []);

  const handleCategorySelect = useCallback((category: Category) => {
    const questions = getQuizItems(category, 20);
    setQuizState({
      category,
      currentIndex: 0,
      score: 0,
      answers: new Array(questions.length).fill(null),
      questions,
      selectedChoices: new Array(questions.length).fill(null),
      streak: 0,
      maxStreak: 0,
    });
    setScreen('quiz');
  }, []);

  const handleAnswer = useCallback((correct: boolean, selectedChoice: string | null) => {
    setQuizState((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentIndex] = correct;
      const newSelected = [...prev.selectedChoices];
      newSelected[prev.currentIndex] = selectedChoice;
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        ...prev,
        score: correct ? prev.score + 1 : prev.score,
        answers: newAnswers,
        selectedChoices: newSelected,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
      };
    });
  }, []);

  const handleNext = useCallback(() => {
    setQuizState((prev) => {
      if (prev.currentIndex + 1 >= prev.questions.length) {
        return prev;
      }
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const handleFinish = useCallback(() => {
    setScreen('result');
  }, []);

  const handleRestart = useCallback(() => {
    setQuizState(initialQuizState);
    setScreen('start');
  }, []);

  const handleRetryCategory = useCallback(() => {
    setScreen('category');
  }, []);

  return (
    <div className="min-h-screen bg-[#fff1f2] flex flex-col items-center">
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col">
        {screen === 'start' && <StartScreen onStart={handleStart} />}
        {screen === 'category' && (
          <CategorySelect
            onSelect={handleCategorySelect}
            onBack={() => setScreen('start')}
            bestScores={bestScores}
          />
        )}
        {screen === 'quiz' && (
          <QuizScreen
            quizState={quizState}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onFinish={handleFinish}
            onBack={() => setScreen('category')}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            quizState={quizState}
            onRestart={handleRestart}
            onRetryCategory={handleRetryCategory}
          />
        )}
      </div>
    </div>
  );
}

export default App;
