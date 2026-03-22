import React from 'react';
import { SummaryItem } from '../types';

interface EquilibriumInfoProps {
  summary: SummaryItem[];
}

export const EquilibriumInfo: React.FC<EquilibriumInfoProps> = ({ summary }) => {
  return (
    <section className="px-8 py-6">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
        <h3 className="font-headline text-xs font-black text-on-surface-variant uppercase tracking-widest mb-4">
          현재 상태 요약
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {summary.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm font-body text-on-surface-variant">{item.label}</span>
              <div className="text-right">
                <span className="font-label text-sm font-bold text-primary">
                  {item.valueBefore} → {item.valueAfter}
                </span>
                <span
                  className={`ml-2 font-label text-xs font-bold ${
                    item.direction === 'up'
                      ? 'text-error'
                      : item.direction === 'down'
                        ? 'text-on-primary-container'
                        : 'text-on-surface-variant'
                  }`}
                >
                  {item.changePercent > 0 ? '+' : ''}{item.changePercent}%{' '}
                  {item.direction === 'up' ? '↑' : item.direction === 'down' ? '↓' : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
