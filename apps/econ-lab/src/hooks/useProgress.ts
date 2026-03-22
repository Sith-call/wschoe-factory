import { useState, useEffect, useCallback, useRef } from 'react';
import { ProgressData, Discovery } from '../types';
import { loadProgress, saveProgress } from '../utils/storage';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const sessionStart = useRef<number>(Date.now());

  // Update learning time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart.current) / 1000);
      if (elapsed > 0) {
        setProgress(prev => {
          const updated = {
            ...prev,
            totalLearningSeconds: prev.totalLearningSeconds + 10,
            lastVisit: new Date().toISOString(),
          };
          saveProgress(updated);
          return updated;
        });
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const markViewed = useCallback((conceptId: string) => {
    setProgress(prev => {
      if (prev.conceptsViewed.includes(conceptId)) return prev;
      const updated = {
        ...prev,
        conceptsViewed: [...prev.conceptsViewed, conceptId],
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const markExperimented = useCallback((conceptId: string) => {
    setProgress(prev => {
      if (prev.experimentsCompleted.includes(conceptId)) return prev;
      const updated = {
        ...prev,
        experimentsCompleted: [...prev.experimentsCompleted, conceptId],
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const addDiscovery = useCallback((discovery: Omit<Discovery, 'timestamp'>) => {
    setProgress(prev => {
      // Don't add duplicate discoveries
      if (prev.discoveries.some(d => d.id === discovery.id)) return prev;
      const updated = {
        ...prev,
        discoveries: [
          ...prev.discoveries,
          { ...discovery, timestamp: new Date().toISOString() },
        ],
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  return {
    progress,
    markViewed,
    markExperimented,
    addDiscovery,
    conceptsViewedCount: progress.conceptsViewed.length,
    experimentsCount: progress.experimentsCompleted.length,
    discoveriesCount: progress.discoveries.length,
    totalMinutes: Math.floor(progress.totalLearningSeconds / 60),
  };
}
