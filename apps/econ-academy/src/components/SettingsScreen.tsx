import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AppState, Screen } from '../types';
import { resetState, saveState } from '../store';

interface SettingsScreenProps {
  state: AppState;
  onStateChange: (s: AppState) => void;
  navigate: (s: Screen) => void;
}

export function SettingsScreen({ state, onStateChange, navigate }: SettingsScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const masteredCount = Object.values(state.progress).filter((p) => p.masteryLevel === 3).length;
  const readCount = Object.values(state.progress).filter((p) => p.readAt).length;

  function handleReset() {
    const next = resetState();
    onStateChange(next);
    setShowConfirm(false);
    setToast('학습 데이터가 초기화되었습니다');
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <div className="pb-24 px-4 max-w-screen-md mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2 rounded-lg z-50 shadow-md">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">설정</h1>
      </div>

      {/* Study Data Section */}
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-ink mb-2">학습 데이터</h2>
        <div className="bg-surface-card border border-border rounded-lg p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base text-ink">마스터 용어</span>
              <span className="font-display font-semibold text-ink">{masteredCount}개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-ink">읽기 완료</span>
              <span className="font-display font-semibold text-ink">{readCount}개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-ink">퀴즈 시도</span>
              <span className="font-display font-semibold text-ink">{state.quizAttempts}회</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-ink">연속 학습</span>
              <span className="font-display font-semibold text-ink">{state.streak}일</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full border border-error text-error font-medium px-5 py-2.5 rounded-lg hover:bg-red-50"
        >
          학습 데이터 초기화
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
          <div className="bg-surface-card rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={20} strokeWidth={1.5} className="text-error" />
              <h3 className="font-display text-lg font-semibold text-ink">데이터 초기화</h3>
            </div>
            <p className="text-base text-ink mb-1">
              모든 학습 데이터가 삭제됩니다.
            </p>
            <p className="text-base text-error mb-5">
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-border text-ink-secondary font-medium px-4 py-2.5 rounded-lg hover:bg-surface"
              >
                취소
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-error text-white font-medium px-4 py-2.5 rounded-lg hover:bg-red-700"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Info */}
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-ink mb-2">앱 정보</h2>
        <div className="bg-surface-card border border-border rounded-lg p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base text-ink">버전</span>
              <span className="text-sm text-ink-secondary">3.0.0</span>
            </div>
            <div>
              <span className="text-base text-ink">설명</span>
              <p className="text-sm text-ink-secondary mt-1">
                100개 경제 핵심 용어를 의존성 그래프 기반으로 체계적으로 학습하는 교육 앱
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
