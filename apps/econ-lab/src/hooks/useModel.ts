import { useState, useMemo, useCallback } from 'react';
import { ModelOutput, Variable } from '../types';
import { computeSupplyDemand } from '../models/supplyDemand';
import { computeElasticity } from '../models/elasticity';
import { computeGDP } from '../models/gdp';
import { computeInflation } from '../models/inflation';
import { computePPF } from '../models/ppf';
import { computeComparativeAdvantage } from '../models/comparativeAdvantage';
import { computeMultiplier } from '../models/multiplier';
import { computeISLM } from '../models/islm';
import { computeAdAs } from '../models/adAs';
import { computeCrowdingOut } from '../models/crowdingOut';
import { computeGdpGap } from '../models/gdpGap';
import { computeLiquidityTrap } from '../models/liquidityTrap';
import { computeSunkCost } from '../models/sunkCost';

const modelFunctions: Record<string, (vars: Record<string, number>) => ModelOutput> = {
  'supply-demand': computeSupplyDemand,
  'elasticity': computeElasticity,
  'gdp': computeGDP,
  'inflation': computeInflation,
  'ppf': computePPF,
  'comparative-advantage': computeComparativeAdvantage,
  'multiplier': computeMultiplier,
  'is-lm': computeISLM,
  'ad-as': computeAdAs,
  'crowding-out': computeCrowdingOut,
  'gdp-gap': computeGdpGap,
  'liquidity-trap': computeLiquidityTrap,
  'sunk-cost': computeSunkCost,
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

  const setPreset = useCallback((presetValues: Record<string, number>) => {
    setValues(prev => ({ ...prev, ...presetValues }));
  }, []);

  const output = useMemo(() => {
    const fn = modelFunctions[modelId];
    if (!fn) return null;
    return fn(values);
  }, [modelId, values]);

  return {
    values,
    updateVariable,
    resetToDefaults,
    setPreset,
    output,
  };
}
