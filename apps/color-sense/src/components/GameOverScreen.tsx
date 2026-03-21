import { useEffect } from 'react';

interface GameOverScreenProps {
  lastLevel: number;
  isTimeout: boolean;
  onResult: () => void;
}

export default function GameOverScreen({
  lastLevel,
  isTimeout,
  onResult,
}: GameOverScreenProps) {
  // Auto-transition to result after 2 seconds
  useEffect(() => {
    const timer = setTimeout(onResult, 2000);
    return () => clearTimeout(timer);
  }, [onResult]);

  return (
    <div className="screen-enter min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-5 max-w-[480px] mx-auto">
      <h1
        className="text-2xl font-bold text-[#18181b]"
        style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
      >
        {isTimeout ? '시간 초과!' : '틀렸습니다!'}
      </h1>

      <p className="mt-2 text-base text-[#71717a]">
        <span
          className="font-tabular"
          style={{ fontFamily: "'Archivo', system-ui" }}
        >
          Round {lastLevel}
        </span>
        에서 탈락
      </p>

      <button
        onClick={onResult}
        className="mt-8 w-full max-w-[320px] py-3 bg-[#7c3aed] text-white font-semibold rounded-md
                   hover:bg-[#6d28d9] active:bg-[#5b21b6] transition-colors"
        style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
      >
        결과 보기
      </button>
    </div>
  );
}
