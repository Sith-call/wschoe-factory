import { situations } from '../data/situations';
import { BingoLine } from '../store';

interface BingoBoardProps {
  cells: number[];
  checked: boolean[];
  bingoLines: BingoLine[];
  bingoCount: number;
  dateLabel: string;
  onToggle: (index: number) => void;
}

export default function BingoBoard({
  cells,
  checked,
  bingoLines,
  bingoCount,
  dateLabel,
  onToggle,
}: BingoBoardProps) {
  // Build a set of cell indices that are part of a bingo line
  const bingoCells = new Set<number>();
  bingoLines.forEach((line) => line.forEach((i) => bingoCells.add(i)));

  const situationMap = new Map(situations.map((s) => [s.id, s]));

  return (
    <div className="px-4">
      {/* Board header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          {bingoCount > 0 && (
            <p className="text-sm font-medium" style={{ color: '#dc2626' }}>
              {bingoCount} 빙고!
            </p>
          )}
        </div>
        <p className="text-xs font-light text-zinc-400">{dateLabel}</p>
      </div>

      {/* 5x5 Grid */}
      <div
        className="grid grid-cols-5 w-full mx-auto"
        style={{ maxWidth: '400px', border: '1px solid #e4e4e7' }}
      >
        {cells.map((cellId, index) => {
          const isFreeCell = index === 12;
          const isChecked = checked[index];
          const isInBingo = bingoCells.has(index);
          const situation = situationMap.get(cellId);
          const text = isFreeCell ? '자유칸' : situation?.text ?? '';

          return (
            <button
              key={index}
              onClick={() => {
                if (!isFreeCell) onToggle(index);
              }}
              className="relative flex items-center justify-center p-1 aspect-square"
              style={{
                backgroundColor: isFreeCell
                  ? '#fef2f2'
                  : isChecked
                    ? '#18181b'
                    : '#ffffff',
                color: isFreeCell
                  ? '#991b1b'
                  : isChecked
                    ? '#ffffff'
                    : '#18181b',
                borderRight: '1px solid #e4e4e7',
                borderBottom: '1px solid #e4e4e7',
                borderLeft: isInBingo ? '3px solid #dc2626' : 'none',
                transition: 'background-color 150ms',
                cursor: isFreeCell ? 'default' : 'pointer',
                fontSize: '12px',
                lineHeight: '1.3',
                fontWeight: isFreeCell ? 500 : 400,
                minHeight: '64px',
              }}
            >
              <span
                className="text-center overflow-hidden"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
