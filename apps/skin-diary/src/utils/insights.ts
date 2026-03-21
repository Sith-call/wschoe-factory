import type { SkinRecord, ProductInsight, VariableInsight, Variable } from '../types';
import { getNextDate } from './date';

export function calculateProductInsight(
  productName: string,
  records: Record<string, SkinRecord>
): ProductInsight {
  const dates = Object.keys(records).sort();
  let usedDays = 0;
  let usedScoreSum = 0;
  let notUsedDays = 0;
  let notUsedScoreSum = 0;

  for (const date of dates) {
    const record = records[date];
    if (!record.nightLog) continue;

    const nextDate = getNextDate(date);
    const nextRecord = records[nextDate];
    if (!nextRecord?.morningLog) continue;

    const nextScore = nextRecord.morningLog.score;

    if (record.nightLog.products.includes(productName)) {
      usedDays++;
      usedScoreSum += nextScore;
    } else {
      notUsedDays++;
      notUsedScoreSum += nextScore;
    }
  }

  const avgUsed = usedDays > 0 ? usedScoreSum / usedDays : 0;
  const avgNotUsed = notUsedDays > 0 ? notUsedScoreSum / notUsedDays : 0;

  return {
    productName,
    usedDays,
    avgScoreWhenUsed: Math.round(avgUsed * 100) / 100,
    avgScoreWhenNotUsed: Math.round(avgNotUsed * 100) / 100,
    impact: Math.round((avgUsed - avgNotUsed) * 100) / 100,
  };
}

export function calculateVariableInsight(
  variable: Variable,
  records: Record<string, SkinRecord>
): VariableInsight {
  const dates = Object.keys(records).sort();
  let activeDays = 0;
  let activeScoreSum = 0;
  let inactiveDays = 0;
  let inactiveScoreSum = 0;

  for (const date of dates) {
    const record = records[date];
    if (!record.nightLog) continue;

    const nextDate = getNextDate(date);
    const nextRecord = records[nextDate];
    if (!nextRecord?.morningLog) continue;

    const nextScore = nextRecord.morningLog.score;

    if (record.nightLog.variables.includes(variable)) {
      activeDays++;
      activeScoreSum += nextScore;
    } else {
      inactiveDays++;
      inactiveScoreSum += nextScore;
    }
  }

  const avgActive = activeDays > 0 ? activeScoreSum / activeDays : 0;
  const avgInactive = inactiveDays > 0 ? inactiveScoreSum / inactiveDays : 0;

  return {
    variable,
    activeDays,
    avgScoreWhenActive: Math.round(avgActive * 100) / 100,
    avgScoreWhenInactive: Math.round(avgInactive * 100) / 100,
    impact: Math.round((avgActive - avgInactive) * 100) / 100,
  };
}
