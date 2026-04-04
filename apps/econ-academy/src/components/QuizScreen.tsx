import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { AppState, Term, Quiz, Screen } from '../types';
import { markQuizPassed, saveState, updateStreak } from '../store';

interface QuizScreenProps {
  state: AppState;
  termId: string;
  terms: Term[];
  quizzes: Quiz[];
  onStateChange: (s: AppState) => void;
  navigate: (s: Screen) => void;
  goBack?: () => void;
}

interface QuestionResult {
  selectedIndex: number;
  correctIndex: number;
  correct: boolean;
}

export function QuizScreen({ state, termId, terms, quizzes, onStateChange, navigate }: QuizScreenProps) {
  const term = terms.find((t) => t.id === termId);
  const quiz = quizzes.find((q) => q.termId === termId);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showResult, setShowResult] = useState(false);

  if (!term || !quiz) return null;

  const questions = quiz.questions;
  const totalQ = questions.length;
  const question = questions[currentQ];
  const answered = selected !== null;
  const isCorrect = selected === question?.correctIndex;

  const progressPct = ((currentQ + (answered ? 1 : 0)) / totalQ) * 100;

  function handleSelect(index: number) {
    if (answered) return;
    setSelected(index);
    setResults((prev) => [
      ...prev,
      { selectedIndex: index, correctIndex: question.correctIndex, correct: index === question.correctIndex },
    ]);
  }

  function handleNext() {
    if (currentQ + 1 < totalQ) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  }

  function handleFinish() {
    const correctCount = results.filter((r) => r.correct).length;
    const passed = correctCount >= 2;
    let next = { ...state, quizAttempts: state.quizAttempts + 1 };
    if (passed) {
      next = markQuizPassed(next, termId);
      next = updateStreak(next);
    }
    saveState(next);
    onStateChange(next);
    navigate({ type: 'termCard', termId });
  }

  // Result screen
  if (showResult) {
    const correctCount = results.filter((r) => r.correct).length;
    const passed = correctCount >= 2;

    return (
      <div className="pb-24 px-4 max-w-screen-md mx-auto">
        <div className="pt-6 pb-4">
          <button
            onClick={() => navigate({ type: 'termCard', termId })}
            className="flex items-center gap-1 text-sm text-primary font-medium mb-3"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            카드
          </button>
        </div>

        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-bold text-ink mb-2">퀴즈 결과</h1>
          <p className="font-display text-4xl font-bold mt-4" style={{ color: passed ? '#16A34A' : '#DC2626' }}>
            {correctCount}/{totalQ}
          </p>
          <p className="text-base text-ink-secondary mt-2">
            {passed ? '통과! 잘 이해하고 있습니다.' : '아쉽게 통과하지 못했습니다. 다시 도전해보세요.'}
          </p>
        </div>

        <div className="bg-surface-card border border-border rounded-lg divide-y divide-border mb-6">
          {questions.map((q, i) => {
            const r = results[i];
            return (
              <div key={i} className="p-4">
                <div className="flex items-start gap-2">
                  {r.correct ? (
                    <CheckCircle2 size={18} strokeWidth={1.5} className="text-success mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={18} strokeWidth={1.5} className="text-error mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-base text-ink">{q.question.split('\n')[0]}</p>
                    {!r.correct && (
                      <p className="text-sm text-ink-secondary mt-1">정답: {q.options[q.correctIndex]}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleFinish}
          className="w-full bg-primary text-white font-medium px-5 py-3 rounded-lg hover:bg-primary-dark"
        >
          {passed ? '완료' : '카드로 돌아가기'}
        </button>
      </div>
    );
  }

  // Quiz question screen
  return (
    <div className="pb-24 px-4 max-w-screen-md mx-auto">
      {/* Header */}
      <div className="pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate({ type: 'termCard', termId })}
            className="flex items-center gap-1 text-sm text-primary font-medium"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            카드
          </button>
          <span className="text-sm text-ink-secondary font-display">
            {currentQ + 1}/{totalQ}
          </span>
        </div>
        <div className="w-full h-1.5 bg-stone-100 rounded-full">
          <div
            className="h-1.5 bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-1">{term.korean}</h2>
        <p className="text-base text-ink leading-relaxed whitespace-pre-line">{question.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((opt, i) => {
          const labels = ['A', 'B', 'C', 'D'];
          let optClass = 'bg-surface-card border border-border';
          if (answered) {
            if (i === question.correctIndex) {
              optClass = 'bg-green-50 border-2 border-success';
            } else if (i === selected) {
              optClass = 'bg-red-50 border-2 border-error';
            }
          } else if (i === selected) {
            optClass = 'bg-primary-light border-2 border-primary';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full text-left rounded-lg p-4 flex items-start gap-3 ${optClass}`}
            >
              <span className="font-display font-semibold text-ink-secondary shrink-0">
                {labels[i]}.
              </span>
              <span className="text-base text-ink leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className="mb-6">
          <div className={`rounded-lg p-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle2 size={18} strokeWidth={1.5} className="text-success" />
              ) : (
                <XCircle size={18} strokeWidth={1.5} className="text-error" />
              )}
              <span className="font-medium text-base" style={{ color: isCorrect ? '#16A34A' : '#DC2626' }}>
                {isCorrect ? '정답!' : '오답'}
              </span>
            </div>
            <p className="text-base text-ink leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-primary text-white font-medium px-5 py-3 rounded-lg hover:bg-primary-dark"
        >
          {currentQ + 1 < totalQ ? '다음 문제' : '결과 보기'}
        </button>
      )}
    </div>
  );
}
