import React, { useState, useCallback, useRef } from 'react';
import { LayoutType, SeatAssignment } from './types';
import { fisherYatesShuffle } from './shuffle';
import NameInput from './components/NameInput';
import GroupManager from './components/GroupManager';
import LayoutSelector from './components/LayoutSelector';
import SeatGrid from './components/SeatGrid';
import SeatCircle from './components/SeatCircle';
import SeatRectangle from './components/SeatRectangle';
import ResultActions from './components/ResultActions';

export default function App() {
  const [names, setNames] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutType>('rectangle');
  const [seats, setSeats] = useState<SeatAssignment[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const shuffleInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const doShuffle = useCallback(() => {
    if (names.length < 2) return;
    setIsShuffling(true);
    setIsHighlighting(false);

    // Clear any existing interval
    if (shuffleInterval.current) {
      clearInterval(shuffleInterval.current);
    }

    // Rapid shuffling for visual effect
    shuffleInterval.current = setInterval(() => {
      const shuffled = fisherYatesShuffle(names);
      setSeats(shuffled.map((name, i) => ({ index: i, name })));
    }, 100);

    // Stop after 2 seconds and settle
    setTimeout(() => {
      if (shuffleInterval.current) {
        clearInterval(shuffleInterval.current);
        shuffleInterval.current = null;
      }
      const finalOrder = fisherYatesShuffle(names);
      setSeats(finalOrder.map((name, i) => ({ index: i, name })));
      setIsShuffling(false);
      setIsHighlighting(true);
      // Remove highlight after animation completes
      setTimeout(() => setIsHighlighting(false), 600);
    }, 2000);
  }, [names]);

  const handleLoadGroup = (members: string[]) => {
    setNames(members);
    setSeats([]);
  };

  const canShuffle = names.length >= 2;

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-semibold text-gray-900">자리 뽑기</h1>
          <p className="text-sm text-gray-500 mt-1">회의, 식사, 수업 자리를 랜덤으로 배정합니다</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Name input section */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <NameInput names={names} onNamesChange={setNames} />
        </section>

        {/* Group manager */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <GroupManager names={names} onLoadGroup={handleLoadGroup} />
        </section>

        {/* Layout selector */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <LayoutSelector selected={layout} onSelect={setLayout} />
        </section>

        {/* Shuffle button */}
        <div className="flex justify-center">
          <button
            onClick={doShuffle}
            disabled={!canShuffle || isShuffling}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-md text-lg hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm14.49 3.882a7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H3.986a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-1.45-.388z" clipRule="evenodd" />
            </svg>
            {isShuffling ? '섞는 중...' : '자리 섞기'}
          </button>
        </div>

        {/* Seat arrangement display */}
        {seats.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5 text-center">배치 결과</h2>
            <div className="flex justify-center overflow-x-auto py-4">
              {layout === 'grid' && (
                <SeatGrid seats={seats} isShuffling={isShuffling} isHighlighting={isHighlighting} />
              )}
              {layout === 'circle' && (
                <SeatCircle seats={seats} isShuffling={isShuffling} isHighlighting={isHighlighting} />
              )}
              {layout === 'rectangle' && (
                <SeatRectangle seats={seats} isShuffling={isShuffling} isHighlighting={isHighlighting} />
              )}
            </div>
            <div className="mt-6">
              <ResultActions
                seats={seats}
                onReshuffle={doShuffle}
                isShuffling={isShuffling}
              />
            </div>
          </section>
        )}

        {/* Empty state */}
        {seats.length === 0 && canShuffle && (
          <div className="text-center py-8 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-3 text-gray-300">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06l-2.47-2.47V14.25a.75.75 0 01-1.5 0V4.81L8.78 7.28a.75.75 0 01-1.06-1.06l3.75-3.75zM12 14.25a.75.75 0 01.75.75v2.25a1.5 1.5 0 01-1.5 1.5h-6a1.5 1.5 0 01-1.5-1.5V15a.75.75 0 011.5 0v2.25h6V15a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">위의 "자리 섞기" 버튼을 눌러보세요</p>
          </div>
        )}
      </main>
    </div>
  );
}
