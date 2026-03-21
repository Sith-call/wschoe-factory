import { ShuffleIcon, ShareIcon } from '../icons';

interface FooterProps {
  bingoCount: number;
  totalDays: number;
  bestStreak: number;
  onShuffle: () => void;
  onShare: () => void;
}

export default function Footer({
  bingoCount,
  totalDays,
  bestStreak,
  onShuffle,
  onShare,
}: FooterProps) {
  return (
    <div className="px-4 pt-5 pb-8">
      <div className="flex gap-3 justify-center mb-4">
        <button
          onClick={onShuffle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium text-zinc-700"
          style={{ borderColor: '#e4e4e7' }}
        >
          <ShuffleIcon />
          <span>새 판</span>
        </button>
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#dc2626' }}
        >
          <ShareIcon />
          <span>공유하기</span>
        </button>
      </div>
      {totalDays > 0 && (
        <p className="text-center text-xs font-light text-zinc-400">
          총 {totalDays}일 플레이 | 최고 기록 {bestStreak}일 연속
        </p>
      )}
    </div>
  );
}
