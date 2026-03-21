/**
 * Score calculation and percentile logic.
 */

/**
 * Calculate score for a single round.
 * roundScore = max(0, (10 - reactionSeconds) * level * 10)
 */
export function calculateRoundScore(
  reactionMs: number,
  level: number
): number {
  const seconds = reactionMs / 1000;
  return Math.max(0, Math.round((10 - seconds) * level * 10));
}

/**
 * Approximate error function for normal distribution.
 */
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function erfc(x: number): number {
  return 1 - erf(x);
}

/**
 * Calculate percentile from score.
 * Bell curve simulation: mean 3000, stddev 1500.
 */
/**
 * Calculate "top X%" percentile from score.
 * Returns a value where lower = better (e.g., top 1% is best).
 * Bell curve simulation: mean 3000, stddev 1500.
 */
export function calculatePercentile(score: number): number {
  const mean = 3000;
  const stdDev = 1500;
  const z = (score - mean) / stdDev;
  // CDF gives "what percentage scored below this score"
  const cdf = Math.round(
    (1 - 0.5 * erfc(z / Math.sqrt(2))) * 100
  );
  // Convert to "top X%" — higher scores = lower (better) top %
  const topPercent = 100 - cdf;
  return Math.min(99, Math.max(1, topPercent));
}

/**
 * Grade table based on score ranges.
 */
export interface Grade {
  grade: string;
  title: string;
  percentileLabel: string;
  badgeColor: string;
}

export function getGrade(score: number): Grade {
  if (score >= 3600)
    return {
      grade: 'S+',
      title: '초인의 눈',
      percentileLabel: '상위 1%',
      badgeColor: '#7c3aed',
    };
  if (score >= 3200)
    return {
      grade: 'S',
      title: '프로 디자이너급',
      percentileLabel: '상위 5%',
      badgeColor: '#7c3aed',
    };
  if (score >= 2800)
    return {
      grade: 'A',
      title: '예리한 눈',
      percentileLabel: '상위 15%',
      badgeColor: '#2563eb',
    };
  if (score >= 2400)
    return {
      grade: 'B+',
      title: '꽤 좋은 감각',
      percentileLabel: '상위 30%',
      badgeColor: '#22c55e',
    };
  if (score >= 2000)
    return {
      grade: 'B',
      title: '평균 이상',
      percentileLabel: '상위 50%',
      badgeColor: '#22c55e',
    };
  if (score >= 1500)
    return {
      grade: 'C',
      title: '보통',
      percentileLabel: '상위 70%',
      badgeColor: '#71717a',
    };
  if (score >= 1000)
    return {
      grade: 'D',
      title: '조금 아쉬운',
      percentileLabel: '상위 85%',
      badgeColor: '#a1a1aa',
    };
  return {
    grade: 'F',
    title: '색맹은 아니죠...?',
    percentileLabel: '하위 15%',
    badgeColor: '#e4e4e7',
  };
}

export function getGradeBadgeTextColor(grade: string): string {
  return grade === 'F' ? '#71717a' : '#ffffff';
}
