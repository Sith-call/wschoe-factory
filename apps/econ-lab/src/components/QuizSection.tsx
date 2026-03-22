import React, { useState, useCallback } from 'react';
import { QuizQuestion } from '../data/concepts';

interface QuizSectionProps {
  questions: QuizQuestion[];
  conceptTitle: string;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ questions, conceptTitle }) => {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const handleSelect = useCallback((questionId: string, optionIndex: number) => {
    if (revealed[questionId]) return; // already answered
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setRevealed(prev => ({ ...prev, [questionId]: true }));
  }, [revealed]);

  const correctCount = questions.filter(q => answers[q.id] === q.correctIndex).length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
          <span className="w-1.5 h-6 bg-secondary"></span>
          개념 확인 퀴즈
        </h2>
        {allAnswered && (
          <span className={`font-label text-xs font-bold px-3 py-1 rounded-full ${
            correctCount === questions.length
              ? 'bg-[#1a6b50]/10 text-[#1a6b50]'
              : 'bg-secondary-container/30 text-secondary'
          }`}>
            {correctCount}/{questions.length} 정답
          </span>
        )}
      </div>

      {questions.map((q, qi) => {
        const isRevealed = revealed[q.id];
        const selectedAnswer = answers[q.id];
        const isCorrect = selectedAnswer === q.correctIndex;

        return (
          <div key={q.id} className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 overflow-hidden">
            {/* Question */}
            <div className="p-5 pb-3">
              <div className="flex items-start gap-3">
                <span className="font-['Space_Grotesk'] text-sm font-bold text-secondary mt-0.5">
                  Q{qi + 1}
                </span>
                <p className="font-body font-medium text-primary text-[15px] leading-relaxed">{q.question}</p>
              </div>
            </div>

            {/* Options */}
            <div className="px-5 pb-4 space-y-2">
              {q.options.map((option, oi) => {
                let optionStyle = 'border-outline-variant/10 bg-surface-container-lowest hover:bg-surface-container/50';
                if (isRevealed) {
                  if (oi === q.correctIndex) {
                    optionStyle = 'border-[#1a6b50] bg-[#1a6b50]/5';
                  } else if (oi === selectedAnswer && !isCorrect) {
                    optionStyle = 'border-[#ba1a1a] bg-[#ba1a1a]/5';
                  } else {
                    optionStyle = 'border-outline-variant/5 bg-surface-container-lowest opacity-50';
                  }
                }

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(q.id, oi)}
                    disabled={isRevealed}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center gap-3 ${optionStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isRevealed && oi === q.correctIndex
                        ? 'bg-[#1a6b50] text-white'
                        : isRevealed && oi === selectedAnswer && !isCorrect
                          ? 'bg-[#ba1a1a] text-white'
                          : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {isRevealed && oi === q.correctIndex ? (
                        <span className="material-symbols-outlined text-sm">check</span>
                      ) : isRevealed && oi === selectedAnswer && !isCorrect ? (
                        <span className="material-symbols-outlined text-sm">close</span>
                      ) : (
                        String.fromCharCode(65 + oi)
                      )}
                    </span>
                    <span className={`font-body text-sm ${
                      isRevealed && oi === q.correctIndex ? 'text-[#1a6b50] font-bold' : 'text-on-surface'
                    }`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {isRevealed && (
              <div className={`mx-5 mb-5 p-4 rounded-lg ${
                isCorrect ? 'bg-[#1a6b50]/5 border border-[#1a6b50]/20' : 'bg-[#ba1a1a]/5 border border-[#ba1a1a]/20'
              }`}>
                <div className="flex items-start gap-2">
                  <span className={`material-symbols-outlined text-sm mt-0.5 ${isCorrect ? 'text-[#1a6b50]' : 'text-[#ba1a1a]'}`}>
                    {isCorrect ? 'check_circle' : 'info'}
                  </span>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};
