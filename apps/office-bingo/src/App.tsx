import { useState, useEffect, useCallback } from 'react';
import { DailyBoard } from './types';
import {
  getTodayBoard,
  saveTodayBoard,
  generateBoard,
  detectBingoLines,
  getStreak,
  getStats,
  BingoLine,
} from './store';
import Header from './components/Header';
import BingoBoard from './components/BingoBoard';
import Footer from './components/Footer';
import ShareCard from './components/ShareCard';

function getKoreanDateLabel(): string {
  const now = new Date();
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const day = dayNames[now.getDay()];
  return `${month}월 ${date}일 ${day}`;
}

export default function App() {
  const [board, setBoard] = useState<DailyBoard>(() => {
    return getTodayBoard() || generateBoard();
  });
  const [bingoLines, setBingoLines] = useState<BingoLine[]>([]);
  const [showShare, setShowShare] = useState(false);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({ totalDays: 0, totalBingos: 0, bestStreak: 0 });

  const updateBingoState = useCallback((b: DailyBoard) => {
    const lines = detectBingoLines(b.checked);
    setBingoLines(lines);
    b.bingoCount = lines.length;
    if (lines.length > 0 && !b.completedAt) {
      b.completedAt = new Date().toISOString();
    }
    saveTodayBoard(b);
    setStreak(getStreak());
    setStats(getStats());
  }, []);

  useEffect(() => {
    updateBingoState(board);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (index: number) => {
    const newChecked = [...board.checked];
    newChecked[index] = !newChecked[index];
    const newBoard = { ...board, checked: newChecked };
    setBoard(newBoard);
    updateBingoState(newBoard);
  };

  const handleShuffle = () => {
    if (window.confirm('새 판으로 바꾸시겠습니까? 현재 진행 상태가 초기화됩니다.')) {
      const newBoard = generateBoard();
      setBoard(newBoard);
      updateBingoState(newBoard);
    }
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const dateLabel = getKoreanDateLabel();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      <div className="max-w-md mx-auto">
        <Header streak={streak} />
        <BingoBoard
          cells={board.cells}
          checked={board.checked}
          bingoLines={bingoLines}
          bingoCount={board.bingoCount}
          dateLabel={dateLabel}
          onToggle={handleToggle}
        />
        <Footer
          bingoCount={board.bingoCount}
          totalDays={stats.totalDays}
          bestStreak={stats.bestStreak}
          onShuffle={handleShuffle}
          onShare={handleShare}
        />
      </div>

      {showShare && (
        <ShareCard
          cells={board.cells}
          checked={board.checked}
          bingoCount={board.bingoCount}
          dateLabel={dateLabel}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
