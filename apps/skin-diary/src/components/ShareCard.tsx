import React, { useRef } from 'react';
import { shareOrDownload, generateShareImage } from '../utils/share';

interface Props {
  children: React.ReactNode;
  filename?: string;
}

export function ShareCard({ children, filename = 'skin-diary-insight.png' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!ref.current) return;
    const blob = await generateShareImage(ref.current);
    if (blob) {
      await shareOrDownload(blob, filename);
    }
  };

  return (
    <div>
      <div ref={ref} className="bg-background p-6 pb-4 rounded-xl">
        {children}
        {/* App branding watermark */}
        <div className="mt-4 pt-3 border-t border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary/40 text-sm">spa</span>
            <span className="text-[10px] font-noto-serif italic text-on-surface-variant/40">피부 일지</span>
          </div>
          <span className="text-[9px] text-on-surface-variant/30 tracking-wider">SKIN DIARY</span>
        </div>
      </div>
      <button
        onClick={handleShare}
        className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-primary group"
      >
        <span className="material-symbols-outlined text-sm">share</span>
        공유하기
      </button>
    </div>
  );
}
