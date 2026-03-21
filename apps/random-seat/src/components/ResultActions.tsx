import React, { useState } from 'react';
import { SeatAssignment } from '../types';

interface ResultActionsProps {
  seats: SeatAssignment[];
  onReshuffle: () => void;
  isShuffling: boolean;
}

export default function ResultActions({ seats, onReshuffle, isShuffling }: ResultActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const lines = seats.map((s) => `${s.index + 1}번: ${s.name}`).join('\n');
    const text = `자리 배치 결과\n---\n${lines}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex justify-center gap-3">
      <button
        onClick={onReshuffle}
        disabled={isShuffling}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm14.49 3.882a7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H3.986a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-1.45-.388z" clipRule="evenodd" />
        </svg>
        다시 섞기
      </button>
      <button
        onClick={handleCopy}
        disabled={isShuffling}
        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-md hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94A48.972 48.972 0 0012 3c-2.227 0-4.406.148-6.336.432A2.884 2.884 0 003 6.108V9.38a3 3 0 003 3h1.502V6z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M13.5 9.375a1.875 1.875 0 00-1.875-1.875H7.875A1.875 1.875 0 006 9.375v11.25A1.875 1.875 0 007.875 22.5h3.75a1.875 1.875 0 001.875-1.875V9.375z" clipRule="evenodd" />
        </svg>
        {copied ? '복사 완료' : '결과 복사'}
      </button>
    </div>
  );
}
