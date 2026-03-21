import React from 'react';
import { LayoutType } from '../types';

interface LayoutSelectorProps {
  selected: LayoutType;
  onSelect: (layout: LayoutType) => void;
}

const layouts: { type: LayoutType; label: string; description: string }[] = [
  { type: 'rectangle', label: '직사각형 테이블', description: '회의/식사 자리' },
  { type: 'circle', label: '원형 테이블', description: '원탁 배치' },
  { type: 'grid', label: '교실 배치', description: '격자형 좌석' },
];

function LayoutIcon({ type, active }: { type: LayoutType; active: boolean }) {
  const color = active ? '#059669' : '#9ca3af';

  if (type === 'rectangle') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="14" width="28" height="20" rx="3" stroke={color} strokeWidth="2" fill="none" />
        <circle cx="18" cy="10" r="3" fill={color} />
        <circle cx="30" cy="10" r="3" fill={color} />
        <circle cx="18" cy="38" r="3" fill={color} />
        <circle cx="30" cy="38" r="3" fill={color} />
        <circle cx="6" cy="24" r="3" fill={color} />
        <circle cx="42" cy="24" r="3" fill={color} />
      </svg>
    );
  }

  if (type === 'circle') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="2" fill="none" />
        <circle cx="24" cy="6" r="3" fill={color} />
        <circle cx="24" cy="42" r="3" fill={color} />
        <circle cx="6" cy="24" r="3" fill={color} />
        <circle cx="42" cy="24" r="3" fill={color} />
        <circle cx="11" cy="11" r="3" fill={color} />
        <circle cx="37" cy="37" r="3" fill={color} />
        <circle cx="37" cy="11" r="3" fill={color} />
        <circle cx="11" cy="37" r="3" fill={color} />
      </svg>
    );
  }

  // grid
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="19" y="8" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="32" y="8" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="6" y="20" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="19" y="20" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="32" y="20" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="6" y="32" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="19" y="32" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="32" y="32" width="10" height="8" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function LayoutSelector({ selected, onSelect }: LayoutSelectorProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">배치 선택</h2>
      <div className="grid grid-cols-3 gap-3">
        {layouts.map(({ type, label, description }) => {
          const isActive = selected === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                isActive
                  ? 'border-primary bg-primary-light shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <LayoutIcon type={type} active={isActive} />
              <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-gray-700'}`}>
                {label}
              </span>
              <span className="text-xs text-gray-400">{description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
