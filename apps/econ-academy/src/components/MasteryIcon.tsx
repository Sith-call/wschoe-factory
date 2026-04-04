import React from 'react';
import { Lock, Check } from 'lucide-react';
import { MasteryLevel } from '../types';

interface MasteryIconProps {
  level: MasteryLevel;
  locked?: boolean;
  size?: number;
}

export function MasteryIcon({ level, locked = false, size = 24 }: MasteryIconProps) {
  if (locked) {
    return <Lock size={size} strokeWidth={1.5} className="text-locked" />;
  }

  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  if (level === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle cx={cx} cy={cy} r={r} stroke="#D6D3D1" strokeWidth={1.5} />
      </svg>
    );
  }

  if (level === 1) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle cx={cx} cy={cy} r={r} stroke="#0D9488" strokeWidth={1.5} />
        <path
          d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Z`}
          fill="#99F6E4"
        />
      </svg>
    );
  }

  if (level === 2) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle cx={cx} cy={cy} r={r} fill="#2DD4BF" stroke="#0D9488" strokeWidth={1.5} />
        <path
          d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r * 0.87} ${cy + r * 0.5} L ${cx} ${cy} Z`}
          fill="white"
          opacity={0.5}
        />
      </svg>
    );
  }

  // level === 3
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cy} r={r} fill="#0D9488" stroke="#0F766E" strokeWidth={1.5} />
      <Check
        size={size * 0.55}
        strokeWidth={2.5}
        color="white"
        style={{
          position: 'absolute',
          left: size * 0.225,
          top: size * 0.225,
        }}
      />
      <polyline
        points={`${cx - r * 0.3} ${cy},${cx - r * 0.05} ${cy + r * 0.3},${cx + r * 0.35} ${cy - r * 0.25}`}
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
