import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  icon?: string;
  onShare?: () => void;
}

export function InsightCard({ title, children, icon, onShare }: Props) {
  return (
    <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              {icon}
            </span>
          )}
          <h3 className="font-headline text-sm font-medium text-on-surface">{title}</h3>
        </div>
        {onShare && (
          <button
            onClick={onShare}
            className="text-on-surface-variant/60 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">share</span>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
