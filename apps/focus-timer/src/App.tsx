import { useState, useCallback } from 'react';
import TimerScreen from './components/TimerScreen';
import StatsScreen from './components/StatsScreen';
import SettingsScreen from './components/SettingsScreen';
import Toast from './components/Toast';

type Tab = 'timer' | 'stats' | 'settings';

interface ToastData {
  id: number;
  emoji: string;
  message: string;
  subMessage?: string;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'timer', label: '타이머', icon: 'timer' },
  { id: 'stats', label: '통계', icon: 'bar_chart' },
  { id: 'settings', label: '설정', icon: 'settings' },
];

let toastIdCounter = 0;

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const handleToast = useCallback((emoji: string, message: string, subMessage?: string) => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, emoji, message, subMessage }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Toast notifications */}
      {toasts.length > 0 && (
        <Toast
          emoji={toasts[0].emoji}
          message={toasts[0].message}
          subMessage={toasts[0].subMessage}
          onDismiss={() => dismissToast(toasts[0].id)}
        />
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto pb-[56px]">
        <div key={activeTab} className="animate-fade-in">
          {activeTab === 'timer' && <TimerScreen onToast={handleToast} />}
          {activeTab === 'stats' && <StatsScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
        </div>
      </div>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-[56px] bg-surface-container border-t border-outline-variant flex items-center justify-around z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] transition-colors duration-200 ${
              activeTab === tab.id ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">{tab.icon}</span>
            <span className="text-[12px] mt-0.5 font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
