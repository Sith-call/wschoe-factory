import React, { useState } from 'react';

interface Props {
  initialGoal: number;
  onNext: (goal: number) => void;
  onBack: () => void;
}

export const GoalScreen: React.FC<Props> = ({ initialGoal, onNext, onBack }) => {
  const [goal, setGoal] = useState(initialGoal);

  const adjust = (delta: number) => {
    const newVal = Math.round((goal + delta) * 10) / 10;
    if (newVal >= 5 && newVal <= 10) {
      setGoal(newVal);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 pt-16">
      <button onClick={onBack} className="text-text-secondary mb-8 self-start text-sm" style={{ minHeight: '44px' }}>
        ← 이전
      </button>

      <h1 className="text-xl font-bold text-text-primary mb-2">하루 목표 수면 시간</h1>
      <p className="text-sm text-text-tertiary mb-12">건강한 수면을 위한 목표를 설정하세요</p>

      <div className="flex items-center justify-center gap-6 mb-16">
        <button
          onClick={() => adjust(-0.5)}
          className="w-12 h-12 rounded-lg border border-border flex items-center justify-center text-xl text-text-secondary"
        >
          -
        </button>

        <div className="text-center">
          <span className="font-dm text-5xl font-bold text-text-primary" style={{ fontSize: '48px' }}>
            {goal}
          </span>
          <span className="text-lg text-text-secondary ml-1">시간</span>
        </div>

        <button
          onClick={() => adjust(0.5)}
          className="w-12 h-12 rounded-lg border border-border flex items-center justify-center text-xl text-text-secondary"
        >
          +
        </button>
      </div>

      <button
        onClick={() => onNext(goal)}
        className="w-full bg-primary text-white py-3.5 rounded-lg font-bold text-base"
        style={{ minHeight: '48px' }}
      >
        다음
      </button>
    </div>
  );
};
