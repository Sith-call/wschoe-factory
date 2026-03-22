import { ModelOutput, SummaryItem } from '../types';

// Multiplier Effect
// Government spending ΔG → GDP change = ΔG × 1/(1-MPC)
// MPC = Marginal Propensity to Consume
// Multiplier = 1 / (1 - MPC)
// Shows rounds of spending: 1st → 2nd → 3rd → ... cumulative

const DEFAULT_MPC = 0.7;
const DEFAULT_DELTA_G = 10; // trillion won

export function computeMultiplier(vars: Record<string, number>): ModelOutput {
  const mpc = (vars['mpc'] ?? 70) / 100; // slider is 0-95, convert to decimal
  const deltaG = vars['deltaG'] ?? DEFAULT_DELTA_G;

  const multiplier = 1 / (1 - mpc);
  const totalEffect = deltaG * multiplier;

  const defaultMultiplier = 1 / (1 - DEFAULT_MPC);
  const defaultTotal = DEFAULT_DELTA_G * defaultMultiplier;

  // Generate rounds of spending as bar data
  const rounds = 8;
  const roundData: { round: number; spending: number; cumulative: number }[] = [];
  let cumulative = 0;
  for (let r = 0; r < rounds; r++) {
    const spending = deltaG * Math.pow(mpc, r);
    cumulative += spending;
    roundData.push({ round: r + 1, spending, cumulative });
  }

  // Create curves for bar chart representation
  // Each round as a curve segment
  const curves = roundData.map((rd, i) => ({
    id: `round-${rd.round}`,
    label: `${rd.round}차`,
    color: i === 0 ? '#ba1a1a' : i < 3 ? '#d4a24e' : '#c5c6cc',
    points: [
      { x: i, y: 0 },
      { x: i, y: Math.round(rd.spending * 10) / 10 },
    ],
  }));

  const totalChange = defaultTotal > 0
    ? Math.round(((totalEffect - defaultTotal) / defaultTotal) * 100)
    : 0;

  const summary: SummaryItem[] = [
    {
      label: '승수',
      valueBefore: defaultMultiplier.toFixed(1),
      valueAfter: multiplier.toFixed(1),
      changePercent: Math.round(((multiplier - defaultMultiplier) / defaultMultiplier) * 100),
      direction: multiplier > defaultMultiplier ? 'up' : multiplier < defaultMultiplier ? 'down' : 'neutral',
    },
    {
      label: 'GDP 총 변화',
      valueBefore: `${Math.round(defaultTotal)}조`,
      valueAfter: `${Math.round(totalEffect)}조`,
      changePercent: totalChange,
      direction: totalChange > 0 ? 'up' : totalChange < 0 ? 'down' : 'neutral',
    },
  ];

  return {
    curves,
    equilibrium: {
      price: totalEffect,
      quantity: deltaG,
      label: `총 효과 = ${Math.round(totalEffect)}조원`,
    },
    summary,
  };
}
