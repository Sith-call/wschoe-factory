import React from 'react';
import type { SkinRecord, UserProfile } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';

interface SettingsPageProps {
  profile: UserProfile | null;
  records: Record<string, SkinRecord>;
  isDemoMode: boolean;
  onToggleDemo: () => void;
  onResetData: () => void;
  onBack: () => void;
  onExportData: () => void;
}

export function SettingsPage({
  profile,
  records,
  isDemoMode,
  onToggleDemo,
  onResetData,
  onBack,
  onExportData,
}: SettingsPageProps) {
  const totalDays = Object.values(records).filter(r => r.morningLog || r.nightLog).length;

  // Calculate longest streak
  const dates = Object.keys(records).sort();
  let maxStreak = 0;
  let currentStreak = 0;
  for (let i = 0; i < dates.length; i++) {
    const r = records[dates[i]];
    if (r.morningLog || r.nightLog) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  const productCount = new Set(
    Object.values(records).flatMap(r => r.nightLog?.products || [])
  ).size;

  const handleReset = () => {
    if (confirm('정말 초기화할까요?')) {
      if (confirm('모든 기록이 삭제됩니다. 되돌릴 수 없어요.')) {
        onResetData();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-sd-bg overflow-y-auto">
      <div className="max-w-[430px] mx-auto min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sd-border">
          <button onClick={onBack} aria-label="뒤로" className="text-sd-text min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ChevronLeftIcon size={22} />
          </button>
          <span className="font-heading text-lg text-sd-text">설정</span>
          <div className="w-[22px]" />
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* Profile */}
          <div>
            <h2 className="font-body text-[0.8125rem] text-sd-text-secondary mb-2">내 정보</h2>
            <div className="bg-white border border-sd-border rounded-lg divide-y divide-sd-border">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-body text-sm text-sd-text">이름</span>
                <span className="font-body text-sm text-sd-text-secondary">{profile?.name || '-'}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-body text-sm text-sd-text">피부 타입</span>
                <span className="font-body text-sm text-sd-text-secondary">
                  {profile?.skinTypes?.join(', ') || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Demo mode */}
          <div>
            <h2 className="font-body text-[0.8125rem] text-sd-text-secondary mb-2">데모</h2>
            <div className="bg-white border border-sd-border rounded-lg">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-body text-sm text-sd-text">데모 모드</span>
                <button
                  onClick={onToggleDemo}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-100 ${
                    isDemoMode ? 'bg-sd-primary' : 'bg-sd-border'
                  }`}
                  aria-label="데모 모드 토글"
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-100 ${
                      isDemoMode ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data */}
          <div>
            <h2 className="font-body text-[0.8125rem] text-sd-text-secondary mb-2">데이터</h2>
            <div className="bg-white border border-sd-border rounded-lg divide-y divide-sd-border">
              <button
                onClick={onExportData}
                className="flex items-center justify-between px-4 py-3 w-full"
              >
                <span className="font-body text-sm text-sd-text">데이터 내보내기 (JSON)</span>
                <ChevronRightIcon size={18} color="#b5aaaa" />
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-between px-4 py-3 w-full"
              >
                <span className="font-body text-sm text-sd-danger">데이터 초기화</span>
                <ChevronRightIcon size={18} color="#b5aaaa" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h2 className="font-body text-[0.8125rem] text-sd-text-secondary mb-2">기록 통계</h2>
            <div className="bg-white border border-sd-border rounded-lg divide-y divide-sd-border">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-body text-sm text-sd-text">총 기록 일수</span>
                <span className="font-number text-sm text-sd-text">{totalDays}일</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-body text-sm text-sd-text">최장 스트릭</span>
                <span className="font-number text-sm text-sd-text">{maxStreak}일</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-body text-sm text-sd-text">사용 제품 수</span>
                <span className="font-number text-sm text-sd-text">{productCount}개</span>
              </div>
            </div>
          </div>

          {/* App info */}
          <div>
            <h2 className="font-body text-[0.8125rem] text-sd-text-secondary mb-2">앱 정보</h2>
            <div className="bg-white border border-sd-border rounded-lg">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-body text-sm text-sd-text">버전</span>
                <span className="font-body text-sm text-sd-text-secondary">1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
