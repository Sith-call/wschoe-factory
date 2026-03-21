import { useState, useRef, useCallback, useEffect } from 'react';
import { MenuItem } from '../types';
import { SEGMENT_COLORS, RESULT_MESSAGES } from '../data';

interface Props {
  items: MenuItem[];
  onResult: (item: MenuItem) => void;
}

export default function SpinWheel({ items, onResult }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<MenuItem | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinButtonRef = useRef<HTMLButtonElement>(null);

  const segmentAngle = items.length > 0 ? 360 / items.length : 360;

  const spin = useCallback(() => {
    if (spinning || items.length < 2) return;

    setShowResult(false);
    setResult(null);
    setCopied(false);
    setSpinning(true);

    // Random 5-8 full rotations + random landing
    const extraSpins = (5 + Math.random() * 3) * 360;
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + extraSpins + randomAngle;

    setRotation(newRotation);

    // Determine which item the pointer lands on
    // Pointer is at the top (0 degrees). The wheel rotates clockwise.
    // After rotation, normalize and find the segment.
    setTimeout(() => {
      const normalizedAngle = ((newRotation % 360) + 360) % 360;
      // The pointer is at top. Wheel rotates clockwise, so the segment
      // at the pointer is the one at (360 - normalizedAngle) degrees.
      const pointerAngle = (360 - normalizedAngle + 360) % 360;
      const selectedIndex = Math.floor(pointerAngle / segmentAngle) % items.length;
      const selected = items[selectedIndex];

      setResult(selected);
      setResultMessage(
        RESULT_MESSAGES[Math.floor(Math.random() * RESULT_MESSAGES.length)]
      );
      setSpinning(false);

      // Show result with a small delay for the animation
      requestAnimationFrame(() => {
        setShowResult(true);
      });

      onResult(selected);

      // Return focus to spin button for keyboard users
      spinButtonRef.current?.focus();
    }, 4000);
  }, [spinning, items, rotation, segmentAngle, onResult]);

  // Keyboard support: Space or Enter to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        // Only trigger if no input/textarea/select is focused
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (tag === 'BUTTON' && e.target !== spinButtonRef.current) return;
        e.preventDefault();
        spin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spin]);

  const copyResult = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`오늘 점심: ${result.name}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
    }
  }, [result]);

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16">
        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-400 text-sm font-semibold">
          메뉴를 추가해주세요!
        </p>
      </div>
    );
  }

  // Build conic gradient for the wheel
  const conicStops = items
    .map((_, i) => {
      const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      const start = (i * segmentAngle).toFixed(2);
      const end = ((i + 1) * segmentAngle).toFixed(2);
      return `${color} ${start}deg ${end}deg`;
    })
    .join(', ');

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pointer triangle */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
            <path d="M12 20L0 0h24L12 20z" fill="#1f2937" />
          </svg>
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="w-72 h-72 sm:w-80 sm:h-80 rounded-full relative overflow-hidden border-4 border-gray-800"
          style={{
            background: `conic-gradient(${conicStops})`,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
          }}
        >
          {/* Text labels on segments */}
          {items.map((item, i) => {
            const angle = i * segmentAngle + segmentAngle / 2;
            return (
              <div
                key={item.id}
                className="absolute left-1/2 top-1/2 origin-top-left"
                style={{
                  transform: `rotate(${angle}deg) translate(0, -50%)`,
                  width: '50%',
                }}
              >
                <span
                  className="block text-white text-xs font-bold pl-8 drop-shadow-sm"
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '110px',
                  }}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spin button */}
      <button
        ref={spinButtonRef}
        onClick={spin}
        disabled={spinning || items.length < 2}
        className={`px-8 py-3 rounded-md font-semibold text-white text-base transition-all ${
          spinning
            ? 'bg-gray-400 cursor-not-allowed animate-spin-pulse'
            : 'bg-primary hover:bg-orange-600 active:scale-95'
        }`}
        aria-label={spinning ? '돌아가는 중' : result ? '다시 돌리기' : '룰렛 돌리기'}
      >
        {spinning ? '돌아가는 중...' : result ? '다시 돌리기' : '돌리기'}
      </button>

      {/* Result card */}
      {result && (
        <div
          className={`w-full bg-white rounded-lg border border-gray-200 p-5 text-center transition-all duration-300 ${
            showResult
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-90'
          }`}
          style={{
            transformOrigin: 'center',
          }}
        >
          <p className="text-sm text-gray-500 mb-1">{resultMessage}</p>
          <p className="text-xl font-bold text-gray-900">{result.name}</p>
          <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold text-primary bg-orange-50 rounded">
            {result.category}
          </span>
          <div className="mt-3">
            <button
              onClick={copyResult}
              className="px-4 py-1.5 text-sm font-semibold rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copied ? '복사 완료!' : '결과 복사'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
