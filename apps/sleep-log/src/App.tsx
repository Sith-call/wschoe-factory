import React, { useState, useCallback } from 'react';
import { Screen } from './types';
import { getSettings, saveSettings, loadDemoData } from './store';
import { HomeIcon, CalendarIcon, ChartIcon, SettingsIcon, ShareIcon } from './icons';
import { IntroScreen } from './components/onboarding/IntroScreen';
import { GoalScreen } from './components/onboarding/GoalScreen';
import { ScheduleScreen } from './components/onboarding/ScheduleScreen';
import { HomeScreen } from './components/HomeScreen';
import { LogScreen } from './components/LogScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { InsightScreen } from './components/InsightScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ShareCard } from './components/ShareCard';

type OnboardingStep = 'intro' | 'goal' | 'schedule';

type NavTab = 'home' | 'calendar' | 'insight' | 'settings';

const navItems: { key: NavTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { key: 'home', label: '홈', icon: HomeIcon },
  { key: 'calendar', label: '캘린더', icon: CalendarIcon },
  { key: 'insight', label: '인사이트', icon: ChartIcon },
  { key: 'settings', label: '설정', icon: SettingsIcon },
];

export default function App() {
  const [settings, setSettingsState] = useState(getSettings());
  const [screen, setScreen] = useState<Screen>(settings.onboardingDone ? 'home' : 'onboarding');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('intro');
  const [goalDraft, setGoalDraft] = useState(settings.goalHours);
  const [revision, setRevision] = useState(0);
  const [showShare, setShowShare] = useState(false);

  const activeTab: NavTab = screen === 'home' ? 'home'
    : screen === 'calendar' ? 'calendar'
    : screen === 'insight' ? 'insight'
    : screen === 'settings' ? 'settings'
    : 'home';

  const refresh = useCallback(() => {
    setRevision(r => r + 1);
    setSettingsState(getSettings());
  }, []);

  // Force re-render
  void revision;

  // Onboarding
  if (screen === 'onboarding') {
    if (onboardingStep === 'intro') {
      return <IntroScreen onNext={() => setOnboardingStep('goal')} />;
    }
    if (onboardingStep === 'goal') {
      return (
        <GoalScreen
          initialGoal={goalDraft}
          onNext={(goal) => {
            setGoalDraft(goal);
            setOnboardingStep('schedule');
          }}
          onBack={() => setOnboardingStep('intro')}
        />
      );
    }
    if (onboardingStep === 'schedule') {
      return (
        <ScheduleScreen
          onComplete={(bedtime, wakeTime) => {
            const updated = {
              ...settings,
              goalHours: goalDraft,
              typicalBedtime: bedtime,
              typicalWakeTime: wakeTime,
              onboardingDone: true,
            };
            saveSettings(updated);
            setSettingsState(updated);
            loadDemoData();
            setScreen('home');
          }}
          onBack={() => setOnboardingStep('goal')}
        />
      );
    }
  }

  // Log flow (no nav)
  if (screen === 'log') {
    return (
      <LogScreen
        onComplete={() => {
          refresh();
          setScreen('home');
        }}
        onBack={() => setScreen('home')}
      />
    );
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto">
      {/* Top segment navigation */}
      <nav className="sticky top-0 bg-bg z-40">
        <div className="flex items-center px-5 pt-4 pb-2">
          <div className="flex gap-1 flex-1">
            {navItems.map(item => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setScreen(item.key as Screen)}
                  className={`flex items-center gap-1.5 px-3 py-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-primary font-bold border-b-2 border-primary'
                      : 'text-text-tertiary font-normal'
                  }`}
                  style={{ minHeight: '44px', fontSize: '14px' }}
                >
                  <item.icon size={16} className={isActive ? 'text-primary' : 'text-text-tertiary'} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Share button */}
          <button
            onClick={() => setShowShare(true)}
            className="p-2 text-text-tertiary"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <ShareIcon size={18} />
          </button>
        </div>
      </nav>

      {/* Screen content */}
      {activeTab === 'home' && <HomeScreen onLog={() => setScreen('log')} />}
      {activeTab === 'calendar' && <CalendarScreen />}
      {activeTab === 'insight' && <InsightScreen />}
      {activeTab === 'settings' && <SettingsScreen onDataChange={refresh} />}

      {/* Share modal */}
      {showShare && <ShareCard onClose={() => setShowShare(false)} />}
    </div>
  );
}
