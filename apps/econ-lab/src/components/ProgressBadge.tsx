import React from 'react';

interface ProgressBadgeProps {
  label: string;
  value: number;
  total: number;
  icon: string;
}

export const ProgressBadge: React.FC<ProgressBadgeProps> = ({ label, value, total, icon }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/5 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
        </div>
        <div>
          <p className="font-headline font-bold text-lg text-primary">{value}/{total}</p>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">{label}</p>
        </div>
      </div>
      <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
        <div
          className="h-full bg-secondary rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
