import { useState, useEffect, useCallback } from 'react';
import type { ScreenName, DreamScene, DreamEmotionKey, DreamEntry, PlaceKey, WeatherKey } from './types';
import { generateInterpretation, createSeedData } from './data';
import IntroScreen from './components/IntroScreen';
import SceneBuilderScreen from './components/SceneBuilderScreen';
import EmotionScreen from './components/EmotionScreen';
import AnalysisScreen from './components/AnalysisScreen';
import InterpretationScreen from './components/InterpretationScreen';
import ShareScreen from './components/ShareScreen';
import GalleryScreen from './components/GalleryScreen';
import PatternScreen from './components/PatternScreen';

const STORAGE_KEY = 'dream-factory-state';

function loadDreams(): DreamEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw);
      if (state.dreams && state.dreams.length > 0) return state.dreams;
    }
  } catch { /* ignore */ }
  const seeds = createSeedData();
  saveDreams(seeds);
  return seeds;
}

function saveDreams(dreams: DreamEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    dreams,
    lastVisit: new Date().toISOString(),
    demoSeeded: true,
  }));
}

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('intro');
  const [dreams, setDreams] = useState<DreamEntry[]>(() => loadDreams());

  const [scene, setScene] = useState<DreamScene>({ place: null, weather: null, characters: [], objects: [] });
  const [emotions, setEmotions] = useState<DreamEmotionKey[]>([]);
  const [vividness, setVividness] = useState<1|2|3|4|5>(3);
  const [memo, setMemo] = useState('');

  const [currentEntry, setCurrentEntry] = useState<DreamEntry | null>(null);
  const [viewEntry, setViewEntry] = useState<DreamEntry | null>(null);

  useEffect(() => { saveDreams(dreams); }, [dreams]);

  const resetDreamState = useCallback(() => {
    setScene({ place: null, weather: null, characters: [], objects: [] });
    setEmotions([]);
    setVividness(3);
    setMemo('');
    setCurrentEntry(null);
    setViewEntry(null);
  }, []);

  const navigate = useCallback((s: ScreenName) => { setScreen(s); }, []);

  const handleStartDream = useCallback(() => {
    resetDreamState();
    navigate('sceneBuilder');
  }, [resetDreamState, navigate]);

  const handleAnalysisComplete = useCallback(() => {
    const lastTitle = dreams.length > 0 ? dreams[0].interpretation.title : undefined;
    const interp = generateInterpretation(
      scene.place as PlaceKey,
      scene.weather as WeatherKey,
      scene.characters,
      scene.objects,
      emotions,
      vividness,
      dreams,
      lastTitle,
    );
    const entry: DreamEntry = {
      id: `dream-${Date.now()}`,
      date: new Date().toISOString(),
      scene: {
        place: scene.place as PlaceKey,
        weather: scene.weather as WeatherKey,
        characters: scene.characters,
        objects: scene.objects,
      },
      emotions,
      vividness,
      memo: memo || undefined,
      interpretation: interp,
      gradientType: emotions[0],
    };
    setCurrentEntry(entry);
    navigate('interpretation');
  }, [scene, emotions, vividness, memo, navigate]);

  const handleSaveDream = useCallback(() => {
    if (currentEntry) {
      setDreams(prev => [currentEntry, ...prev]);
      navigate('gallery');
    }
  }, [currentEntry, navigate]);

  const handleViewDream = useCallback((entry: DreamEntry) => {
    setViewEntry(entry);
    navigate('interpretation');
  }, [navigate]);

  const handleUpdateJournalMemo = useCallback((id: string, journalMemo: string) => {
    setDreams(prev => prev.map(d => d.id === id ? { ...d, journalMemo } : d));
    if (viewEntry && viewEntry.id === id) {
      setViewEntry(prev => prev ? { ...prev, journalMemo } : prev);
    }
  }, [viewEntry]);

  const handleDeleteDream = useCallback((id: string) => {
    setDreams(prev => prev.filter(d => d.id !== id));
  }, []);

  const activeEntry = viewEntry || currentEntry;
  const isViewMode = !!viewEntry;

  return (
    <div className="min-h-[100dvh] bg-surface relative overflow-hidden">
      {screen === 'intro' && (
        <IntroScreen
          dreams={dreams}
          onStartDream={handleStartDream}
          onGoGallery={() => navigate('gallery')}
          onViewDream={handleViewDream}
        />
      )}
      {screen === 'sceneBuilder' && (
        <SceneBuilderScreen
          scene={scene}
          onSceneChange={setScene}
          onNext={() => navigate('emotion')}
          onBack={() => navigate('intro')}
        />
      )}
      {screen === 'emotion' && (
        <EmotionScreen
          emotions={emotions}
          vividness={vividness}
          memo={memo}
          onEmotionsChange={setEmotions}
          onVividnessChange={setVividness}
          onMemoChange={setMemo}
          onNext={() => navigate('analysis')}
          onBack={() => navigate('sceneBuilder')}
        />
      )}
      {screen === 'analysis' && (
        <AnalysisScreen onComplete={handleAnalysisComplete} />
      )}
      {screen === 'interpretation' && activeEntry && (
        <InterpretationScreen
          entry={activeEntry}
          isViewMode={isViewMode}
          onSave={handleSaveDream}
          onShare={() => navigate('share')}
          onRestart={() => { resetDreamState(); navigate('intro'); }}
          onBack={() => navigate(isViewMode ? 'gallery' : 'intro')}
          onUpdateJournalMemo={handleUpdateJournalMemo}
        />
      )}
      {screen === 'share' && activeEntry && (
        <ShareScreen
          entry={activeEntry}
          onBack={() => navigate('interpretation')}
        />
      )}
      {screen === 'gallery' && (
        <GalleryScreen
          dreams={dreams}
          onViewDream={handleViewDream}
          onGoPattern={() => navigate('pattern')}
          onBack={() => navigate('intro')}
          onStartDream={handleStartDream}
          onDeleteDream={handleDeleteDream}
        />
      )}
      {screen === 'pattern' && (
        <PatternScreen
          dreams={dreams}
          onGoGallery={() => navigate('gallery')}
          onBack={() => navigate('gallery')}
        />
      )}
    </div>
  );
}
