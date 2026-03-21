import React from 'react';
import { SeatAssignment } from '../types';

interface SeatCircleProps {
  seats: SeatAssignment[];
  isShuffling: boolean;
  isHighlighting?: boolean;
}

export default function SeatCircle({ seats, isShuffling, isHighlighting }: SeatCircleProps) {
  const count = seats.length;
  const radius = Math.max(100, 40 + count * 18);
  const containerSize = radius * 2 + 100;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* Table circle */}
        <div
          className="absolute border-2 border-gray-200 rounded-full bg-white/50"
          style={{
            width: radius * 2 - 40,
            height: radius * 2 - 40,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {seats.map((seat, i) => {
          const angle = (360 / count) * i - 90;
          const rad = (angle * Math.PI) / 180;
          const cx = containerSize / 2;
          const cy = containerSize / 2;
          const x = cx + Math.cos(rad) * radius - 32; // 32 = half of w-16 (64px)
          const y = cy + Math.sin(rad) * radius - 32;

          return (
            <div
              key={seat.index}
              className={`absolute flex flex-col items-center justify-center w-16 h-16 bg-white border-2 border-gray-200 rounded-lg shadow-sm seat-transition ${
                isShuffling ? 'shuffle-shake' : isHighlighting ? 'seat-highlight' : 'seat-pop'
              }`}
              style={{
                left: x,
                top: y,
                animationDelay: isShuffling ? '0ms' : `${i * 40}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <span className="text-xs text-gray-400 font-medium">{seat.index + 1}번</span>
              <span className="text-xs font-medium text-gray-800 mt-0.5 truncate max-w-[56px] text-center">
                {seat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
