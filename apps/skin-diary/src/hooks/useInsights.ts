import { useMemo } from 'react';
import type { SkinRecord, Product, ProductInsight, VariableInsight, ComboInsight, KeywordTrend } from '../types';
import { ALL_VARIABLES } from '../types';
import {
  calculateProductInsight,
  calculateVariableInsight,
  findTopCombos,
  calculateKeywordTrends,
  calculateMiniInsight,
  type MiniInsight,
} from '../utils/insights';
import { getCustomVariables } from '../utils/storage';

export function useInsights(records: Record<string, SkinRecord>, products: Product[]) {
  const totalRecordDays = useMemo(() => {
    return Object.values(records).filter(r => r.morningLog || r.nightLog).length;
  }, [records]);

  const hasEnoughData = totalRecordDays >= 7;
  const hasMinimumData = totalRecordDays >= 3;

  // Product insights (7+ days)
  const productInsights = useMemo((): ProductInsight[] => {
    if (!hasEnoughData) return [];
    const uniqueNames = new Set<string>();
    for (const r of Object.values(records)) {
      if (r.nightLog) {
        r.nightLog.products.forEach(p => uniqueNames.add(p));
      }
    }
    return Array.from(uniqueNames)
      .map(name => calculateProductInsight(name, records))
      .filter(i => i.usedDays >= 3)
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }, [records, hasEnoughData]);

  // Variable insights (7+ days, includes custom variables)
  const variableInsights = useMemo((): VariableInsight[] => {
    if (!hasEnoughData) return [];

    const customVars = getCustomVariables();
    const allVarKeys: string[] = [
      ...ALL_VARIABLES,
      ...customVars.filter(v => !v.archived).map(v => v.id),
    ];

    return allVarKeys
      .map(v => calculateVariableInsight(v, records))
      .filter(i => i.activeDays >= 2)
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }, [records, hasEnoughData]);

  // Combo insights (V2)
  const comboInsights = useMemo((): ComboInsight[] => {
    if (!hasEnoughData) return [];
    const productNames = products.map(p => p.name);
    return findTopCombos(productNames, records);
  }, [records, products, hasEnoughData]);

  // Keyword trends (V2)
  const keywordTrends = useMemo((): KeywordTrend[] => {
    if (!hasMinimumData) return [];
    return calculateKeywordTrends(records);
  }, [records, hasMinimumData]);

  // Mini insight (V2 - 3+ days)
  const miniInsight = useMemo((): MiniInsight | null => {
    return calculateMiniInsight(records);
  }, [records]);

  return {
    totalRecordDays,
    hasEnoughData,
    hasMinimumData,
    productInsights,
    variableInsights,
    comboInsights,
    keywordTrends,
    miniInsight,
  };
}
