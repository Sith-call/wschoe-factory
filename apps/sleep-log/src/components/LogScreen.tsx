import React, { useState, useEffect } from 'react';
import {
  BrokenMoonIcon, CloudMoonIcon, HalfMoonIcon, FullMoonIcon, StarIcon,
  CoffeeIcon, RunIcon, WineIcon, BrainIcon, ForkIcon, PhoneIcon, CheckIcon,
  BackIcon
} from '../icons';
import { getSettings, calculateDuration, formatDuration, saveRecord, formatDate } from '../store';
import { Factor, SleepRecord } from '../types';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

function adjustTime(time: string, deltaMinutes: number): string {
  const [h, m] = time.split(':').map(Number);
  let total = h * 60 + m + deltaMinutes;
  if (total < 0) total += 24 * 60;
  total = total % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function getCurrentTimeRounded(): string {
  const now = new Date();
  const m = Math.round(now.getMinutes() / 10) * 10;
  const h = m === 60 ? (now.getHours() + 1) % 24 : now.getHours();
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export const LogScreen: React.FC<Props> = ({ onComplete, onBack }) => {
  const settings = getSettings();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [animKey, setAnimKey] = useState(0);

  const [bedtime, setBedtime] = useState(settings.typicalBedtime || '23:00');
  const [wakeTime, setWakeTime] = useState(settings.typicalWakeTime || '07:00');
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [saved, setSaved] = useState(false);

  const duration = calculateDuration(bedtime, wakeTime);

  const goNext = () => {
    if (step < 4) {
      setDirection('left');
      setAnimKey(k => k + 1);
      setStep(s => s + 1);
    }
  };

  const goPrev = () => {
    if (step > 1) {
      setDirection('right');
      setAnimKey(k => k + 1);
      setStep(s => s - 1);
    } else {
      onBack();
    }
  };

  const toggleFactor = (f: Factor) => {
    if (f === 'none') {
      setFactors(['none']);
      return;
    }
    setFactors(prev => {
      const without = prev.filter(x => x !== 'none');
      if (without.includes(f)) {
        return without.filter(x => x !== f);
      }
      return [...without, f];
    });
  };

  const handleSave = () => {
    const todayStr = formatDate(new Date());
    const record: SleepRecord = {
      date: todayStr,
      bedtime,
      wakeTime,
      duration,
      quality,
      factors: factors.length === 0 ? ['none'] : factors,
      createdAt: new Date().toISOString(),
    };
    saveRecord(record);
    setSaved(true);
    setTimeout(() => onComplete(), 1200);
  };

  if (saved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <div className="text-primary mb-4">
          <CheckIcon size={48} strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">기록 완료</h2>
        <p className="text-sm text-text-secondary">{formatDuration(duration)} 수면이 기록되었습니다</p>
      </div>
    );
  }

  const qualityOptions: { value: 1 | 2 | 3 | 4 | 5; icon: React.ReactNode; label: string }[] = [
    { value: 1, icon: <BrokenMoonIcon size={36} />, label: '최악' },
    { value: 2, icon: <CloudMoonIcon size={36} />, label: '나쁨' },
    { value: 3, icon: <HalfMoonIcon size={36} />, label: '보통' },
    { value: 4, icon: <FullMoonIcon size={36} />, label: '좋음' },
    { value: 5, icon: <StarIcon size={36} />, label: '최고' },
  ];

  const factorOptions: { value: Factor; icon: React.ReactNode; label: string }[] = [
    { value: 'caffeine', icon: <CoffeeIcon size={22} />, label: '카페인' },
    { value: 'exercise', icon: <RunIcon size={22} />, label: '운동' },
    { value: 'alcohol', icon: <WineIcon size={22} />, label: '음주' },
    { value: 'stress', icon: <BrainIcon size={22} />, label: '스트레스' },
    { value: 'lateFood', icon: <ForkIcon size={22} />, label: '야식' },
    { value: 'screenTime', icon: <PhoneIcon size={22} />, label: '스크린타임' },
    { value: 'none', icon: <CheckIcon size={22} />, label: '없음' },
  ];

  return (
    <div className="min-h-screen flex flex-col px-5">
      {/* Header */}
      <div className="flex items-center pt-6 pb-4">
        <button onClick={goPrev} className="p-2 -ml-2" style={{ minWidth: '44px', minHeight: '44px' }}>
          <BackIcon size={20} className="text-text-primary" />
        </button>
        <div className="flex-1" />
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`w-2.5 h-2.5 rounded-full ${s === step ? 'bg-primary' : s < step ? 'bg-primary-light' : 'bg-border'}`}
          />
        ))}
      </div>

      {/* Step content */}
      <div
        key={animKey}
        className={direction === 'left' ? 'slide-left-enter' : 'slide-right-enter'}
        style={{ flex: 1 }}
      >
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-8">어젯밤 몇 시에 잤나요?</h2>
            <div className="flex flex-col items-center">
              <div className="font-dm font-bold text-text-primary mb-6" style={{ fontSize: '48px' }}>
                {bedtime}
              </div>
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() => setBedtime(adjustTime(bedtime, -60))}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
                  style={{ minHeight: '44px' }}
                >
                  -1시간
                </button>
                <button
                  onClick={() => setBedtime(adjustTime(bedtime, 60))}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
                  style={{ minHeight: '44px' }}
                >
                  +1시간
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setBedtime(adjustTime(bedtime, -10))}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
                  style={{ minHeight: '44px' }}
                >
                  -10분
                </button>
                <button
                  onClick={() => setBedtime(adjustTime(bedtime, 10))}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
                  style={{ minHeight: '44px' }}
                >
                  +10분
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-8">오늘 몇 시에 일어났나요?</h2>
            <div className="flex flex-col items-center">
              <div className="font-dm font-bold text-text-primary mb-2" style={{ fontSize: '48px' }}>
                {wakeTime}
              </div>
              <div className="text-sm text-primary font-semibold mb-6">
                {formatDuration(duration)} 잤어요
              </div>
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() => setWakeTime(adjustTime(wakeTime, -60))}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
                  style={{ minHeight: '44px' }}
                >
                  -1시간
                </button>
                <button
                  onClick={() => setWakeTime(adjustTime(wakeTime, 60))}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
                  style={{ minHeight: '44px' }}
                >
                  +1시간
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setWakeTime(adjustTime(wakeTime, -10))}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
                  style={{ minHeight: '44px' }}
                >
                  -10분
                </button>
                <button
                  onClick={() => setWakeTime(adjustTime(wakeTime, 10))}
                  className="px-4 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
                  style={{ minHeight: '44px' }}
                >
                  +10분
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-8">수면의 질은 어땠나요?</h2>
            <div className="flex justify-between px-2">
              {qualityOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setQuality(opt.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                    quality === opt.value
                      ? 'bg-primary-light text-primary'
                      : 'text-text-tertiary'
                  }`}
                  style={{ minWidth: '56px', minHeight: '44px' }}
                >
                  <div className={quality === opt.value ? 'text-primary' : 'text-text-tertiary'}>
                    {opt.icon}
                  </div>
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-8">수면에 영향을 준 것이 있나요?</h2>
            <div className="grid grid-cols-2 gap-3">
              {factorOptions.map(opt => {
                const selected = factors.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleFactor(opt.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-colors ${
                      selected
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border bg-surface text-text-secondary'
                    }`}
                    style={{ minHeight: '52px' }}
                  >
                    <div className={selected ? 'text-primary' : 'text-text-tertiary'}>{opt.icon}</div>
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="py-6">
        {step < 4 ? (
          <button
            onClick={goNext}
            className="w-full bg-primary text-white py-3.5 rounded-lg font-bold text-base"
            style={{ minHeight: '48px' }}
          >
            다음
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-3.5 rounded-lg font-bold text-base"
            style={{ minHeight: '48px' }}
          >
            기록 완료
          </button>
        )}
      </div>
    </div>
  );
};
