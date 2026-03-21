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
    const updated = { ...records };
    if (!updated[date]) {
      updated[date] = { date };
    }
    updated[date] = { ...updated[date], nightLog };
    updateRecords(updated);
  }, [records, updateRecords]);

  const saveMorningLog = useCallback((date: string, morningLog: MorningLog) => {
    const updated = { ...records };
    if (!updated[date]) {
      updated[date] = { date };
    }
    updated[date] = { ...updated[date], morningLog };
    updateRecords(updated);
  }, [records, updateRecords]);

  const loadRecords = useCallback((newRecords: Record<string, SkinRecord>) => {
    updateRecords(newRecords);
  }, [updateRecords]);

  return { records, saveNightLog, saveMorningLog, loadRecords, updateRecords };
}
