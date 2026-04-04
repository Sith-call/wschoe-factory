import React from 'react';
import { Home, Grid3X3, BarChart2, Settings, Network, FlaskConical } from 'lucide-react';
import { Screen } from '../types';

interface TabBarProps {
  currentScreen: Screen;
  navigate: (s: Screen) => void;
}

const tabs: { label: string; icon: React.ElementType; screen: Screen; match: string[] }[] = [
  { label: '홈', icon: Home, screen: { type: 'home' }, match: ['home'] },
  { label: '카테고리', icon: Grid3X3, screen: { type: 'categories' }, match: ['categories', 'termList', 'termCard', 'quiz', 'lab'] },
  { label: '실험', icon: FlaskConical, screen: { type: 'labList' }, match: ['labList'] },
  { label: '맵', icon: Network, screen: { type: 'mindmap' }, match: ['mindmap'] },
  { label: '진도', icon: BarChart2, screen: { type: 'progress' }, match: ['progress'] },
];

export function TabBar({ currentScreen, navigate }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-card border-t border-border z-50">
      <div className="max-w-screen-md mx-auto flex">
        {tabs.map((tab) => {
          const active = tab.match.includes(currentScreen.type);
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.screen)}
              className="flex-1 flex flex-col items-center py-2 relative"
            >
              {active && (
                <div className="absolute top-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
              )}
              <Icon
                size={20}
                strokeWidth={1.5}
                className={active ? 'text-primary' : 'text-ink-secondary'}
              />
              <span
                className={`text-xs mt-1 font-body ${
                  active ? 'text-primary font-medium' : 'text-ink-secondary'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
