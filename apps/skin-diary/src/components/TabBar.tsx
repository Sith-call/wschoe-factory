import React from 'react';

interface Props {
  activeTab: 'home' | 'calendar' | 'insight';
  onTabChange: (tab: 'home' | 'calendar' | 'insight') => void;
}

const tabs = [
  { key: 'home' as const, label: '홈', icon: 'home_max' },
  { key: 'calendar' as const, label: '캘린더', icon: 'calendar_today' },
  { key: 'insight' as const, label: '인사이트', icon: 'insights' },
];

export function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-8 h-20 bg-[#fdf8f4]/80 backdrop-blur-xl shadow-[0_-4px_30px_rgba(82,67,65,0.08)] rounded-t-[32px]">
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <a
            key={tab.key}
            onClick={(e) => { e.preventDefault(); onTabChange(tab.key); }}
            href="#"
            className={`flex flex-col items-center justify-center tap-highlight-transparent ${
              isActive
                ? 'text-[#855048] border-b-2 border-[#855048] pb-1'
                : 'text-[#524341] opacity-60 hover:text-[#855048] transition-colors'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              data-icon={tab.icon}
            >
              {tab.icon}
            </span>
            <span className="font-manrope text-[11px] font-medium tracking-wide">
              {tab.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
