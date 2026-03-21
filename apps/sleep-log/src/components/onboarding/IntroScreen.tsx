import React from 'react';
import { MoonIcon } from '../../icons';

interface Props {
  onNext: () => void;
}

export const IntroScreen: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      <div className="text-primary mb-10">
        <MoonIcon size={80} strokeWidth={1.2} />
      </div>

      <h1 className="text-3xl font-bold text-text-primary mb-4">수면 일지</h1>

      <p className="text-base font-light text-text-secondary text-center leading-relaxed mb-16">
        기록하면 보인다. 보이면 바뀐다.
      </p>

      <button
        onClick={onNext}
        className="w-full max-w-xs bg-primary text-white py-3.5 rounded-lg font-bold text-base"
        style={{ minHeight: '48px' }}
      >
        시작하기
      </button>
    </div>
  );
};
