import { useState, useCallback, useMemo } from 'react';
import type { Milestone, SkinRecord } from '../types';
import { MILESTONE_DAYS, MILESTONE_TYPES } from '../types';
import { getMilestones, saveMilestones } from '../utils/storage';
import { calculateStreak } from '../utils/insights';

export function useMilestones(records: Record<string, SkinRecord>) {
  const [milestones, setMilestones] = useState<Milestone[]>(() => getMilestones());

  const streak = useMemo(() => calculateStreak(records), [records]);

  const checkAndAwardMilestones = useCallback(() => {
    const currentMilestones = [...milestones];
    let changed = false;

    for (const type of MILESTONE_TYPES) {
      const requiredDays = MILESTONE_DAYS[type];
      const alreadyAchieved = currentMilestones.find(m => m.type === type);

      if (streak >= requiredDays && !alreadyAchieved) {
        currentMilestones.push({
          type,
          achievedAt: new Date().toISOString(),
          seen: false,
        });
        changed = true;
      }
    }

    if (changed) {
      setMilestones(currentMilestones);
      saveMilestones(currentMilestones);
    }

    return currentMilestones;
  }, [milestones, streak]);

  const markMilestoneSeen = useCallback((type: Milestone['type']) => {
    const updated = milestones.map(m =>
      m.type === type ? { ...m, seen: true } : m
    );
    setMilestones(updated);
    saveMilestones(updated);
  }, [milestones]);

  const unseenMilestone = useMemo(() => {
    return milestones.find(m => !m.seen) || null;
  }, [milestones]);

  const latestMilestone = useMemo(() => {
    if (milestones.length === 0) return null;
    return milestones.sort((a, b) =>
      MILESTONE_TYPES.indexOf(b.type) - MILESTONE_TYPES.indexOf(a.type)
    )[0];
  }, [milestones]);

  const loadMilestones = useCallback((newMilestones: Milestone[]) => {
    setMilestones(newMilestones);
    saveMilestones(newMilestones);
  }, []);

  return {
    milestones,
    streak,
    unseenMilestone,
    latestMilestone,
    checkAndAwardMilestones,
    markMilestoneSeen,
    loadMilestones,
  };
}
