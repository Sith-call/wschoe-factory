import React from 'react';
import { TabId } from '../types';

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

interface TabItem {
  id: TabId;
  icon: string;
  label: string;
}

const tabs: TabItem[] = [
  { id: 'home', icon: 'meeting_room', label: '로비' },
  { id: 'concepts', icon: 'inventory_2', label: '아카이브' },
  { id: 'lab', icon: 'biotech', label: '실험동' },
  { id: 'progress', icon: 'menu_book', label: '연구 일지' },
];

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#fbf9f6]/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-[#040d1b]/5 shadow-[0_-4px_20px_rgba(27,28,26,0.04)] rounded-t-xl overflow-hidden">
      <div className="flex justify-around items-center px-4 pb-6 pt-3">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={
                isActive
                  ? "flex flex-col items-center justify-center text-[#7e5703] dark:text-[#ffc971] font-bold active:scale-90 duration-150 transition-opacity hover:opacity-80"
                  : "flex flex-col items-center justify-center text-[#040d1b]/40 dark:text-slate-500 active:scale-90 duration-150 transition-opacity hover:opacity-80"
              }
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="font-['Manrope'] text-[10px] font-medium tracking-tight mt-1">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
