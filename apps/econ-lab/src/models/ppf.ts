import { CurvePoint, ModelOutput, SummaryItem } from '../types';

// Production Possibilities Frontier (PPF)
// Concave curve showing tradeoff between two goods
// Q_B = sqrt(maxB^2 * (1 - (Q_A/maxA)^2))

const DEFAULT_TECH = 5;     // Technology level (shifts curve outward)
const DEFAULT_ALLOCATION = 50; // % allocated to Good A

export function computePPF(vars: Record<string, number>): ModelOutput {
  const tech = vars['technology'] ?? DEFAULT_TECH;
  const allocation = vars['allocation'] ?? DEFAULT_ALLOCATION;

  const maxA_default = 80 + DEFAULT_TECH * 8;
  const maxB_default = 80 + DEFAULT_TECH * 8;
  const maxA = 80 + tech * 8;
  const maxB = 80 + tech * 8;

  // Generate PPF curve (concave)
  const ppfPoints: CurvePoint[] = [];
  for (let qa = 0; qa <= maxA; qa += maxA / 40) {
    const ratio = qa / maxA;
    const qb = maxB * Math.sqrt(1 - ratio * ratio);
    ppfPoints.push({ x: Math.round(qa * 10) / 10, y: Math.round(qb * 10) / 10 });
  }

  // Default PPF for comparison
  const ppfDefaultPoints: CurvePoint[] = [];
  for (let qa = 0; qa <= maxA_default; qa += maxA_default / 40) {
    const ratio = qa / maxA_default;
    const qb = maxB_default * Math.sqrt(1 - ratio * ratio);
    ppfDefaultPoints.push({ x: Math.round(qa * 10) / 10, y: Math.round(qb * 10) / 10 });
  }

  // Current operating point on curve
  const currentA = maxA * (allocation / 100);
  const ratioA = currentA / maxA;
  const currentB = maxB * Math.sqrt(1 - ratioA * ratioA);

  const defaultA = maxA_default * (DEFAULT_ALLOCATION / 100);
  const ratioADefault = defaultA / maxA_default;
  const defaultB = maxB_default * Math.sqrt(1 - ratioADefault * ratioADefault);

  const aChange = defaultA > 0 ? Math.round(((currentA - defaultA) / defaultA) * 100) : 0;
  const bChange = defaultB > 0 ? Math.round(((currentB - defaultB) / defaultB) * 100) : 0;

  const summary: SummaryItem[] = [
    {
      label: '재화A 생산량',
      valueBefore: `${Math.round(defaultA)}`,
      valueAfter: `${Math.round(currentA)}`,
      changePercent: aChange,
      direction: aChange > 0 ? 'up' : aChange < 0 ? 'down' : 'neutral',
    },
    {
      label: '재화B 생산량',
      valueBefore: `${Math.round(defaultB)}`,
      valueAfter: `${Math.round(currentB)}`,
      changePercent: bChange,
      direction: bChange > 0 ? 'up' : bChange < 0 ? 'down' : 'neutral',
    },
  ];

  return {
    curves: [
      { id: 'ppf-current', label: 'PPF', color: '#ba1a1a', points: ppfPoints },
      ...(tech !== DEFAULT_TECH
        ? [{ id: 'ppf-default', label: 'PPF (기준)', color: '#c5c6cc', points: ppfDefaultPoints }]
        : []),
    ],
    equilibrium: {
      price: currentB,
      quantity: currentA,
      label: `A=${Math.round(currentA)}, B=${Math.round(currentB)}`,
    },
    summary,
  };
}
