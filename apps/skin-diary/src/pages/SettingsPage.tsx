import React from 'react';
import type { SkinRecord, UserProfile, Milestone, CustomVariable } from '../types';
import { ALL_VARIABLES, VARIABLE_LABELS, MILESTONE_LABELS, type Variable } from '../types';
import { calculateRecordingRate, calculateStreak } from '../utils/insights';

interface Props {
  profile: UserProfile | null;
  records: Record<string, SkinRecord>;
  isDemoMode: boolean;
  milestones: Milestone[];
  pinnedVariables: string[];
  customVariables: CustomVariable[];
  onToggleDemo: () => void;
  onResetData: () => void;
  onBack: () => void;
  onExportData: () => void;
  onOpenProducts: () => void;
  onTogglePinned: (varKey: string) => void;
  onRemoveCustomVariable: (id: string) => void;
}

export function SettingsPage({
  profile,
  records,
  isDemoMode,
  milestones,
  pinnedVariables,
  customVariables,
  onToggleDemo,
  onResetData,
  onBack,
  onExportData,
  onOpenProducts,
  onTogglePinned,
  onRemoveCustomVariable,
}: Props) {
  const streak = calculateStreak(records);
  const { rate, recorded, total } = calculateRecordingRate(records, 30);
  const totalDays = Object.values(records).filter(r => r.morningLog || r.nightLog).length;
  const activeCustomVars = customVariables.filter(v => !v.archived);

  return (
    <div className="fixed inset-0 z-50 bg-surface flex justify-center">
      <div className="w-full max-w-[430px] bg-surface min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-background z-10">
          <button onClick={onBack} className="active:scale-95 transition-transform text-primary">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline text-lg font-semibold text-primary">설정</h1>
          <div className="w-8" />
        </header>

        <main className="px-6 pb-10 space-y-8">
          {/* Profile */}
          {profile && (
            <section className="bg-surface-container-lowest rounded-xl p-6 space-y-2">
              <h2 className="font-headline text-lg font-medium text-on-surface">{profile.name}</h2>
              <p className="text-xs text-on-surface-variant">
                피부 타입: {profile.skinTypes.join(', ')}
              </p>
            </section>
          )}

          {/* Stats */}
          <section className="space-y-3">
            <h3 className="font-headline text-sm font-medium text-on-surface">기록 통계</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-container-low rounded-xl p-4 text-center">
                <p className="serif-numbers text-2xl text-primary">{totalDays}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">총 기록일</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4 text-center">
                <p className="serif-numbers text-2xl text-primary">{streak}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">연속 기록</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4 text-center">
                <p className="serif-numbers text-2xl text-primary">{rate}%</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">이번 달</p>
              </div>
            </div>
          </section>

          {/* Milestones */}
          {milestones.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-headline text-sm font-medium text-on-surface">달성한 마일스톤</h3>
              <div className="space-y-2">
                {milestones.map(m => (
                  <div
                    key={m.type}
                    className="flex items-center gap-3 bg-surface-container-low rounded-xl p-4"
                  >
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      military_tech
                    </span>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{MILESTONE_LABELS[m.type]}</p>
                      <p className="text-[10px] text-on-surface-variant">
                        {new Date(m.achievedAt).toLocaleDateString('ko')} 달성
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pinned Variables (Presets) */}
          <section className="space-y-3">
            <h3 className="font-headline text-sm font-medium text-on-surface">기본 생활 습관 (프리셋)</h3>
            <p className="text-xs text-on-surface-variant/60">
              선택한 습관은 밤 기록 시 자동으로 체크됩니다
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_VARIABLES.map(v => {
                const isPinned = pinnedVariables.includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => onTogglePinned(v)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      isPinned
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    {VARIABLE_LABELS[v]}
                    {isPinned && (
                      <span className="material-symbols-outlined text-xs ml-1" style={{ fontSize: '12px' }}>push_pin</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Custom Variables */}
          {activeCustomVars.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-headline text-sm font-medium text-on-surface">커스텀 생활 습관</h3>
              <div className="space-y-2">
                {activeCustomVars.map(cv => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between bg-surface-container-low rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-on-surface">{cv.label}</span>
                      {pinnedVariables.includes(cv.id) && (
                        <span className="material-symbols-outlined text-primary text-xs" style={{ fontSize: '14px' }}>push_pin</span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => onTogglePinned(cv.id)}
                        className="text-xs text-on-surface-variant"
                      >
                        {pinnedVariables.includes(cv.id) ? '고정 해제' : '고정'}
                      </button>
                      <button
                        onClick={() => onRemoveCustomVariable(cv.id)}
                        className="text-xs text-error"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Actions */}
          <section className="space-y-2">
            <button
              onClick={onOpenProducts}
              className="w-full flex items-center justify-between bg-surface-container-low rounded-xl p-4"
            >
              <span className="text-sm text-on-surface">제품 관리</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
            </button>

            <button
              onClick={onExportData}
              className="w-full flex items-center justify-between bg-surface-container-low rounded-xl p-4"
            >
              <span className="text-sm text-on-surface">데이터 내보내기</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">download</span>
            </button>

            <button
              onClick={onToggleDemo}
              className="w-full flex items-center justify-between bg-surface-container-low rounded-xl p-4"
            >
              <span className="text-sm text-on-surface">
                데모 모드 {isDemoMode ? 'OFF' : 'ON'}
              </span>
              <div className={`w-10 h-6 rounded-full transition-colors ${isDemoMode ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm mt-0.5 transition-transform ${isDemoMode ? 'translate-x-4.5 ml-[18px]' : 'ml-0.5'}`} />
              </div>
            </button>

            <button
              onClick={() => {
                if (confirm('모든 데이터가 삭제됩니다. 정말 초기화할까요?')) {
                  onResetData();
                }
              }}
              className="w-full flex items-center justify-between bg-surface-container-low rounded-xl p-4"
            >
              <span className="text-sm text-error">데이터 초기화</span>
              <span className="material-symbols-outlined text-error text-sm">delete_forever</span>
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
