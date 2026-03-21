import { useState, useEffect, useCallback, useRef } from 'react';
import { QuizState } from '../types';

interface QuizScreenProps {
  quizState: QuizState;
  onAnswer: (correct: boolean, selectedChoice: string | null) => void;
  onNext: () => void;
  onFinish: () => void;
  onBack: () => void;
}

const TIMER_SECONDS = 15;

function QuizScreen({ quizState, onAnswer, onNext, onFinish, onBack }: QuizScreenProps) {
  const { currentIndex, questions, score, streak } = quizState;
  const question = questions[currentIndex];
  const isLastQuestion = currentIndex + 1 >= questions.length;

  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAnswered = selected !== null || feedback === 'wrong';

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleTimeout = useCallback(() => {
    clearTimer();
    setFeedback('wrong');
    onAnswer(false, null);
  }, [clearTimer, onAnswer]);

  // Reset state when question changes
  useEffect(() => {
    setSelected(null);
    setFeedback(null);
    setTimeLeft(TIMER_SECONDS);

    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [currentIndex, clearTimer]);

  // Handle timeout when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !hasAnswered) {
      handleTimeout();
    }
  }, [timeLeft, hasAnswered, handleTimeout]);

  const handleSelect = (choice: string) => {
    if (hasAnswered) return;
    clearTimer();
    setSelected(choice);
    const isCorrect = choice === question.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    onAnswer(isCorrect, choice);
  };

  const handleNextClick = () => {
    if (isLastQuestion) {
      onFinish();
    } else {
      onNext();
    }
  };

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor =
    timeLeft > 10 ? 'bg-rose-400' : timeLeft > 5 ? 'bg-amber-400' : 'bg-red-500';

  return (
    <div className="flex-1 flex flex-col px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-rose-400 hover:text-rose-600 transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-rose-600">
          {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-1 text-sm font-medium text-rose-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          {score}점
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-rose-100 rounded-full mb-2 overflow-hidden">
        <div
          className="h-full bg-rose-300 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-rose-100 rounded-full mb-8 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 linear ${timerColor}`}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Timer number */}
      <div className="text-center mb-2">
        <span
          className={`text-sm font-semibold ${
            timeLeft <= 5 ? 'text-red-500' : 'text-rose-400'
          }`}
        >
          {timeLeft}초
        </span>
      </div>

      {/* Streak badge */}
      {streak >= 2 && !hasAnswered && (
        <div className="text-center mb-2">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
            {streak}연속 정답!
          </span>
        </div>
      )}

      {/* Emoji display - this is CONTENT, not UI decoration */}
      <div className="bg-white rounded-2xl p-8 mb-8 flex items-center justify-center shadow-sm min-h-[140px]">
        <span className="text-6xl leading-tight select-none" role="img" aria-label="quiz emoji">
          {question.emoji}
        </span>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 gap-3 flex-1">
        {question.choices.map((choice) => {
          let borderClass = 'border-2 border-transparent';
          let bgClass = 'bg-white';

          if (hasAnswered) {
            if (choice === question.answer) {
              borderClass = 'border-2 border-emerald-500';
              bgClass = 'bg-emerald-50';
            } else if (choice === selected && choice !== question.answer) {
              borderClass = 'border-2 border-red-400';
              bgClass = 'bg-red-50';
            }
          } else {
            borderClass = 'border-2 border-rose-100 hover:border-rose-300';
          }

          return (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              disabled={hasAnswered}
              className={`${bgClass} ${borderClass} rounded-xl px-5 py-3.5 text-left font-medium text-rose-900 transition-all ${
                !hasAnswered ? 'active:scale-[0.98]' : ''
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {hasAnswered && (
        <button
          onClick={handleNextClick}
          className="mt-6 w-full bg-rose-600 text-white font-semibold py-3.5 rounded-lg active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
        >
          {isLastQuestion ? '결과 보기' : '다음 문제'}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default QuizScreen;
