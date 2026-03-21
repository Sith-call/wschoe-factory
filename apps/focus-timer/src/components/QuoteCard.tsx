import { useMemo } from 'react';
import { getRandomQuote } from '../data/quotes';

interface QuoteCardProps {
  onDismiss: () => void;
}

export default function QuoteCard({ onDismiss }: QuoteCardProps) {
  const quote = useMemo(() => getRandomQuote(), []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-[340px] max-w-[90vw] rounded-2xl p-[2px] bg-gradient-to-br from-primary to-secondary">
        <div className="bg-surface-container rounded-2xl p-8">
          {/* Subtitle */}
          <p className="text-[13px] text-on-surface-variant text-center mb-6 font-medium">
            집중 완료! 잠시 쉬어가세요
          </p>

          {/* Opening quote mark */}
          <span className="block text-primary text-[48px] leading-none font-bold mb-2">
            {'\u300C'}
          </span>

          {/* Quote text */}
          <p className="text-[20px] text-on-surface leading-relaxed mb-4" style={{ fontStyle: 'italic' }}>
            {quote.text}
          </p>

          {/* Author */}
          {quote.author && (
            <p className="text-[14px] text-on-surface-variant mb-6 text-right">
              — {quote.author}
            </p>
          )}
          {!quote.author && <div className="mb-6" />}

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="w-full h-[48px] rounded-2xl btn-gradient text-on-primary font-semibold text-[16px] hover:opacity-90 transition-opacity"
          >
            휴식 시작 →
          </button>
        </div>
      </div>
    </div>
  );
}
