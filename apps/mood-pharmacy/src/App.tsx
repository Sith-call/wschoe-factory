import { useState, useEffect, useCallback } from 'react';
import type { ScreenName, MoodLog, Prescription, MoodKey } from './types';
import { generatePrescription, generateDemoData, getStreak } from './data';
import IntroScreen from './components/IntroScreen';
import MoodCheckScreen from './components/MoodCheckScreen';
import PrescriptionScreen from './components/PrescriptionScreen';
import MoodHistoryScreen from './components/MoodHistoryScreen';
import PharmacyShelfScreen from './components/PharmacyShelfScreen';
import ProfileScreen from './components/ProfileScreen';

const STORAGE_KEY = 'mood-pharmacy-state';

interface SavedState {
  logs: MoodLog[];
  prescriptions: Prescription[];
  demoSeeded: boolean;
}

function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw) as SavedState;
      if (state.logs && state.prescriptions) return state;
    }
  } catch { /* ignore */ }
  return null;
}

function saveState(state: SavedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('intro');
  const [state, setState] = useState<SavedState>(() => {
    const saved = loadState();
    if (saved) return saved;
    // Seed demo data on first visit
    const demo = generateDemoData();
    return { logs: demo.logs, prescriptions: demo.prescriptions, demoSeeded: true };
  });
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const streak = getStreak(state.logs);
  const recentLog = state.logs.length > 0
    ? [...state.logs].sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;

  const navigate = useCallback((s: ScreenName) => setScreen(s), []);

  const handleMoodSubmit = useCallback((mood: MoodKey, intensity: number, memo: string) => {
    const rx = generatePrescription(mood, intensity, memo);
    const log: MoodLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mood,
      intensity,
      memo,
      prescriptionId: rx.id,
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      logs: [...prev.logs, log],
      prescriptions: [...prev.prescriptions, rx],
    }));
    setCurrentPrescription(rx);
    setScreen('prescription');
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.map(p =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      ),
    }));
    // Also update current prescription if it's the one being toggled
    setCurrentPrescription(prev =>
      prev && prev.id === id ? { ...prev, isFavorite: !prev.isFavorite } : prev
    );
  }, []);

  const handleReset = useCallback(() => {
    const demo = generateDemoData();
    setState({ logs: demo.logs, prescriptions: demo.prescriptions, demoSeeded: true });
    setCurrentPrescription(null);
    setScreen('intro');
  }, []);

  const showNav = !['moodCheck', 'prescription'].includes(screen);

  return (
    <div className="min-h-[100dvh] bg-surface relative overflow-hidden">
      {screen === 'intro' && (
        <IntroScreen
          recentLog={recentLog}
          streak={streak}
          onStartCheck={() => navigate('moodCheck')}
          onNavigate={navigate}
        />
      )}

      {screen === 'moodCheck' && (
        <MoodCheckScreen
          onSubmit={handleMoodSubmit}
          onBack={() => navigate('intro')}
        />
      )}

      {screen === 'prescription' && currentPrescription && (
        <PrescriptionScreen
          prescription={currentPrescription}
          onToggleFavorite={handleToggleFavorite}
          onDone={() => navigate('intro')}
          onBack={() => navigate('intro')}
        />
      )}

      {screen === 'history' && (
        <MoodHistoryScreen
          logs={state.logs}
          streak={streak}
          onBack={() => navigate('intro')}
        />
      )}

      {screen === 'shelf' && (
        <PharmacyShelfScreen
          prescriptions={state.prescriptions}
          onToggleFavorite={handleToggleFavorite}
          onBack={() => navigate('intro')}
        />
      )}

      {screen === 'profile' && (
        <ProfileScreen
          logs={state.logs}
          streak={streak}
          onReset={handleReset}
          onBack={() => navigate('intro')}
        />
      )}

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface-deep/95 backdrop-blur-sm border-t border-white/5 safe-area-bottom">
          <div className="flex max-w-[430px] mx-auto">
            {[
              { screen: 'intro' as const, emoji: '\uD83C\uDFFA', label: '약국' },
              { screen: 'history' as const, emoji: '\uD83D\uDCC5', label: '기록' },
              { screen: 'shelf' as const, emoji: '\uD83D\uDCDA', label: '처방전' },
              { screen: 'profile' as const, emoji: '\uD83D\uDC64', label: '프로필' },
            ].map(item => (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                  screen === item.screen ? 'text-teal-bright' : 'text-on-surface-muted'
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="text-[10px]">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
