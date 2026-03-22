import { CurvePoint, ModelOutput, SummaryItem } from '../types';

// Fisher Equation: MV = PY
// M: Money supply, V: Velocity, P: Price level, Y: Real GDP
// P = MV / Y
// We keep Y constant and let user change M and V

const DEFAULT_M = 50;
const DEFAULT_V = 5;
const Y = 100; // constant real GDP

export function computeInflation(vars: Record<string, number>): ModelOutput {
  const m = vars['moneySupply'] ?? DEFAULT_M;
  const v = vars['velocity'] ?? DEFAULT_V;

  const defaultP = (DEFAULT_M * DEFAULT_V) / Y;
  const currentP = (m * v) / Y;

  const priceChange = defaultP > 0
    ? Math.round(((currentP - defaultP) / defaultP) * 100)
    : 0;

  // Generate curve: M on x-axis, P on y-axis for different velocities
  const currentVCurve: CurvePoint[] = [];
  const defaultVCurve: CurvePoint[] = [];

  for (let money = 10; money <= 100; money += 2) {
    const pCurrent = (money * v) / Y;
    const pDefault = (money * DEFAULT_V) / Y;
    if (pCurrent <= 20) {
      currentVCurve.push({ x: money, y: pCurrent * 10 }); // scale for visibility
    }
    if (pDefault <= 20) {
      defaultVCurve.push({ x: money, y: pDefault * 10 });
    }
  }

  const summary: SummaryItem[] = [
    {
      label: '물가 수준 (P)',
      valueBefore: defaultP.toFixed(1),
      valueAfter: currentP.toFixed(1),
      changePercent: priceChange,
      direction: priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral',
    },
    {
      label: '통화량 x 유통속도',
      valueBefore: `${DEFAULT_M * DEFAULT_V}`,
      valueAfter: `${m * v}`,
      changePercent: Math.round(((m * v - DEFAULT_M * DEFAULT_V) / (DEFAULT_M * DEFAULT_V)) * 100),
      direction: m * v > DEFAULT_M * DEFAULT_V ? 'up' : m * v < DEFAULT_M * DEFAULT_V ? 'down' : 'neutral',
    },
  ];

  return {
    curves: [
      { id: 'pv-current', label: `V=${v}`, color: '#ba1a1a', points: currentVCurve },
      { id: 'pv-default', label: `V=${DEFAULT_V} (기준)`, color: '#c5c6cc', points: defaultVCurve },
    ],
    equilibrium: {
      price: currentP,
      quantity: m,
      label: `P = ${currentP.toFixed(1)}`,
    },
    summary,
  };
}
