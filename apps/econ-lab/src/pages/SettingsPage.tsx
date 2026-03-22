import React from 'react';

export const SettingsPage: React.FC = () => {
  const handleReset = () => {
    if (window.confirm('모든 학습 진도를 초기화하시겠습니까?')) {
      localStorage.removeItem('econ-lab-progress');
      window.location.reload();
    }
  };

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-10">
      <header className="space-y-2">
        <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary tracking-[0.2em] uppercase">
          Settings
        </span>
        <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight">
          설정
        </h2>
      </header>

      <section className="space-y-4">
        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/5 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <h3 className="font-headline font-bold text-lg text-primary mb-4">데이터 관리</h3>
          <button
            onClick={handleReset}
            className="bg-error text-on-error px-6 py-3 rounded-lg font-body font-bold text-sm active:scale-95 transition-all"
          >
            학습 진도 초기화
          </button>
          <p className="mt-3 text-[11px] text-on-surface-variant leading-relaxed">
            모든 학습 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/5 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <h3 className="font-headline font-bold text-lg text-primary mb-2">경제 실험실</h3>
          <p className="text-sm text-on-surface-variant font-medium">
            버전 1.0.0
          </p>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
            경제 개념을 인터랙티브 시뮬레이션으로 학습하는 앱입니다.
            변수를 직접 조작하고 결과를 실시간으로 관찰하세요.
          </p>
        </div>
      </section>
    </main>
  );
};
