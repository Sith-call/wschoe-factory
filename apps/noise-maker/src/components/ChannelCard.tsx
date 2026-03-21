import React from 'react';
import { ChannelState, SoundType } from '../types';

interface Props {
  channel: ChannelState;
  onToggle: (type: SoundType) => void;
  onVolumeChange: (type: SoundType, volume: number) => void;
}

function SoundIcon({ type, active }: { type: SoundType; active: boolean }) {
  const color = active ? '#365314' : '#9ca3af';

  switch (type) {
    case 'white':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="10" stroke={color} strokeWidth="2" />
          <circle cx="14" cy="14" r="4" fill={color} />
        </svg>
      );
    case 'brown':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="10" stroke={color} strokeWidth="2" />
          <circle cx="14" cy="14" r="7" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="14" cy="14" r="3" fill={color} />
        </svg>
      );
    case 'pink':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="10" stroke={color} strokeWidth="2" />
          <circle cx="10" cy="14" r="2.5" fill={color} />
          <circle cx="18" cy="14" r="2.5" fill={color} />
          <circle cx="14" cy="10" r="2.5" fill={color} />
        </svg>
      );
    case 'rain':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <line x1="8" y1="6" x2="8" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="4" x2="14" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="7" x2="20" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="11" y1="14" x2="11" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="17" y1="16" x2="17" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'wind':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M4 10h16c2.2 0 4-1.8 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 14h12c2.2 0 4 1.8 4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 18h8c1.65 0 3-1.35 3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'ocean':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0 4 3 6 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M2 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0 4 3 6 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

function Equalizer({ active }: { active: boolean }) {
  const barClass = active ? '' : 'eq-bar-idle';
  const bg = active ? 'bg-lime-500' : 'bg-gray-300';

  return (
    <div className="flex items-end gap-[3px] h-6">
      <div className={`w-[4px] rounded-full ${bg} eq-bar-1 ${barClass}`} />
      <div className={`w-[4px] rounded-full ${bg} eq-bar-2 ${barClass}`} />
      <div className={`w-[4px] rounded-full ${bg} eq-bar-3 ${barClass}`} />
    </div>
  );
}

export default function ChannelCard({ channel, onToggle, onVolumeChange }: Props) {
  const { type, label, labelKo, active, volume } = channel;

  return (
    <div
      className={`rounded-xl p-4 transition-colors duration-200 ${
        active ? 'bg-surface border-2 border-lime-400' : 'bg-white border-2 border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SoundIcon type={type} active={active} />
          <div>
            <p className="font-semibold text-sm text-forest font-outfit leading-tight">{label}</p>
            <p className="text-xs text-gray-500 font-nanum">{labelKo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Equalizer active={active} />
          <button
            onClick={() => onToggle(type)}
            className={`w-10 h-6 rounded-full transition-colors duration-200 relative ${
              active ? 'bg-forest' : 'bg-gray-300'
            }`}
            aria-label={`${label} ${active ? 'off' : 'on'}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                active ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolumeChange(type, Number(e.target.value))}
          className="slider-channel flex-1 h-6"
          disabled={!active}
        />
        <span className="text-xs text-gray-400 w-8 text-right font-outfit tabular-nums">
          {volume}
        </span>
      </div>
    </div>
  );
}
