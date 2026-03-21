import React from 'react';

interface IntroScreenProps {
  onStart: () => void;
  onViewResult: () => void;
  hasResult: boolean;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, onViewResult, hasResult }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#f8f9fc' }}>
      <div className="text-center max-w-sm w-full">
        <div className="text-7xl mb-8">💰</div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: '#4f46e5', fontFamily: 'Pretendard Variable, sans-serif' }}
        >
          몸값 계산기
        </h1>

        <p className="text-base mb-12" style={{ color: '#6b7084' }}>
          10가지 질문으로 알아보는 나의 시장 가치
        </p>

        <button
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-lg text-white font-semibold text-base transition-colors"
          style={{ backgroundColor: '#4f46e5', minHeight: '48px' }}
        >
          시작하기
        </button>

        {hasResult && (
          <button
            onClick={onViewResult}
            className="mt-4 text-sm font-normal transition-colors"
            style={{ color: '#6b7084', minHeight: '44px' }}
          >
            이전 결과 보기
          </button>
        )}
      </div>
    </div>
  );
};

export default IntroScreen;
