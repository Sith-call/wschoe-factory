import React from 'react';
import { SeatAssignment } from '../types';

interface SeatGridProps {
  seats: SeatAssignment[];
  isShuffling: boolean;
  isHighlighting?: boolean;
}

export default function SeatGrid({ seats, isShuffling, isHighlighting }: SeatGridProps) {
  const count = seats.length;
  const cols = count <= 4 ? 2 : count <= 9 ? 3 : count <= 16 ? 4 : count <= 25 ? 5 : 6;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm font-medium text-gray-500 mb-1">교실 앞쪽</div>
      <div className="w-24 h-1 bg-gray-300 rounded-full mb-2" />
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {seats.map((seat, i) => (
          <div
            key={seat.index}
            className={`flex flex-col items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 rounded-lg shadow-sm seat-transition ${
              isShuffling ? 'shuffle-shake' : isHighlighting ? 'seat-highlight' : 'seat-pop'
            }`}
            style={{
              animationDelay: isShuffling ? '0ms' : `${i * 40}ms`,
              animationFillMode: 'backwards',
            }}
          >
            <span className="text-xs text-gray-400 font-medium">{seat.index + 1}번</span>
            <span className="text-sm font-medium text-gray-800 mt-0.5 truncate max-w-[72px] text-center">
              {seat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
