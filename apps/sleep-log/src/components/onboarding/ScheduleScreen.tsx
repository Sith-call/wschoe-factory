import React, { useState } from 'react';
import { MoonIcon, SunIcon } from '../../icons';

interface Props {
  onComplete: (bedtime: string, wakeTime: string) => void;
  onBack: () => void;
}

function adjustTime(time: string, deltaMinutes: number): string {
  const [h, m] = time.split(':').map(Number);
  let total = h * 60 + m + deltaMinutes;
  if (total < 0) total += 24 * 60;
  total = total % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export const ScheduleScreen: React.FC<Props> = ({ onComplete, onBack }) => {
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');

  return (
    <div className="min-h-screen flex flex-col px-6 pt-16">
      <button onClick={onBack} className="text-text-secondary mb-8 self-start text-sm" style={{ minHeight: '44px' }}>
        ← 이전
      </button>

      <h1 className="text-xl font-bold text-text-primary mb-2">평소 수면 패턴</h1>
      <p className="text-sm text-text-tertiary mb-10">평소 잠자리에 드는 시간과 일어나는 시간을 알려주세요</p>

      {/* Bedtime */}
      <div className="bg-surface rounded-xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <MoonIcon size={20} className="text-primary" />
          <span className="text-sm font-semibold text-text-primary">취침 시간</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setBedtime(adjustTime(bedtime, -30))}
            className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-text-secondary"
          >
            -30분
          </button>
          <span className="font-dm text-4xl font-bold text-text-primary" style={{ fontSize: '48px', minWidth: '140px', textAlign: 'center' }}>
            {bedtime}
          </span>
          <button
            onClick={() => setBedtime(adjustTime(bedtime, 30))}
            className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-text-secondary"
          >
            +30분
          </button>
        </div>
      </div>

      {/* Wake time */}
      <div className="bg-surface rounded-xl p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <SunIcon size={20} className="text-accent" />
          <span className="text-sm font-semibold text-text-primary">기상 시간</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setWakeTime(adjustTime(wakeTime, -30))}
            className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-text-secondary"
          >
            -30분
          </button>
          <span className="font-dm text-4xl font-bold text-text-primary" style={{ fontSize: '48px', minWidth: '140px', textAlign: 'center' }}>
            {wakeTime}
          </span>
          <button
            onClick={() => setWakeTime(adjustTime(wakeTime, 30))}
            className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-text-secondary"
          >
            +30분
          </button>
        </div>
      </div>

      <button
        onClick={() => onComplete(bedtime, wakeTime)}
        className="w-full bg-primary text-white py-3.5 rounded-lg font-bold text-base"
        style={{ minHeight: '48px' }}
      >
        완료
      </button>
    </div>
  );
};
