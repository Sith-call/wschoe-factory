import { useState, useEffect, useCallback } from 'react';
import { Question, Category } from '../types';
import { saveAnswer, getUnansweredQuestions, shuffleArray, getStats } from '../store';
import { CATEGORY_ICONS } from '../data/questions';

interface Props {
  category: Category | '전체';
  onFinish: () => void;
  onHome: () => void;
}

export default function GameScreen({ category, onFinish, onHome }: Props) {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [animatedPercentA, setAnimatedPercentA] = useState(0);
  const [animatedPercentB, setAnimatedPercentB] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFlash, setShowFlash] = useState<'A' | 'B' | null>(null);
  const [entering, setEntering] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [majorityBadge, setMajorityBadge] = useState<string | null>(null);

  useEffect(() => {
    const unanswered = getUnansweredQuestions(category);
    setQuestionList(shuffleArray(unanswered));
    setStreak(getStats().streak);
  }, [category]);

  const question = questionList[currentIndex];
  const total = questionList.length;

  const handleSelect = useCallback((choice: 'A' | 'B') => {
    if (selected || !question) return;

    // Flash effect
    setShowFlash(choice);
    setTimeout(() => setShowFlash(null), 300);

    setSelected(choice);

    // Save and get updated stats
    const updatedStats = saveAnswer(question.id, choice);
    setStreak(updatedStats.streak);

    // Check majority
    const majorityChoice = question.percentA >= question.percentB ? 'A' : 'B';
    const pickedMajority = choice === majorityChoice;

    // Reveal after brief delay
    setTimeout(() => {
      setRevealed(true);
      setMajorityBadge(pickedMajority ? '다수파!' : '소수파!');

      // Animate percentages
      const duration = 800;
      const steps = 30;
      const intervalTime = duration / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedPercentA(Math.round(question.percentA * eased));
        setAnimatedPercentB(Math.round(question.percentB * eased));
        if (step >= steps) {
          clearInterval(timer);
          setAnimatedPercentA(question.percentA);
          setAnimatedPercentB(question.percentB);
        }
      }, intervalTime);
    }, 400);
  }, [selected, question]);

  const handleNext = useCallback(() => {
    if (currentIndex >= total - 1) {
      onFinish();
      return;
    }

    setExiting(true);
    setTimeout(() => {
      setSelected(null);
      setRevealed(false);
      setAnimatedPercentA(0);
      setAnimatedPercentB(0);
      setMajorityBadge(null);
      setExiting(false);
      setEntering(true);
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  }, [currentIndex, total, onFinish]);

  // Reset entering animation
  useEffect(() => {
    if (entering) {
      const t = setTimeout(() => setEntering(false), 500);
      return () => clearTimeout(t);
    }
  }, [entering, currentIndex]);

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-on-surface-variant text-lg mb-4">질문이 없습니다</p>
          <button onClick={onHome} className="text-primary underline">홈으로</button>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentIndex >= total - 1;

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onHome}
          className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              {CATEGORY_ICONS[question.category]}
            </span>
            {question.category}
          </span>
          <span className="text-sm text-outline">
            {currentIndex + 1}/{total}
          </span>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-1 text-sm animate-bounce-in">
            <span style={{ fontSize: '14px' }}>🔥</span>
            <span className="text-secondary font-bold">{streak}</span>
          </div>
        )}
        {streak === 0 && <div className="w-10" />}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-surface-container-high rounded-full mb-6 overflow-hidden">
        <div
          className="h-full btn-gradient rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question Cards */}
      <div
        className={`flex-1 flex flex-col gap-3 justify-center ${
          exiting ? 'animate-card-exit' : entering ? 'animate-slide-in-bottom' : ''
        }`}
      >
        {/* Option A */}
        <button
          onClick={() => handleSelect('A')}
          disabled={!!selected}
          className={`relative flex-1 min-h-[140px] rounded-2xl p-5 flex flex-col justify-center items-center
            transition-all duration-300 active:scale-[0.97]
            ${selected === 'A' ? 'option-a-bg-selected scale-[1.02]' : selected === 'B' ? 'option-a-bg opacity-60 scale-[0.98]' : 'option-a-bg hover:scale-[1.01]'}
          `}
        >
          {/* Flash overlay */}
          {showFlash === 'A' && (
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-tap-flash" />
          )}

          <span className="text-xs font-bold text-primary/70 mb-2 tracking-wider">A</span>
          <p className="text-lg font-bold text-on-surface text-center leading-relaxed">
            {question.optionA}
          </p>

          {/* Revealed percentage */}
          {revealed && (
            <div className="mt-3 w-full animate-slide-reveal">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-on-surface-variant">선택률</span>
                <span className="font-bold text-primary text-lg">{animatedPercentA}%</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full option-a-gradient animate-percent-fill"
                  style={{ width: `${question.percentA}%` }}
                />
              </div>
            </div>
          )}
        </button>

        {/* VS Divider */}
        <div className="flex items-center justify-center py-1">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span
            className={`mx-4 text-2xl font-headline font-extrabold ${
              selected ? 'text-outline' : 'animate-neon-glow text-primary'
            }`}
          >
            VS
          </span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        {/* Option B */}
        <button
          onClick={() => handleSelect('B')}
          disabled={!!selected}
          className={`relative flex-1 min-h-[140px] rounded-2xl p-5 flex flex-col justify-center items-center
            transition-all duration-300 active:scale-[0.97]
            ${selected === 'B' ? 'option-b-bg-selected scale-[1.02]' : selected === 'A' ? 'option-b-bg opacity-60 scale-[0.98]' : 'option-b-bg hover:scale-[1.01]'}
          `}
        >
          {showFlash === 'B' && (
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-tap-flash" />
          )}

          <span className="text-xs font-bold text-indigo-400/70 mb-2 tracking-wider">B</span>
          <p className="text-lg font-bold text-on-surface text-center leading-relaxed">
            {question.optionB}
          </p>

          {revealed && (
            <div className="mt-3 w-full animate-slide-reveal">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-on-surface-variant">선택률</span>
                <span className="font-bold text-indigo-400 text-lg">{animatedPercentB}%</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full option-b-gradient animate-percent-fill"
                  style={{ width: `${question.percentB}%` }}
                />
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Majority badge */}
      {majorityBadge && (
        <div className="flex justify-center mt-4 animate-bounce-in">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              majorityBadge === '다수파!'
                ? 'bg-primary/20 text-primary'
                : 'bg-indigo-500/20 text-indigo-400'
            }`}
          >
            {majorityBadge === '다수파!' ? '🎉 다수파!' : '😎 소수파!'}
          </span>
        </div>
      )}

      {/* Next button */}
      {revealed && (
        <div className="mt-4 animate-fade-in-up">
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]
              btn-gradient text-on-primary shadow-lg shadow-primary/20"
          >
            {isLastQuestion ? '결과 보기' : '다음 질문 →'}
          </button>
        </div>
      )}
    </div>
  );
}
