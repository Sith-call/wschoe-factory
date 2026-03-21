import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';

interface QuizScreenProps {
  questions: Question[];
  currentIndex: number;
  selectedOption: number | null;
  onSelect: (optionIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  currentIndex,
  selectedOption,
  onSelect,
  onNext,
  onBack,
}) => {
  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const [slideDir, setSlideDir] = useState<'right' | 'left' | null>(null);
  const [visible, setVisible] = useState(true);
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      const dir = currentIndex > prevIndex.current ? 'right' : 'left';
      setSlideDir(dir);
      setVisible(false);

      const timer = setTimeout(() => {
        setVisible(true);
        prevIndex.current = currentIndex;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const slideStyle: React.CSSProperties = visible
    ? {
        transform: 'translateX(0)',
        opacity: 1,
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
      }
    : {
        transform: slideDir === 'right' ? 'translateX(60px)' : 'translateX(-60px)',
        opacity: 0,
        transition: 'none',
      };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fc' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: '#e5e7eb' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: '#4f46e5',
              transition: 'width 300ms ease-out',
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm py-2 pr-4"
            style={{ color: '#6b7084', minHeight: '44px', minWidth: '44px' }}
          >
            ← 이전
          </button>
          <span className="text-sm font-normal" style={{ color: '#9ca0b0', fontFamily: 'Space Grotesk, sans-serif' }}>
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 px-5 pb-6 flex flex-col" style={slideStyle}>
        <div className="mt-6 mb-8">
          {/* Category tag */}
          <span
            className="inline-block text-xs font-normal px-2.5 py-1 rounded-md mb-4"
            style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}
          >
            {question.category}
          </span>

          {/* Emoji */}
          <div className="text-5xl mb-4">{question.emoji}</div>

          {/* Question text */}
          <h2 className="text-xl font-semibold" style={{ color: '#1a1d29', lineHeight: '1.5' }}>
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className="w-full text-left py-3.5 px-4 rounded-lg border text-base transition-colors"
                style={{
                  minHeight: '48px',
                  backgroundColor: isSelected ? '#4f46e5' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#1a1d29',
                  borderColor: isSelected ? '#4f46e5' : '#e5e7eb',
                  boxShadow: isSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        {/* Reaction */}
        {selectedOption !== null && (
          <div className="text-center mb-4">
            <p className="text-sm" style={{ color: '#6b7084' }}>
              {question.options[selectedOption].reaction}
            </p>
          </div>
        )}

        {/* Next button */}
        {selectedOption !== null && (
          <button
            onClick={onNext}
            className="w-full py-3.5 rounded-lg text-white font-semibold text-base"
            style={{ backgroundColor: '#4f46e5', minHeight: '48px' }}
          >
            {currentIndex === questions.length - 1 ? '결과 보기' : '다음'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
