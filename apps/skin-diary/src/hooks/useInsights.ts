import { useMemo } from 'react';
import type { SkinRecord, Product, ProductInsight, VariableInsight } from '../types';
import { ALL_VARIABLES } from '../types';
import { calculateProductInsight, calculateVariableInsight } from '../utils/insights';

export function useInsights(records: Record<string, SkinRecord>, products: Product[]) {
  const totalRecordDays = useMemo(() => {
    return Object.values(records).filter(r => r.morningLog || r.nightLog).length;
  }, [records]);

  const hasEnoughData = totalRecordDays >= 7;

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
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }, [records, hasEnoughData]);

  const variableInsights = useMemo((): VariableInsight[] => {
    if (!hasEnoughData) return [];
    return ALL_VARIABLES
      .map(v => calculateVariableInsight(v, records))
      .filter(i => i.activeDays >= 3)
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }, [records, hasEnoughData]);

  return { totalRecordDays, hasEnoughData, productInsights, variableInsights };
}
