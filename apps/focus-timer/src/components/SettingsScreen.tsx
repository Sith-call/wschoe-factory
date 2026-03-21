import { useState } from 'react';
import { getSettings, saveSettings, loadDemoData, clearData, isDemoMode } from '../store';

export default function SettingsScreen() {
  const [settings, setSettings] = useState(getSettings);
  const [demo, setDemo] = useState(isDemoMode);
  const [showConfirm, setShowConfirm] = useState(false);

  const updateFocusDuration = (value: number) => {
    const next = { ...settings, focusDuration: value };
    setSettings(next);
    saveSettings(next);
  };

  const updateBreakDuration = (value: number) => {
    const next = { ...settings, breakDuration: value };
    setSettings(next);
    saveSettings(next);
  };

  const handleDemoToggle = () => {
    if (!demo) {
      loadDemoData();
      setDemo(true);
    } else {
      clearData();
      setDemo(false);
    }
  };

  const handleResetAll = () => {
    clearData();
    setDemo(false);
    setShowConfirm(false);
  };

  return (
    <div className="px-6 pt-8 pb-8">
      <h1 className="text-[24px] font-headline font-bold mb-6">설정</h1>

      {/* Focus duration */}
      <section className="bg-surface-container rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[14px] font-medium">집중 시간</label>
          <span className="text-[16px] font-headline font-bold text-primary">{settings.focusDuration}분</span>
        </div>
        <input
          type="range"
          min={15}
          max={50}
          step={5}
          value={settings.focusDuration}
          onChange={(e) => updateFocusDuration(Number(e.target.value))}
          className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-on-surface-variant">15분</span>
          <span className="text-[11px] text-on-surface-variant">50분</span>
        </div>
      </section>

      {/* Break duration */}
      <section className="bg-surface-container rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[14px] font-medium">휴식 시간</label>
          <span className="text-[16px] font-headline font-bold text-secondary">{settings.breakDuration}분</span>
        </div>
        <input
          type="range"
          min={3}
          max={15}
          step={1}
          value={settings.breakDuration}
          onChange={(e) => updateBreakDuration(Number(e.target.value))}
          className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-secondary"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-on-surface-variant">3분</span>
          <span className="text-[11px] text-on-surface-variant">15분</span>
        </div>
      </section>

      {/* Demo mode */}
      <section className="bg-surface-container rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium">데모 모드</p>
            <p className="text-[12px] text-on-surface-variant mt-0.5">샘플 데이터 로드</p>
          </div>
          <button
            onClick={handleDemoToggle}
            className={`w-[52px] h-[32px] rounded-full transition-colors duration-200 relative ${
              demo ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                demo ? 'translate-x-[22px]' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Reset data */}
      <section className="bg-surface-container rounded-2xl p-5 mb-6">
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full min-h-[44px] text-[14px] text-warm-pink font-medium"
        >
          데이터 초기화
        </button>
      </section>

      {/* Version */}
      <p className="text-center text-[12px] text-outline">v0.1.0</p>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-surface-container rounded-2xl p-6 w-[300px] animate-fade-in">
            <h3 className="text-[16px] font-headline font-bold mb-2">데이터 초기화</h3>
            <p className="text-[14px] text-on-surface-variant mb-6">
              모든 세션 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-outline-variant text-[14px] font-medium"
              >
                취소
              </button>
              <button
                onClick={handleResetAll}
                className="flex-1 min-h-[44px] rounded-xl bg-warm-pink text-white text-[14px] font-medium"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
