import type { SkinRecord, ProductInsight, VariableInsight, ComboInsight, KeywordTrend, SkinKeyword, WeeklyReport } from '../types';
import { getNextDate, subtractDays, getToday, getWeekStart, getWeekEnd } from './date';

// === Product Insight (V1 compatible) ===

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

// === Variable Insight (V2: supports custom variable strings) ===

export function calculateVariableInsight(
  variable: string,
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

// === Combo Analysis (V2) ===

export function calculateComboInsight(
  productA: string,
  productB: string,
  records: Record<string, SkinRecord>
): ComboInsight {
  const dates = Object.keys(records).sort();
  let togetherDays = 0;
  let togetherScore = 0;
  let aOnlyDays = 0;
  let aOnlyScore = 0;
  let bOnlyDays = 0;
  let bOnlyScore = 0;

  for (const date of dates) {
    const record = records[date];
    if (!record.nightLog) continue;

    const nextDate = getNextDate(date);
    const nextRecord = records[nextDate];
    if (!nextRecord?.morningLog) continue;

    const score = nextRecord.morningLog.score;
    const hasA = record.nightLog.products.includes(productA);
    const hasB = record.nightLog.products.includes(productB);

    if (hasA && hasB) {
      togetherDays++;
      togetherScore += score;
    } else if (hasA) {
      aOnlyDays++;
      aOnlyScore += score;
    } else if (hasB) {
      bOnlyDays++;
      bOnlyScore += score;
    }
  }

  const avgTogether = togetherDays > 0 ? togetherScore / togetherDays : 0;
  const avgAOnly = aOnlyDays > 0 ? aOnlyScore / aOnlyDays : 0;
  const avgBOnly = bOnlyDays > 0 ? bOnlyScore / bOnlyDays : 0;
  const baselineAvg = (aOnlyDays + bOnlyDays) > 0
    ? (aOnlyScore + bOnlyScore) / (aOnlyDays + bOnlyDays)
    : 0;

  return {
    productA,
    productB,
    togetherDays,
    avgScoreTogether: Math.round(avgTogether * 100) / 100,
    avgScoreAOnly: Math.round(avgAOnly * 100) / 100,
    avgScoreBOnly: Math.round(avgBOnly * 100) / 100,
    synergyScore: Math.round((avgTogether - baselineAvg) * 100) / 100,
  };
}

export function findTopCombos(
  products: string[],
  records: Record<string, SkinRecord>,
  maxResults = 3
): ComboInsight[] {
  const combos: ComboInsight[] = [];

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const combo = calculateComboInsight(products[i], products[j], records);
      if (combo.togetherDays >= 3) {
        combos.push(combo);
      }
    }
  }

  return combos
    .sort((a, b) => b.synergyScore - a.synergyScore)
    .slice(0, maxResults);
}

// === Keyword 2-Week Trend (V2) ===

export function calculateKeywordTrends(
  records: Record<string, SkinRecord>
): KeywordTrend[] {
  const today = getToday();
  const twoWeeksAgo = subtractDays(today, 14);
  const fourWeeksAgo = subtractDays(today, 28);

  const currentCounts: Record<string, number> = {};
  const previousCounts: Record<string, number> = {};

  for (const [date, record] of Object.entries(records)) {
    if (!record.morningLog) continue;

    for (const kw of record.morningLog.keywords) {
      if (date >= twoWeeksAgo && date <= today) {
        currentCounts[kw] = (currentCounts[kw] || 0) + 1;
      } else if (date >= fourWeeksAgo && date < twoWeeksAgo) {
        previousCounts[kw] = (previousCounts[kw] || 0) + 1;
      }
    }
  }

  const allKeywords = new Set([
    ...Object.keys(currentCounts),
    ...Object.keys(previousCounts),
  ]);

  const trends: KeywordTrend[] = [];
  for (const kw of allKeywords) {
    const current = currentCounts[kw] || 0;
    const previous = previousCounts[kw] || 0;
    const changePercent = previous > 0
      ? Math.round(((current - previous) / previous) * 100)
      : current > 0 ? 100 : 0;

    trends.push({
      keyword: kw as SkinKeyword,
      currentCount: current,
      previousCount: previous,
      changePercent,
    });
  }

  return trends
    .filter(t => t.currentCount > 0 || t.previousCount > 0)
    .sort((a, b) => b.currentCount - a.currentCount)
    .slice(0, 5);
}

// === 3-Day Mini Insight (V2) ===

export interface VariableKeywordCorrelation {
  variable: string;
  keyword: SkinKeyword;
  probability: number; // 0-100
  occurrences: number;
}

export interface MiniInsight {
  totalDays: number;
  avgScore: number;
  topKeywords: { keyword: SkinKeyword; count: number }[];
  topProduct?: string;
  scoreTrend: 'up' | 'down' | 'stable';
  correlations: VariableKeywordCorrelation[];
}

export function calculateMiniInsight(
  records: Record<string, SkinRecord>
): MiniInsight | null {
  const dates = Object.keys(records).sort().reverse();
  const recentDates = dates.filter(d => {
    const r = records[d];
    return r.morningLog || r.nightLog;
  }).slice(0, 7);

  if (recentDates.length < 3) return null;

  const scores: number[] = [];
  const keywordCounts: Record<string, number> = {};
  const productCounts: Record<string, number> = {};

  for (const date of recentDates) {
    const r = records[date];
    if (r.morningLog) {
      scores.push(r.morningLog.score);
      for (const kw of r.morningLog.keywords) {
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
      }
    }
    if (r.nightLog) {
      for (const p of r.nightLog.products) {
        productCounts[p] = (productCounts[p] || 0) + 1;
      }
    }
  }

  const avgScore = scores.length > 0
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : 0;

  const topKeywords = Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([keyword, count]) => ({ keyword: keyword as SkinKeyword, count }));

  const topProduct = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  const avgFirst = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
  const avgSecond = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
  const diff = avgFirst - avgSecond;
  const scoreTrend: 'up' | 'down' | 'stable' = diff > 0.3 ? 'up' : diff < -0.3 ? 'down' : 'stable';

  // Variable-keyword correlation analysis (3-day causal insight)
  const correlations: VariableKeywordCorrelation[] = [];
  const allDates = Object.keys(records).sort();

  // For each variable, check if next-day keywords correlate
  const variableDates: Record<string, string[]> = {};
  const noVariableDates: Record<string, string[]> = {};

  for (const date of allDates) {
    const r = records[date];
    if (!r.nightLog) continue;
    const nextDate = getNextDate(date);
    const nextR = records[nextDate];
    if (!nextR?.morningLog) continue;

    for (const v of r.nightLog.variables) {
      if (!variableDates[v]) variableDates[v] = [];
      variableDates[v].push(nextDate);
    }
  }

  // Calculate probability of each keyword appearing after each variable
  for (const [variable, nextDates] of Object.entries(variableDates)) {
    if (nextDates.length < 1) continue;
    const kwCounts: Record<string, number> = {};
    for (const nd of nextDates) {
      const r = records[nd];
      if (!r?.morningLog) continue;
      for (const kw of r.morningLog.keywords) {
        kwCounts[kw] = (kwCounts[kw] || 0) + 1;
      }
    }
    for (const [kw, count] of Object.entries(kwCounts)) {
      const prob = Math.round((count / nextDates.length) * 100);
      if (prob >= 50 && count >= 1) {
        correlations.push({
          variable,
          keyword: kw as SkinKeyword,
          probability: prob,
          occurrences: count,
        });
      }
    }
  }

  correlations.sort((a, b) => b.probability - a.probability);

  return {
    totalDays: recentDates.length,
    avgScore,
    topKeywords,
    topProduct,
    scoreTrend,
    correlations: correlations.slice(0, 3),
  };
}

// === Weekly Report Generation (V2) ===

export function generateWeeklyReport(
  records: Record<string, SkinRecord>,
  weekStartDate?: string
): WeeklyReport | null {
  const today = getToday();
  const weekStart = weekStartDate || getWeekStart(subtractDays(today, 7));
  const weekEnd = getWeekEnd(weekStart);

  const weekDates: string[] = [];
  let current = weekStart;
  while (current <= weekEnd) {
    weekDates.push(current);
    const d = new Date(current + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    current = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const scores: number[] = [];
  const productScores: Record<string, number[]> = {};
  const variableScores: Record<string, number[]> = {};
  const keywordCounts: Record<string, number> = {};
  let recordDays = 0;

  for (const date of weekDates) {
    const r = records[date];
    if (!r) continue;
    if (r.morningLog || r.nightLog) recordDays++;

    if (r.morningLog) {
      scores.push(r.morningLog.score);
      for (const kw of r.morningLog.keywords) {
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
      }
    }

    if (r.nightLog) {
      const nextDate = getNextDate(date);
      const nextR = records[nextDate];
      if (nextR?.morningLog) {
        const score = nextR.morningLog.score;
        for (const p of r.nightLog.products) {
          if (!productScores[p]) productScores[p] = [];
          productScores[p].push(score);
        }
        for (const v of r.nightLog.variables) {
          if (!variableScores[v]) variableScores[v] = [];
          variableScores[v].push(score);
        }
      }
    }
  }

  if (recordDays < 3) return null;

  const avgScore = scores.length > 0
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : 0;

  // Score trend: compare first half vs second half
  const midpoint = Math.floor(scores.length / 2);
  const firstHalf = scores.slice(0, midpoint);
  const secondHalf = scores.slice(midpoint);
  const avgFirst = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
  const avgSecond = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
  const scoreTrend: 'up' | 'down' | 'stable' =
    avgSecond - avgFirst > 0.3 ? 'up' : avgSecond - avgFirst < -0.3 ? 'down' : 'stable';

  // Best product (highest avg score)
  let topPositiveProduct: string | undefined;
  let bestAvg = 0;
  for (const [name, pScores] of Object.entries(productScores)) {
    const avg = pScores.reduce((a, b) => a + b, 0) / pScores.length;
    if (avg > bestAvg && pScores.length >= 2) {
      bestAvg = avg;
      topPositiveProduct = name;
    }
  }

  // Worst variable (lowest avg score)
  let topNegativeVariable: string | undefined;
  let worstAvg = 6;
  for (const [name, vScores] of Object.entries(variableScores)) {
    const avg = vScores.reduce((a, b) => a + b, 0) / vScores.length;
    if (avg < worstAvg && vScores.length >= 2) {
      worstAvg = avg;
      topNegativeVariable = name;
    }
  }

  const keywordChanges = Object.entries(keywordCounts)
    .map(([keyword, count]) => ({ keyword: keyword as SkinKeyword, change: count }))
    .sort((a, b) => b.change - a.change)
    .slice(0, 5);

  return {
    weekStart,
    weekEnd,
    avgScore,
    scoreTrend,
    topPositiveProduct,
    topNegativeVariable,
    keywordChanges,
    recordDays,
    generatedAt: new Date().toISOString(),
  };
}

// === Streak Calculation ===

export function calculateStreak(records: Record<string, SkinRecord>): number {
  const today = getToday();
  let streak = 0;
  let current = today;

  while (true) {
    const r = records[current];
    if (r && (r.morningLog || r.nightLog)) {
      streak++;
      current = subtractDays(current, 1);
    } else {
      break;
    }
  }

  return streak;
}

// === Recording Rate ===

export function calculateRecordingRate(
  records: Record<string, SkinRecord>,
  days: number = 30
): { rate: number; recorded: number; total: number } {
  const today = getToday();
  let recorded = 0;

  for (let i = 0; i < days; i++) {
    const date = subtractDays(today, i);
    const r = records[date];
    if (r && (r.morningLog || r.nightLog)) {
      recorded++;
    }
  }

  return {
    rate: Math.round((recorded / days) * 100),
    recorded,
    total: days,
  };
}
