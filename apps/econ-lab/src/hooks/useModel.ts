import { useState, useMemo, useCallback } from 'react';
import { ModelOutput, Variable } from '../types';
import { computeSupplyDemand } from '../models/supplyDemand';
import { computeElasticity } from '../models/elasticity';
import { computeGDP } from '../models/gdp';
import { computeInflation } from '../models/inflation';

const modelFunctions: Record<string, (vars: Record<string, number>) => ModelOutput> = {
  'supply-demand': computeSupplyDemand,
  'elasticity': computeElasticity,
  'gdp': computeGDP,
  'inflation': computeInflation,
};

export function useModel(modelId: string, variables: Variable[]) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    variables.forEach(v => {
      initial[v.id] = v.defaultValue;
    });
    return initial;
  });

  const updateVariable = useCallback((varId: string, value: number) => {
    setValues(prev => ({ ...prev, [varId]: value }));
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults: Record<string, number> = {};
    variables.forEach(v => {
      defaults[v.id] = v.defaultValue;
    });
    setValues(defaults);
  }, [variables]);

  const output = useMemo(() => {
    const fn = modelFunctions[modelId];
    if (!fn) return null;
    return fn(values);
  }, [modelId, values]);

  return {
    values,
    updateVariable,
    resetToDefaults,
    output,
  };
}
