import { useState, useCallback } from 'react';
import type { CustomVariable } from '../types';
import {
  getPinnedVariables,
  savePinnedVariables,
  getCustomVariables,
  saveCustomVariables,
} from '../utils/storage';

export function usePresets() {
  const [pinnedVariables, setPinnedVariables] = useState<string[]>(() => getPinnedVariables());
  const [customVariables, setCustomVariables] = useState<CustomVariable[]>(() => getCustomVariables());

  // Pinned variables
  const togglePinned = useCallback((varKey: string) => {
    setPinnedVariables(prev => {
      const updated = prev.includes(varKey)
        ? prev.filter(v => v !== varKey)
        : [...prev, varKey];
      savePinnedVariables(updated);
      return updated;
    });
  }, []);

  const isPinned = useCallback((varKey: string) => {
    return pinnedVariables.includes(varKey);
  }, [pinnedVariables]);

  // Custom variables
  const addCustomVariable = useCallback((label: string) => {
    const id = `custom_${Date.now()}`;
    const newVar: CustomVariable = {
      id,
      label,
      createdAt: new Date().toISOString(),
    };
    setCustomVariables(prev => {
      const updated = [...prev, newVar];
      saveCustomVariables(updated);
      return updated;
    });
    return newVar;
  }, []);

  const removeCustomVariable = useCallback((id: string) => {
    setCustomVariables(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, archived: true } : v);
      saveCustomVariables(updated);
      return updated;
    });
    // Also remove from pinned if pinned
    setPinnedVariables(prev => {
      const updated = prev.filter(v => v !== id);
      savePinnedVariables(updated);
      return updated;
    });
  }, []);

  const activeCustomVariables = customVariables.filter(v => !v.archived);

  const loadPresets = useCallback((pinned: string[], custom: CustomVariable[]) => {
    setPinnedVariables(pinned);
    savePinnedVariables(pinned);
    setCustomVariables(custom);
    saveCustomVariables(custom);
  }, []);

  return {
    pinnedVariables,
    customVariables,
    activeCustomVariables,
    togglePinned,
    isPinned,
    addCustomVariable,
    removeCustomVariable,
    loadPresets,
  };
}
