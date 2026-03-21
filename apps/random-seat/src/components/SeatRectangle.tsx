import React from 'react';
import { SeatAssignment } from '../types';

interface SeatRectangleProps {
  seats: SeatAssignment[];
  isShuffling: boolean;
  isHighlighting?: boolean;
}

function SeatBox({
  seat,
  index,
  isShuffling,
  isHighlighting,
}: {
  seat: SeatAssignment;
  index: number;
  isShuffling: boolean;
  isHighlighting?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-20 h-16 bg-white border-2 border-gray-200 rounded-lg shadow-sm seat-transition ${
        isShuffling ? 'shuffle-shake' : isHighlighting ? 'seat-highlight' : 'seat-pop'
      }`}
      style={{
        animationDelay: isShuffling ? '0ms' : `${index * 40}ms`,
        animationFillMode: 'backwards',
      }}
    >
      <span className="text-xs text-gray-400 font-medium">{seat.index + 1}번</span>
      <span className="text-xs font-medium text-gray-800 mt-0.5 truncate max-w-[72px] text-center">
        {seat.name}
      </span>
    </div>
  );
}

export default function SeatRectangle({ seats, isShuffling, isHighlighting }: SeatRectangleProps) {
  const count = seats.length;

  // Distribute seats around rectangle: top & bottom get priority,
  // then left & right get 1 each if there are enough people.
  let topCount: number;
  let bottomCount: number;
  let leftCount: number;
  let rightCount: number;

  if (count <= 2) {
    // 2 people: one on each long side
    topCount = 1;
    bottomCount = count - 1;
    leftCount = 0;
    rightCount = 0;
  } else if (count <= 4) {
    // 3-4: split evenly top/bottom
    topCount = Math.ceil(count / 2);
    bottomCount = count - topCount;
    leftCount = 0;
    rightCount = 0;
  } else {
    // 5+: fill left & right with 1 each, rest split top/bottom
    leftCount = 1;
    rightCount = 1;
    const remaining = count - 2;
    topCount = Math.ceil(remaining / 2);
    bottomCount = remaining - topCount;
  }

  let idx = 0;
  const top = seats.slice(idx, (idx += topCount));
  const right = seats.slice(idx, (idx += rightCount));
  const bottom = seats.slice(idx, (idx += bottomCount));
  const left = seats.slice(idx, idx + leftCount);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Top row */}
      <div className="flex justify-center gap-2">
        {top.map((s, i) => (
          <SeatBox key={s.index} seat={s} index={i} isShuffling={isShuffling} isHighlighting={isHighlighting} />
        ))}
      </div>

      {/* Middle: left | table | right */}
      <div className="flex items-center gap-3">
        {/* Left column */}
        {left.length > 0 && (
          <div className="flex flex-col gap-2">
            {left.map((s, i) => (
              <SeatBox
                key={s.index}
                seat={s}
                index={topCount + rightCount + bottomCount + i}
                isShuffling={isShuffling}
                isHighlighting={isHighlighting}
              />
            ))}
          </div>
        )}

        {/* Table */}
        <div
          className="bg-white/60 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium"
          style={{
            width: Math.max(160, topCount * 88),
            height: Math.max(80, Math.max(right.length, left.length) * 72),
          }}
        >
          테이블
        </div>

        {/* Right column */}
        {right.length > 0 && (
          <div className="flex flex-col gap-2">
            {right.map((s, i) => (
              <SeatBox
                key={s.index}
                seat={s}
                index={topCount + i}
                isShuffling={isShuffling}
                isHighlighting={isHighlighting}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom row */}
      {bottom.length > 0 && (
        <div className="flex justify-center gap-2">
          {bottom.map((s, i) => (
            <SeatBox
              key={s.index}
              seat={s}
              index={topCount + rightCount + i}
              isShuffling={isShuffling}
              isHighlighting={isHighlighting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
