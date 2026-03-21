import { useEffect, useState } from 'react';
import type { Grade } from '../types';

interface BestRecord {
  bestTimeMs: number;
  bestGrade: Grade;
}

function loadBestRecord(): BestRecord | null {
  try {
    const raw = localStorage.getItem('color-match-best');
    if (!raw) return null;
    return JSON.parse(raw) as BestRecord;
  } catch {
    return null;
  }
}

interface StartScreenProps {
  onStart: () => void;
}

function EyeIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M128 56C48 56 8 128 8 128s40 72 120 72 120-72 120-72-40-72-120-72Z"
        stroke="#2dd4bf"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="128"
        cy="128"
        r="32"
        stroke="#2dd4bf"
        strokeWidth="16"
        fill="#f0fdfa"
      />
    </svg>
  );
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [bestRecord, setBestRecord] = useState<BestRecord | null>(null);

  useEffect(() => {
    setBestRecord(loadBestRecord());
  }, []);

  const formatBestTime = (ms: number) => `${(ms / 1000).toFixed(1)}초`;

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 max-w-sm mx-auto text-center">
      <div className="mb-6" aria-hidden="true">
        <EyeIcon />
      </div>

      <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
        컬러 매치
      </h1>
      <p className="text-base text-gray-500 mb-8 leading-relaxed">
        격자 안에서 다른 색을 가진 칸을 찾으세요.
        <br />
        라운드가 진행될수록 난이도가 올라갑니다.
      </p>

      {bestRecord && (
        <div className="w-full bg-teal-50 rounded-lg p-4 mb-6 flex items-center justify-between" aria-label={`최고 기록: 등급 ${bestRecord.bestGrade}, 시간 ${formatBestTime(bestRecord.bestTimeMs)}`}>
          <span className="text-sm text-gray-600 font-medium">최고 기록</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-primary">{bestRecord.bestGrade}등급</span>
            <span className="text-sm text-gray-500 tabular-nums">{formatBestTime(bestRecord.bestTimeMs)}</span>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-xl p-5 mb-8 w-full text-left space-y-3">
        <div className="flex items-start gap-3">
          <span className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
          </span>
          <p className="text-sm text-gray-700">
            총 <strong className="font-semibold">10라운드</strong>, 격자 크기가 점점 커집니다
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
          </span>
          <p className="text-sm text-gray-700">
            <strong className="font-semibold">정확도</strong>와{' '}
            <strong className="font-semibold">속도</strong>로 등급이 결정됩니다
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
          </span>
          <p className="text-sm text-gray-700">
            등급: <strong className="font-semibold">S &gt; A &gt; B &gt; C &gt; D</strong>
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-primary text-white font-semibold text-base py-3.5 rounded-lg active:scale-[0.97] transition-transform"
        aria-label="컬러 매치 테스트 시작"
      >
        테스트 시작
      </button>
    </div>
  );
}
