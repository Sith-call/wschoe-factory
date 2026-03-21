import React from 'react';
import { TimerOption } from '../types';

interface Props {
  masterVolume: number;
  onMasterVolumeChange: (v: number) => void;
  timerOption: TimerOption;
  onTimerChange: (t: TimerOption) => void;
  timerRemaining: number | null; // seconds remaining, null = no timer
  isAnyActive: boolean;
  onStopAll: () => void;
  isFadingOut?: boolean;
}

const TIMER_OPTIONS: TimerOption[] = [0, 15, 30, 60];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 8v4h3l4 4V4L6 8H3z"
        fill="#365314"
      />
      <path
        d="M13 7.5c0.8 0.8 1.2 1.8 1.2 2.5s-0.4 1.7-1.2 2.5"
        stroke="#365314"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 5.5c1.4 1.4 2 3 2 4.5s-0.6 3.1-2 4.5"
        stroke="#365314"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="9" r="6" stroke="#365314" strokeWidth="1.5" />
      <line x1="8" y1="9" x2="8" y2="6" stroke="#365314" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="2" x2="10" y2="2" stroke="#365314" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function MasterControls({
  masterVolume,
  onMasterVolumeChange,
  timerOption,
  onTimerChange,
  timerRemaining,
  isAnyActive,
  onStopAll,
  isFadingOut,
}: Props) {
  return (
    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
      {/* Master Volume */}
      <div className="flex items-center gap-3 mb-4">
        <SpeakerIcon />
        <input
          type="range"
          min={0}
          max={100}
          value={masterVolume}
          onChange={(e) => onMasterVolumeChange(Number(e.target.value))}
          className="slider-master flex-1 h-8"
        />
        <span className="text-sm text-forest font-semibold font-outfit w-8 text-right tabular-nums">
          {masterVolume}
        </span>
        {isAnyActive && (
          <button
            onClick={onStopAll}
            className="ml-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
          >
            Stop
          </button>
        )}
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2">
        <TimerIcon />
        <span className="text-xs text-gray-500 font-nanum mr-1">타이머</span>
        <div className="flex gap-1.5">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => onTimerChange(opt)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                timerOption === opt
                  ? 'bg-forest text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt === 0 ? 'Off' : `${opt}m`}
            </button>
          ))}
        </div>
        {timerRemaining !== null && timerRemaining > 0 && (
          <span className="ml-auto text-sm font-bold text-forest font-outfit tabular-nums">
            {formatTime(timerRemaining)}
          </span>
        )}
        {isFadingOut && (
          <span className="ml-auto text-xs text-gray-400 font-nanum">
            페이드 아웃...
          </span>
        )}
      </div>
    </div>
  );
}
