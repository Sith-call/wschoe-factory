import React, { useState, useCallback } from 'react';
import { questions } from '../data/questions';
import { getCategoryIcon } from '../icons';

interface QuizScreenProps {
  onComplete: (answers: number[]) => void;
}

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [transitioning, setTransitioning] = useState(false);

  const question = questions[currentIndex];
  const progress = ((currentIndex + (selected !== null ? 1 : 0)) / questions.length) * 100;

  const handleSelect = useCallback((score: number) => {
    if (transitioning) return;

    setSelected(score);
    setTransitioning(true);

    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentIndex] = score;
      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setDirection('left');
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
      } else {
        onComplete(newAnswers);
      }
      setTransitioning(false);
    }, 300);
  }, [currentIndex, answers, transitioning, onComplete]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0 && !transitioning) {
      setDirection('right');
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setSelected(answers[currentIndex - 1] ?? null);
        setTransitioning(false);
      }, 150);
    }
  }, [currentIndex, answers, transitioning]);

  const encourageMessage = currentIndex === 3
    ? '좋아요, 잘하고 있어요!'
    : currentIndex === 5
    ? '벌써 반이나 왔어요!'
    : currentIndex === 8
    ? '얼마 안 남았어요!'
    : currentIndex === 10
    ? '거의 다 됐어요! 2문항만 더!'
    : null;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface px-6 pt-4 pb-8">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[14px] font-medium font-num text-txt-secondary whitespace-nowrap">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Back button */}
      {currentIndex > 0 && (
        <button
          onClick={handleBack}
          className="self-start mb-4 text-txt-secondary text-[14px] font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 -mt-0.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          이전
        </button>
      )}

      {/* Question card */}
      <div
        className="flex-1 flex flex-col"
        style={{
          animation: transitioning
            ? direction === 'left'
              ? 'none'
              : 'none'
            : undefined,
        }}
      >
        {/* Category label */}
        <div className="flex items-center gap-2 mb-4">
          {getCategoryIcon(question.category, 20, '#0d9488')}
          <span className="text-[13px] font-medium text-primary">
            {question.categoryLabel}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-[20px] font-semibold text-txt-primary leading-[1.5] mb-8 whitespace-pre-line">
          {question.text}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {question.options.map((option, idx) => {
            const isSelected = selected === option.score && answers[currentIndex] === undefined
              ? true
              : answers[currentIndex] === option.score && selected === null
              ? true
              : selected === option.score;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option.score)}
                disabled={transitioning}
                className={`
                  w-full text-left rounded-lg py-3.5 px-4 border transition-all duration-150
                  ${isSelected
                    ? 'border-primary bg-primary-light scale-[0.98]'
                    : 'border-border bg-white hover:border-txt-tertiary active:scale-[0.97] active:bg-primary-light/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${isSelected ? 'border-primary bg-primary' : 'border-border'}
                    `}
                  >
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[15px] text-txt-primary">
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Encourage message */}
        {encourageMessage && (
          <div className="mt-6 animate-scale-in">
            <div className="bg-primary-light rounded-lg py-2.5 px-4 text-center">
              <p className="text-[14px] font-semibold text-primary">
                {encourageMessage}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
