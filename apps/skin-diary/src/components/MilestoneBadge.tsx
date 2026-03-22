import React from 'react';
import type { Milestone } from '../types';
import { MILESTONE_LABELS } from '../types';

interface Props {
  milestone: Milestone;
  onDismiss?: () => void;
}

export function MilestoneBadge({ milestone, onDismiss }: Props) {
  return (
    <div className="bg-surface-container-low px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-outline-variant/10">
      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
        military_tech
      </span>
      <span className="text-xs font-medium text-on-surface-variant tracking-tight">
        {MILESTONE_LABELS[milestone.type]} 달성!
      </span>
      {onDismiss && !milestone.seen && (
        <button
          onClick={onDismiss}
          className="text-on-surface-variant/40 hover:text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-xs" style={{ fontSize: '14px' }}>close</span>
        </button>
      )}
    </div>
  );
}

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak < 1) return null;

  return (
    <div className="bg-surface-container-low px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-outline-variant/10">
      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
        local_fire_department
      </span>
      <span className="text-xs font-medium text-on-surface-variant tracking-tight">
        {streak}일 연속 기록 중!
      </span>
    </div>
  );
}
