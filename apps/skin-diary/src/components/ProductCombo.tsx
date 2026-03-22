import React from 'react';
import type { ComboInsight } from '../types';

interface Props {
  combo: ComboInsight;
}

export function ProductCombo({ combo }: Props) {
  const maxScore = Math.max(combo.avgScoreAOnly, combo.avgScoreBOnly, combo.avgScoreTogether, 1);

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden border-l-4 border-primary">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-body text-sm font-medium text-on-surface">
            {combo.productA} + {combo.productB}
          </h3>
          <span className="material-symbols-outlined text-primary-container">science</span>
        </div>

        <div className="relative h-24 flex items-end gap-3">
          {/* Product A only */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-container-highest rounded-t-lg transition-all"
              style={{ height: `${(combo.avgScoreAOnly / maxScore) * 100}%` }}
            />
            <span className="text-[10px] text-on-surface-variant truncate max-w-full">
              {combo.productA.split(' ').slice(-1)[0]}
            </span>
          </div>

          {/* Product B only */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-surface-container-highest rounded-t-lg transition-all"
              style={{ height: `${(combo.avgScoreBOnly / maxScore) * 100}%` }}
            />
            <span className="text-[10px] text-on-surface-variant truncate max-w-full">
              {combo.productB.split(' ').slice(-1)[0]}
            </span>
          </div>

          {/* Together (synergy) */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-lg shadow-lg transition-all"
              style={{ height: `${(combo.avgScoreTogether / maxScore) * 100}%` }}
            />
            <span className="text-[10px] font-bold text-primary">시너지</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>함께 사용 {combo.togetherDays}회</span>
          <span className={`font-bold serif-numbers ${combo.synergyScore > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
            {combo.synergyScore > 0 ? '+' : ''}{combo.synergyScore}점
          </span>
        </div>
      </div>
    </div>
  );
}
