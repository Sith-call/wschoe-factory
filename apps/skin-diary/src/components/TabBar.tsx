import React from 'react';

interface TabBarProps {
  activeTab: 'home' | 'calendar' | 'insight';
  onTabChange: (tab: 'home' | 'calendar' | 'insight') => void;
}

const tabs: { id: 'home' | 'calendar' | 'insight'; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'calendar', label: '캘린더' },
  { id: 'insight', label: '인사이트' },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-sd-surface border-t border-sd-border flex justify-around"
      style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', paddingTop: '12px' }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`font-body text-[0.9375rem] pb-1 border-b-2 transition-colors duration-100 min-h-[44px] min-w-[44px] px-3 flex items-center justify-center ${
            activeTab === tab.id
              ? 'text-sd-primary font-medium border-sd-primary'
              : 'text-sd-text-tertiary font-normal border-transparent'
          }`}
          aria-label={tab.label}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
