import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const steps = [
  { label: '소비 패턴 분석', description: '당신의 지갑을 들여다보는 중' },
  { label: '유형 매칭', description: '6가지 유형 중 가장 가까운 것을 찾는 중' },
  { label: '처방전 작성', description: '맞춤 절약 전략을 세우는 중' },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveStep(i), i * 700 + 300)
    );
    const complete = setTimeout(onComplete, steps.length * 700 + 400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(complete);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-surface px-8">
      <div className="w-full max-w-[280px]">
        {/* Title */}
        <p className="text-[18px] font-semibold text-txt-primary mb-8">
          결과를 준비하고 있어요
        </p>

        {/* Step list */}
        <div className="space-y-5">
          {steps.map((step, i) => {
            const isDone = activeStep > i;
            const isActive = activeStep === i;

            return (
              <div key={i} className="flex items-start gap-3">
                {/* Step indicator */}
                <div className="relative mt-0.5 flex-shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                      ${isDone ? 'bg-primary border-primary' : isActive ? 'border-primary' : 'border-[#cbd5e1]'}
                    `}
                  >
                    {isDone && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  {/* Connecting line */}
                  {i < steps.length - 1 && (
                    <div className={`absolute left-[9px] top-5 w-[2px] h-5 transition-colors duration-300 ${isDone ? 'bg-primary' : 'bg-[#e2e8f0]'}`} />
                  )}
                </div>

                {/* Text */}
                <div>
                  <p className={`text-[15px] font-medium transition-colors duration-300 ${isActive || isDone ? 'text-txt-primary' : 'text-txt-tertiary'}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-[13px] text-txt-secondary mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
