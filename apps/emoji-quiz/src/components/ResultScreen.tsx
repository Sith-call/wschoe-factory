import { QuizState } from '../types';
import { categoryInfos } from '../quiz-data';

interface ResultScreenProps {
  quizState: QuizState;
  onRestart: () => void;
  onRetryCategory: () => void;
}

function getGrade(score: number, total: number): { label: string; message: string } {
  const ratio = score / total;
  if (ratio >= 0.9) return { label: 'S', message: '천재적인 감각이에요!' };
  if (ratio >= 0.8) return { label: 'A', message: '이모지 마스터!' };
  if (ratio >= 0.6) return { label: 'B', message: '꽤 잘 맞추셨어요!' };
  if (ratio >= 0.4) return { label: 'C', message: '조금만 더 연습하면 돼요' };
  return { label: 'D', message: '다시 도전해보세요!' };
}

function ResultScreen({ quizState, onRestart, onRetryCategory }: ResultScreenProps) {
  const { score, questions, answers, selectedChoices, maxStreak, category } = quizState;
  const total = questions.length;
  const grade = getGrade(score, total);
  const categoryLabel = categoryInfos.find((c) => c.id === category)?.label ?? '';
  const correctCount = answers.filter((a) => a === true).length;
  const wrongCount = answers.filter((a) => a === false).length;

  const gradeColor =
    grade.label === 'S'
      ? 'text-amber-500'
      : grade.label === 'A'
        ? 'text-emerald-500'
        : grade.label === 'B'
          ? 'text-blue-500'
          : grade.label === 'C'
            ? 'text-orange-500'
            : 'text-rose-400';

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10">
      {/* Trophy icon */}
      <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#e11d48"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>

      <p className="text-sm font-medium text-rose-400 mb-1">
        {categoryLabel} 퀴즈 완료
      </p>

      {/* Grade */}
      <div className={`text-7xl font-bold mb-2 ${gradeColor}`}>
        {grade.label}
      </div>
      <p className="text-base text-rose-700 font-medium mb-6">
        {grade.message}
      </p>

      {/* Score card */}
      <div className="bg-white rounded-xl p-6 w-full shadow-sm mb-8">
        <div className="text-center mb-4">
          <span className="text-4xl font-bold text-rose-900">{score}</span>
          <span className="text-lg text-rose-400 font-medium"> / {total}</span>
        </div>

        <div className="flex justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm font-medium text-emerald-600">정답</span>
            </div>
            <span className="text-2xl font-bold text-emerald-600">{correctCount}</span>
          </div>
          <div className="w-px bg-rose-100" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="text-sm font-medium text-red-500">오답</span>
            </div>
            <span className="text-2xl font-bold text-red-500">{wrongCount}</span>
          </div>
        </div>
      </div>

      {/* Max streak */}
      {maxStreak >= 2 && (
        <div className="w-full bg-amber-50 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-sm font-medium text-amber-700">
            최대 {maxStreak}연속 정답!
          </span>
        </div>
      )}

      {/* Answer review */}
      <div className="w-full mb-8">
        <h3 className="text-sm font-semibold text-rose-500 mb-3">문제 돌아보기</h3>
        <div className="flex flex-col gap-2">
          {questions.map((q, i) => {
            const isCorrect = answers[i] === true;
            const userAnswer = selectedChoices[i];
            return (
              <div
                key={i}
                className={`rounded-lg px-4 py-3 flex items-center gap-3 ${
                  isCorrect ? 'bg-emerald-50' : 'bg-red-50'
                }`}
              >
                <span className="text-xs font-semibold text-rose-300 w-5 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-xl flex-shrink-0" role="img">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                    {q.answer}
                  </p>
                  {!isCorrect && userAnswer && (
                    <p className="text-xs text-red-400 mt-0.5 line-through">
                      {userAnswer}
                    </p>
                  )}
                  {!isCorrect && !userAnswer && (
                    <p className="text-xs text-red-400 mt-0.5">시간 초과</p>
                  )}
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isCorrect ? '#10b981' : '#ef4444'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isCorrect ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  )}
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-3 mt-auto">
        <button
          onClick={onRetryCategory}
          className="w-full bg-rose-600 text-white font-semibold py-3.5 rounded-lg active:scale-[0.97] transition-transform"
        >
          다른 카테고리 도전
        </button>
        <button
          onClick={onRestart}
          className="w-full bg-white text-rose-600 font-semibold py-3.5 rounded-lg border-2 border-rose-200 active:scale-[0.97] transition-transform"
        >
          처음으로
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
