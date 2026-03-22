import { useState, useCallback } from 'react';
import type { SkinRecord, NightLog, MorningLog } from '../types';
import { getRecords, saveRecords } from '../utils/storage';

export function useRecords() {
  const [records, setRecords] = useState<Record<string, SkinRecord>>(() => getRecords());

  const updateRecords = useCallback((newRecords: Record<string, SkinRecord>) => {
    setRecords(newRecords);
    saveRecords(newRecords);
  }, []);

  const saveNightLog = useCallback((date: string, nightLog: NightLog) => {
    setRecords(prev => {
      const updated = {
        ...prev,
        [date]: {
          ...prev[date],
          date,
          nightLog,
        },
      };
      saveRecords(updated);
      return updated;
    });
  }, []);

  const saveMorningLog = useCallback((date: string, morningLog: MorningLog) => {
    setRecords(prev => {
      const updated = {
        ...prev,
        [date]: {
          ...prev[date],
          date,
          morningLog,
        },
      };
      saveRecords(updated);
      return updated;
    });
  }, []);

  const loadRecords = useCallback((newRecords: Record<string, SkinRecord>) => {
    updateRecords(newRecords);
  }, [updateRecords]);

  return { records, saveNightLog, saveMorningLog, loadRecords };
}
