import React, { useState } from 'react';
import { getSettings, saveSettings, loadDemoData, clearData, isDemoMode } from '../store';

interface Props {
  onDataChange: () => void;
}

function adjustTime(time: string, deltaMinutes: number): string {
  const [h, m] = time.split(':').map(Number);
  let total = h * 60 + m + deltaMinutes;
  if (total < 0) total += 24 * 60;
  total = total % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export const SettingsScreen: React.FC<Props> = ({ onDataChange }) => {
  const [settings, setSettings] = useState(getSettings());
  const [showConfirm, setShowConfirm] = useState(false);
  const [demo, setDemo] = useState(isDemoMode());

  const updateGoal = (delta: number) => {
    const newGoal = Math.round((settings.goalHours + delta) * 10) / 10;
    if (newGoal >= 5 && newGoal <= 10) {
      const updated = { ...settings, goalHours: newGoal };
      setSettings(updated);
      saveSettings(updated);
    }
  };

  const updateBedtime = (delta: number) => {
    const updated = { ...settings, typicalBedtime: adjustTime(settings.typicalBedtime, delta) };
    setSettings(updated);
    saveSettings(updated);
  };

  const updateWakeTime = (delta: number) => {
    const updated = { ...settings, typicalWakeTime: adjustTime(settings.typicalWakeTime, delta) };
    setSettings(updated);
    saveSettings(updated);
  };

  const toggleDemo = () => {
    if (!demo) {
      loadDemoData();
      setDemo(true);
      onDataChange();
    }
  };

  const handleClear = () => {
    clearData();
    setDemo(false);
    setShowConfirm(false);
    onDataChange();
  };

  return (
    <div className="px-5 pb-8">
      <h1 className="text-xl font-bold text-text-primary pt-6 mb-6">설정</h1>

      {/* Goal hours */}
      <div className="bg-surface rounded-xl p-5 mb-3">
        <div className="text-sm font-semibold text-text-primary mb-3">목표 수면 시간</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => updateGoal(-0.5)}
            className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-text-secondary"
          >
            -
          </button>
          <span className="font-dm text-2xl font-bold text-text-primary">{settings.goalHours}시간</span>
          <button
            onClick={() => updateGoal(0.5)}
            className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-text-secondary"
          >
            +
          </button>
        </div>
      </div>

      {/* Bedtime */}
      <div className="bg-surface rounded-xl p-5 mb-3">
        <div className="text-sm font-semibold text-text-primary mb-3">취침 시간</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => updateBedtime(-30)}
            className="px-3 py-2 rounded-lg border border-border text-xs text-text-secondary"
            style={{ minHeight: '44px' }}
          >
            -30분
          </button>
          <span className="font-dm text-2xl font-bold text-text-primary">{settings.typicalBedtime}</span>
          <button
            onClick={() => updateBedtime(30)}
            className="px-3 py-2 rounded-lg border border-border text-xs text-text-secondary"
            style={{ minHeight: '44px' }}
          >
            +30분
          </button>
        </div>
      </div>

      {/* Wake time */}
      <div className="bg-surface rounded-xl p-5 mb-3">
        <div className="text-sm font-semibold text-text-primary mb-3">기상 시간</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => updateWakeTime(-30)}
            className="px-3 py-2 rounded-lg border border-border text-xs text-text-secondary"
            style={{ minHeight: '44px' }}
          >
            -30분
          </button>
          <span className="font-dm text-2xl font-bold text-text-primary">{settings.typicalWakeTime}</span>
          <button
            onClick={() => updateWakeTime(30)}
            className="px-3 py-2 rounded-lg border border-border text-xs text-text-secondary"
            style={{ minHeight: '44px' }}
          >
            +30분
          </button>
        </div>
      </div>

      {/* Demo mode */}
      <div className="bg-surface rounded-xl p-5 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-text-primary">데모 모드</div>
            <div className="text-xs text-text-tertiary mt-0.5">30일간의 샘플 데이터 불러오기</div>
          </div>
          <button
            onClick={toggleDemo}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              demo
                ? 'bg-primary-light text-primary'
                : 'bg-primary text-white'
            }`}
            style={{ minHeight: '44px' }}
            disabled={demo}
          >
            {demo ? '적용됨' : '불러오기'}
          </button>
        </div>
      </div>

      {/* Clear data */}
      <div className="bg-surface rounded-xl p-5 mb-3">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-red-500 font-semibold"
            style={{ minHeight: '44px' }}
          >
            데이터 초기화
          </button>
        ) : (
          <div>
            <p className="text-sm text-text-secondary mb-3">모든 수면 기록이 삭제됩니다. 계속하시겠습니까?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-border text-sm text-text-secondary"
                style={{ minHeight: '44px' }}
              >
                취소
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold"
                style={{ minHeight: '44px' }}
              >
                삭제
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Version */}
      <div className="text-center text-xs text-text-tertiary mt-6">
        앱 버전: v0.1.0
      </div>
    </div>
  );
};
