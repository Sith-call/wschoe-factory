import React from 'react';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] px-6 pt-16 pb-8 bg-surface">
      {/* Top section - left aligned, strong hierarchy */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-sm">
        {/* Small label */}
        <span className="text-[13px] font-semibold tracking-wider text-primary uppercase mb-3">
          SPENDING REFORM
        </span>

        <h1 className="text-[32px] font-bold text-txt-primary leading-[1.25] mb-4">
          소비 체질을<br />
          진단하고 바꿔보세요
        </h1>

        <p className="text-[16px] text-txt-secondary leading-relaxed mb-10">
          12개 질문으로 나의 소비 유형을 알아보고,<br />
          7일 맞춤 챌린지로 실제 변화를 만들어요.
        </p>

        {/* Feature points - left aligned, no box */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <span className="text-[15px] text-txt-primary">6가지 소비 유형 정밀 진단</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="text-[15px] text-txt-primary">낭비 금액 카테고리별 분석</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <span className="text-[15px] text-txt-primary">7일 맞춤 절약 챌린지</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA area */}
      <div className="w-full max-w-sm">
        <button
          onClick={onStart}
          className="w-full bg-txt-primary text-white rounded-xl py-4 font-semibold text-[16px] active:scale-[0.98] transition-transform duration-100"
        >
          진단 시작하기
        </button>
        <p className="text-[13px] text-txt-tertiary text-center mt-3">
          약 2분 소요
        </p>
      </div>
    </div>
  );
}
