import React from 'react';
import type { WeeklyReport } from '../types';
import { WeeklySummary } from '../components/WeeklySummary';
import { ShareCard } from '../components/ShareCard';

interface Props {
  reports: WeeklyReport[];
  onBack: () => void;
}

export function WeeklyReportPage({ reports, onBack }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-surface flex justify-center">
      <div className="w-full max-w-[430px] bg-surface min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-background z-10">
          <button onClick={onBack} className="active:scale-95 transition-transform text-primary">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline text-lg font-semibold text-primary">주간 리포트</h1>
          <div className="w-8" />
        </header>

        <main className="px-6 pb-10 space-y-6">
          {reports.length > 0 ? (
            reports.map((report, i) => (
              <ShareCard key={i} filename={`skin-diary-weekly-${report.weekStart}.png`}>
                <WeeklySummary report={report} />
              </ShareCard>
            ))
          ) : (
            <div className="bg-surface-container-low rounded-xl p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-primary-container text-4xl">summarize</span>
              <h3 className="font-headline text-lg text-on-surface">아직 리포트가 없어요</h3>
              <p className="text-sm text-on-surface-variant">
                한 주 동안 3일 이상 기록하면 자동으로 생성돼요.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
