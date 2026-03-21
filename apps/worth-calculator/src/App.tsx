import React, { useState, useCallback } from 'react';
import { QuizResult } from './types';
import { questions } from './data/questions';
import { saveResult, getLatestResult } from './store';
import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';
import CalculatingScreen from './components/CalculatingScreen';
import ResultScreen from './components/ResultScreen';

type Screen = 'intro' | 'quiz' | 'calculating' | 'result';

function getTitle(score: number): string {
  if (score <= 150) return '인턴 체험단';
  if (score <= 250) return '사회초년생';
  if (score <= 350) return '중견 실무자';
  if (score <= 420) return '핵심 인재';
  return '전설의 S급';
}

function getDescription(score: number): string {
  if (score <= 150) return '아직 성장 중! 가능성은 무한대';
  if (score <= 250) return '시작이 반이다. 나머지 반은 야근';
  if (score <= 350) return '회사의 중추. 없으면 돌아가긴 하는데 삐걱거림';
  if (score <= 420) return '헤드헌터 전화 올 때 안 받는 척 하세요';
  return '연봉 부르는 게 값. 회사가 당신을 면접봐야 함';
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; optionIndex: number }[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  const hasResult = getLatestResult() !== null;

  const handleStart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setScreen('quiz');
  };

  const handleViewResult = () => {
    const latest = getLatestResult();
    if (latest) {
      setResult(latest);
      setScreen('result');
    }
  };

  const handleSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    // Replace or add answer for current question
    const existing = newAnswers.findIndex((a) => a.questionId === questions[currentQuestion].id);
    if (existing >= 0) {
      newAnswers[existing] = { questionId: questions[currentQuestion].id, optionIndex: selectedOption! };
    } else {
      newAnswers.push({ questionId: questions[currentQuestion].id, optionIndex: selectedOption! });
    }
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      // Calculate result
      const totalWorth = newAnswers.reduce((sum, a) => {
        const q = questions.find((qq) => qq.id === a.questionId);
        if (!q) return sum;
        return sum + q.options[a.optionIndex].value;
      }, 0);

      const quizResult: QuizResult = {
        totalWorth,
        title: getTitle(totalWorth),
        description: getDescription(totalWorth),
        answers: newAnswers,
        completedAt: new Date().toISOString(),
      };

      setResult(quizResult);
      saveResult(quizResult);
      setScreen('calculating');
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  const handleBack = () => {
    if (currentQuestion === 0) {
      setScreen('intro');
    } else {
      setCurrentQuestion((prev) => prev - 1);
      // Restore previous answer
      const prevAnswer = answers.find((a) => a.questionId === questions[currentQuestion - 1].id);
      setSelectedOption(prevAnswer ? prevAnswer.optionIndex : null);
    }
  };

  const handleCalculatingDone = useCallback(() => {
    setScreen('result');
  }, []);

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
    setScreen('intro');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {screen === 'intro' && (
        <IntroScreen onStart={handleStart} onViewResult={handleViewResult} hasResult={hasResult} />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          questions={questions}
          currentIndex={currentQuestion}
          selectedOption={selectedOption}
          onSelect={handleSelect}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {screen === 'calculating' && <CalculatingScreen onDone={handleCalculatingDone} />}
      {screen === 'result' && result && <ResultScreen result={result} onRestart={handleRestart} />}
    </div>
  );
};

export default App;
