import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Screen, AppState } from './types';
import { loadState, saveState, updateStreak } from './store';
import { allTerms } from './data/terms';
import { categories } from './data/categories';
import { generateQuizzes } from './data/generate-quizzes';
import { HomeScreen } from './components/HomeScreen';
import { CategoryListScreen } from './components/CategoryListScreen';
import { TermListScreen } from './components/TermListScreen';
import { TermCardScreen } from './components/TermCardScreen';
import { QuizScreen } from './components/QuizScreen';
import { LabRouter } from './labs/LabRouter';
import { ProgressScreen } from './components/ProgressScreen';
import { SearchScreen } from './components/SearchScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { TabBar } from './components/TabBar';
import { MindMapScreen } from './components/MindMapScreen';
import { LabListScreen } from './components/LabListScreen';

function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [screen, setScreen] = useState<Screen>({ type: 'home' });
  const [history, setHistory] = useState<Screen[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const quizzes = useMemo(() => generateQuizzes(allTerms), []);

  useEffect(() => { saveState(state); }, [state]);

  function handleState(s: AppState) {
    setState(updateStreak(s));
    showToast('저장되었습니다');
  }

  function navigate(s: Screen) {
    setHistory(prev => [...prev, screen]);
    setScreen(s);
    window.scrollTo(0, 0);
  }

  function goBack() {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setScreen(prev);
      window.scrollTo(0, 0);
    } else {
      setScreen({ type: 'home' });
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  const showTab = ['home', 'categories', 'progress', 'settings', 'mindmap', 'labList'].includes(screen.type);

  return (
    <div className="min-h-screen bg-surface font-body text-ink">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-ink text-white text-sm px-4 py-2 rounded-md shadow-lg">
          {toast}
        </div>
      )}

      {screen.type === 'home' && <HomeScreen state={state} terms={allTerms} navigate={navigate} />}
      {screen.type === 'categories' && <CategoryListScreen state={state} categories={categories} terms={allTerms} navigate={navigate} />}
      {screen.type === 'termList' && <TermListScreen state={state} categoryId={screen.categoryId} categories={categories} terms={allTerms} navigate={navigate} goBack={goBack} />}
      {screen.type === 'termCard' && <TermCardScreen state={state} termId={screen.termId} terms={allTerms} onStateChange={handleState} navigate={navigate} goBack={goBack} />}
      {screen.type === 'quiz' && <QuizScreen state={state} termId={screen.termId} terms={allTerms} quizzes={quizzes} onStateChange={handleState} navigate={navigate} goBack={goBack} />}
      {screen.type === 'lab' && <LabRouter state={state} termId={screen.termId} terms={allTerms} onStateChange={handleState} navigate={navigate} goBack={goBack} />}
      {screen.type === 'progress' && <ProgressScreen state={state} categories={categories} terms={allTerms} navigate={navigate} />}
      {screen.type === 'search' && <SearchScreen state={state} terms={allTerms} navigate={navigate} />}
      {screen.type === 'settings' && <SettingsScreen state={state} onStateChange={handleState} navigate={navigate} />}
      {screen.type === 'mindmap' && <MindMapScreen state={state} terms={allTerms} categories={categories} navigate={navigate} />}
      {screen.type === 'labList' && <LabListScreen state={state} terms={allTerms} categories={categories} navigate={navigate} />}

      {showTab && <TabBar currentScreen={screen} navigate={navigate} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
