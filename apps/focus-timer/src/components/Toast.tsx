import { useEffect } from 'react';

interface ToastProps {
  emoji: string;
  message: string;
  subMessage?: string;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({ emoji, message, subMessage, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 animate-slide-down">
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg max-w-[340px] w-full"
        style={{ background: 'linear-gradient(135deg, #fbbc00, #ffb77d)' }}
      >
        <span className="text-[32px] leading-none">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-black">{message}</p>
          {subMessage && (
            <p className="text-[12px] text-black/70 mt-0.5 truncate">{subMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
