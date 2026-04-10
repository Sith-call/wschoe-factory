import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { markOnboardingSeen } from '../utils/storage';
import { generateDemoData } from '../utils/demo-data';

const SLIDES = [
  {
    title: '매일 감사한 일 3가지',
    subtitle: '30초면 충분해요',
    description: '하루를 마무리하며 작은 감사를 기록해보세요.',
  },
  {
    title: '일주일 뒤,',
    subtitle: '내가 뭘 소중히 여기는지 알게 돼요',
    description: '주간 회고로 나만의 감사 패턴을 발견하세요.',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  function handleSkip() {
    markOnboardingSeen();
    navigate('/', { replace: true });
  }

  function handleStart() {
    markOnboardingSeen();
    navigate('/entry', { replace: true });
  }

  function handleDemo() {
    markOnboardingSeen();
    generateDemoData();
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col px-6 pt-4 pb-10">
      <div className="flex justify-end">
        <button
          onClick={handleSkip}
          className="text-sm text-on-surface-variant font-medium py-2 px-3 min-h-[44px]"
        >
          건너뛰기
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <p className="text-sage text-sm font-semibold tracking-wide mb-4">하루 감사 일기</p>
        <h1 className="text-2xl font-bold text-on-surface leading-snug mb-2">
          {SLIDES[page].title}
        </h1>
        <p className="text-xl font-semibold text-sage leading-snug mb-4">
          {SLIDES[page].subtitle}
        </p>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {SLIDES[page].description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="flex gap-2" role="tablist" aria-label="온보딩 페이지">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === page ? 'bg-sage' : 'bg-surface-high'
              }`}
              role="tab"
              aria-selected={i === page}
              aria-label={`페이지 ${i + 1}`}
            />
          ))}
        </div>

        {page === SLIDES.length - 1 ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDemo}
              className="text-sm font-medium text-sage py-3 px-4 min-h-[44px]"
            >
              체험하기
            </button>
            <button
              onClick={handleStart}
              className="bg-sage text-sage-light font-semibold px-6 py-3 rounded-xl text-sm min-h-[44px]"
            >
              시작하기
            </button>
          </div>
        ) : (
          <button
            onClick={() => setPage(page + 1)}
            className="bg-sage text-sage-light font-semibold px-6 py-3 rounded-xl text-sm min-h-[44px]"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}
